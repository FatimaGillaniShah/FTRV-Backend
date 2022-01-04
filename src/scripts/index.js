import { aclFeature } from './aclFeature';

const args = process.argv;
const scriptName = args[2];
switch (scriptName) {
  case 'acl-feature':
    aclFeature();
    break;

  default:
    break;
}
