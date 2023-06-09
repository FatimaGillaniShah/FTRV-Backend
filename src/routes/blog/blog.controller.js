import Joi from 'joi';
import express from 'express';
import _ from 'lodash';
import models from '../../models/index';

import {
  stripHtmlTags,
  BadRequestError,
  getErrorMessages,
  SuccessResponse,
  generatePreSignedUrlForGetObject,
  cleanUnusedFiles,
  convertType,
} from '../../utils/helper';
import { blogCreateSchema, blogUpdateSchema } from './validationSchemas';
import { listQuery } from './query';
import uploadFile from '../../middlewares/upload';
import { STATUS_CODES } from '../../utils/constants';

const { Blog, User } = models;

class BlogController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.get('/', this.list);
    this.router.post('/', uploadFile('image').single('file'), this.createBlog);
    this.router.get('/:id', this.getBlogById);
    this.router.put('/:id', uploadFile('image').single('file'), this.updateBlog);
    this.router.delete('/', this.deleteBlogs);

    return this.router;
  }

  static generatePreSignedUrl(blogs) {
    blogs.forEach((blog) => {
      if (blog.thumbnail) {
        // eslint-disable-next-line no-param-reassign
        blog.thumbnail = generatePreSignedUrlForGetObject(blog.thumbnail);
      }
    });
  }

  static async list(req, res, next) {
    const {
      query: { sortColumn, sortOrder, pageNumber = 1, pageSize, isPagination },
    } = req;
    try {
      const query = listQuery({
        sortColumn,
        sortOrder,
        pageNumber,
        pageSize,
        isPagination,
      });
      const blogs = await Blog.findAndCountAll(query);
      BlogController.generatePreSignedUrl(blogs.rows);
      return SuccessResponse(res, blogs);
    } catch (e) {
      next(e);
    }
  }

  static async createBlog(req, res, next) {
    const { body: blogPayload, file = {}, user } = req;
    try {
      const result = Joi.validate(blogPayload, blogCreateSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }

      blogPayload.userId = user.id;
      blogPayload.thumbnail = file.key;
      blogPayload.shortText = stripHtmlTags(blogPayload.content).substring(0, 200);
      const blog = await Blog.create(blogPayload);
      const blogResponse = blog.toJSON();
      return SuccessResponse(res, blogResponse);
    } catch (e) {
      next(e);
    }
  }

  static async getBlogById(req, res, next) {
    const {
      params: { id },
    } = req;

    try {
      if (!id) {
        BadRequestError(`Blog id is required`, STATUS_CODES.INVALID_INPUT);
      }
      const blog = await Blog.findOne({
        where: {
          id,
        },
        include: [{ model: User, as: 'user', attributes: ['firstName', 'lastName'] }],
      });
      if (!blog) {
        BadRequestError(`Blog does not exist`, STATUS_CODES.NOTFOUND);
      }
      BlogController.generatePreSignedUrl([blog]);
      return SuccessResponse(res, blog);
    } catch (e) {
      next(e);
    }
  }

  static async updateBlog(req, res, next) {
    const {
      body: blogPayload,
      file = {},
      params: { id },
    } = req;
    try {
      const blogId = convertType(id);
      if (!blogId) {
        BadRequestError(`Blog does not exist`, STATUS_CODES.INVALID_INPUT);
      }
      const result = Joi.validate(blogPayload, blogUpdateSchema);
      if (result.error) {
        BadRequestError(getErrorMessages(result), STATUS_CODES.INVALID_INPUT);
      }
      const query = {
        where: {
          id: blogId,
        },
      };

      const blogExists = await Blog.findOne(query);
      if (blogExists) {
        if (blogPayload.file === '') {
          blogPayload.thumbnail = '';
        } else {
          blogPayload.thumbnail = file.key;
        }
        blogPayload.shortText = stripHtmlTags(blogPayload.content).substring(0, 200);
        const blog = await Blog.update(blogPayload, query);
        if (
          (file.key && blogExists.thumbnail) ||
          (blogExists.thumbnail && blogPayload.file === '')
        ) {
          const avatarKeyObj = [{ Key: blogExists.thumbnail }];
          cleanUnusedFiles(avatarKeyObj);
        }
        return SuccessResponse(res, blog);
      }
      BadRequestError(`Blog does not exists`, STATUS_CODES.NOTFOUND);
    } catch (e) {
      next(e);
    }
  }

  static async deleteBlogs(req, res, next) {
    const {
      body: { id },
    } = req;
    try {
      const query = {
        where: {
          id,
        },
      };
      const blogs = await Blog.findAll(query);
      const blogKeyobjects = _.chain(blogs)
        .filter((blog) => !!blog.thumbnail)
        .map((blog) => ({ Key: blog.thumbnail }))
        .value();
      const blogsCount = await Blog.destroy(query);
      if (blogKeyobjects.length > 0) {
        cleanUnusedFiles(blogKeyobjects);
      }
      return SuccessResponse(res, { count: blogsCount });
    } catch (e) {
      next(e);
    }
  }
}

export default BlogController;
