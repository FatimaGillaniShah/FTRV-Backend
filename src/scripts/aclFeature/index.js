import debugObj from 'debug';
import { createDemoGroups } from './1-demo-groups';
import { createDemoGroupPermissions } from './2-demo-group-permissions';
import { createUserGroups } from './3-user-group';

const debug = debugObj('scripts:acl-feature');

export const aclFeature = async () => {
  await createDemoGroups();
  debug('Demo Groups created Successfully');
  await createDemoGroupPermissions();
  debug('Demo Group Permissions created Successfully');
  await createUserGroups();
  debug('User Group created Successfully');
};
