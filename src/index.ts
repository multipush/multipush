import debug from './debugLog';
import multipush from './multipush';
import { MultipushTask } from './types';

import * as demo from '../demo-tasks';

const d = debug.extend('entry');

export default function entry(tasks: MultipushTask[]) {
  multipush(tasks);
}

// Allow direct call from CLI (e.g. npx)
if (require.main === module) {
  d('called directly from CLI');
  // console.log(process.argv);
  // const tasks = require(process.argv)
  // TODO: lookup multipush.config.js if no file is passed
  // - Or just print help?
  if (process.argv[2]) {
    const requiredTasks: MultipushTask[] = require(process.argv[2]);
    entry(requiredTasks);
  } else {
    d('using demo file');
    entry(demo);
  }
} else {
  d('called from require/import');
}
