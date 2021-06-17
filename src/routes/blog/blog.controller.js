import Joi from 'joi';
import express from 'express';
import models from '../../models';

import {
  stripHtmlTags,
  BadRequestError,
  getErrorMessages,
  SuccessResponse,
  generatePreSignedUrlForGetObject,
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
    blogs?.forEach((blog) => {
      if (blog.thumbnail) {
        // eslint-disable-next-line no-param-reassign
        blog.thumbnail = generatePreSignedUrlForGetObject(blog.thumbnail);
      }
    });
  }

  static async list(req, res, next) {
    const {
      query: { sortColumn, sortOrder, pageNumber = 1, pageSize },
    } = req;
    try {
      const query = listQuery({
        sortColumn,
        sortOrder,
        pageNumber,
        pageSize,
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
      params: { id: blogId },
    } = req;
    try {
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
        blogPayload.thumbnail = file.key;
        blogPayload.shortText = stripHtmlTags(blogPayload.content).substring(0, 200);
        const blog = await Blog.update(blogPayload, query);
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
      const blogs = await Blog.destroy({
        where: {
          id,
        },
      });
      return SuccessResponse(res, { count: blogs });
    } catch (e) {
      next(e);
    }
  }
}

export default BlogController;
