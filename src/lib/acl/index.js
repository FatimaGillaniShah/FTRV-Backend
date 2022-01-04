import AccessControl from 'accesscontrol';
import app from '../../app';
import models from '../../models';
import { defaultGroup, defaultPermissions } from '../../utils/constants';
import { query } from './query';

const { Group } = models;

class Acl {
  constructor() {
    this.accessControl = new AccessControl();
  }

  async updateAccessControlList() {
    this.accessControl = new AccessControl();
    const permissionObj = {
      read: ['readAny'],
      write: ['readAny', 'createAny', 'updateAny', 'deleteAny'],
    };
    const groups = await Group.findAll(query());
    groups.forEach(({ name: groupName, resources }) => {
      resources.map((resource) =>
        resource.resourcePermission.permission.map((value) => {
          const action = permissionObj[value];
          action.map((val, index) =>
            this.accessControl.grant(groupName)[action[index]](resource.slug)
          );
          return false;
        })
      );
    });
    // profile permission
    defaultPermissions.forEach(({ slug }) => {
      if (slug === 'DIRECTORY') {
        this.accessControl.grant(defaultGroup).updateOwn(slug);
        this.accessControl.grant(defaultGroup).readOwn(slug);
      } else {
        this.accessControl.grant(defaultGroup).readAny(slug);
      }
    });
    app.set('acl', this.accessControl);
    return this.accessControl;
  }
}
export default new Acl();
