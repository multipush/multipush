import * as fs from 'fs';
import debug from './debugLog';

const d = debug.extend('tmp');
export const uniqueIdentifier = new Date().getTime();
// TODO: get windows path
const tmpFolder = `/tmp/multipush-${uniqueIdentifier}`;
d('tmp folder is', tmpFolder);

export default tmpFolder;

export const cleanTmp = () => {
  d('cleaning up tmp folder');
  fs.rmdirSync(tmpFolder, { recursive: true });
};
