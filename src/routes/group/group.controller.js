import express from 'express';
import { omit, merge, isEqual } from 'lodash';
import models from '../../models';
import { BadRequestError, flattenPermission, SuccessResponse } from '../../utils/helper';
import { groupCreateSchema } from './validationSchema';
import { Request, RequestBodyValidator } from '../../utils/decorators';
import {
  deleteGroupPermissionsQuery,
  getByNameQuery,
  getGroupByIdQuery,
  getUsersByGroupIdQuery,
  listQuery,
  nameExistQuery,
} from './query';
import WebSocket from '../../lib/webSocket';
import { STATUS_CODES } from '../../utils/constants';
import Acl from '../../lib/acl';

const { Group, GroupPermission, UserGroup } = models;
const userMap = new WebSocket();
class GroupController {
  static router;

  static getRouter() {
    this.router = express.Router();
    this.router.post('/', this.createGroup);
    this.router.get('/', this.list);
    this.router.get('/:id/users', this.getUsersByGroupId);
    this.router.get('/:id', this.getGroupById);
    this.router.put('/:id', this.updateGroup);
    this.router.delete('/', this.deleteGroup);

    return this.router;
  }

  @Request
  static async list(req, res) {
    const {
      query: { name },
    } = req;
    const query = listQuery({ name });
    const groups = await Group.findAll(query);
    const groupResponse = flattenPermission(groups);
    return SuccessResponse(res, groupResponse);
  }

  @Request
  static async getUsersByGroupId(req, res) {
    const {
      params: { id: groupId },
    } = req;
    if (!groupId) {
      BadRequestError(`Group id is required`, STATUS_CODES.INVALID_INPUT);
    }
    const query = getUsersByGroupIdQuery(groupId);
    const users = await UserGroup.findAll(query);
    const usersResponse = GroupController.flattenUsers(users);
    return SuccessResponse(res, usersResponse);
  }

  @Request
  static async getGroupById(req, res) {
    const {
      params: { id: groupId },
    } = req;
    if (!groupId) {
      BadRequestError(`Group id is required`, STATUS_CODES.INVALID_INPUT);
    }
    const query = getGroupByIdQuery(groupId);
    const groupResponse = await Group.findOne(query);
    if (!groupResponse) {
      BadRequestError(`Group does not exist`, STATUS_CODES.NOTFOUND);
    }
    const groups = flattenPermission([groupResponse]);
    return SuccessResponse(res, groups);
  }

  @RequestBodyValidator(groupCreateSchema)
  @Request
  static async createGroup(req, res) {
    const { body: groupPayload, user } = req;
    groupPayload.createdBy = user.id;
    const { name, resources } = groupPayload;
    const query = getByNameQuery(name);
    const groupNameExist = await Group.findOne(query);
    if (!groupNameExist) {
      const group = await Group.create(omit(groupPayload, ['resources']));
      const groupResponse = group.toJSON();
      const groupPermissionPromises = GroupController.createGroupPermissions(
        groupResponse.id,
        resources
      );
      await Promise.all(groupPermissionPromises);
      Acl.updateAccessControlList();
      return SuccessResponse(res, groupResponse);
    }
    BadRequestError(`Group name already exists`, STATUS_CODES.INVALID_INPUT);
  }

  @Request
  static async deleteGroup(req, res) {
    const {
      body: { ids: groupIds = [] },
    } = req;

    if (groupIds.length < 1) {
      BadRequestError(`Group id is required`, STATUS_CODES.INVALID_INPUT);
    }
    const query = {
      where: {
        id: groupIds,
      },
    };
    await GroupController.sendMessageToRelatedUsers(groupIds);
    const groupCount = await Group.destroy(query);
    Acl.updateAccessControlList();
    return SuccessResponse(res, { count: groupCount });
  }

  static createGroupPermissions(groupId, resources) {
    return resources.map(({ id, permissions }) => {
      const groupPermissionCreationParams = {
        groupId,
        resourceId: id,
        permission: permissions,
      };
      return GroupPermission.create(groupPermissionCreationParams);
    });
  }

  static flattenUsers(users) {
    return users?.map((value) => {
      const groupUser = value.toJSON();
      const user = merge(groupUser, groupUser.user);
      delete groupUser.user;
      return user;
    });
  }

  @RequestBodyValidator(groupCreateSchema)
  @Request
  static async updateGroup(req, res) {
    const {
      body: groupPayload,
      params: { id: groupId },
    } = req;
    let groupNameExist;
    const { resources, name: groupName } = groupPayload;
    const updateQuery = getGroupByIdQuery(groupId);

    const nameQuery = nameExistQuery(groupId, groupName);
    const groupExists = await Group.findOne(updateQuery);
    if (!groupExists) {
      BadRequestError(`Group does not exist`, STATUS_CODES.NOTFOUND);
    }
    const [flattenedGroupExists] = flattenPermission([groupExists]);
    if (flattenedGroupExists.name !== groupName) {
      groupNameExist = await Group.findOne(nameQuery);
    }
    if (groupNameExist) {
      BadRequestError(`Group name already exists`, STATUS_CODES.INVALID_INPUT);
    }
    if (flattenedGroupExists) {
      const group = await Group.update(groupPayload, updateQuery);
      await GroupPermission.destroy(deleteGroupPermissionsQuery(groupId));
      const groupPermissionPromises = GroupController.createGroupPermissions(groupId, resources);
      await Promise.all(groupPermissionPromises);
      if (resources?.length > 0 && !isEqual(flattenedGroupExists.resources, resources)) {
        await GroupController.sendMessageToRelatedUsers(groupId);
      }
      Acl.updateAccessControlList();
      return SuccessResponse(res, group);
    }
  }

  static async sendMessageToRelatedUsers(groupId) {
    const query = getUsersByGroupIdQuery(groupId);
    const usersData = await UserGroup.findAll(query);
    const users = GroupController.flattenUsers(usersData);
    users?.map(({ id }) => userMap.sendMessage(id, 'Permissions Updated'));
  }
}

export default GroupController;
