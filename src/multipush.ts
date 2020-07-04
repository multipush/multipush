import debug from './debugLog';
import { MultipushTask } from './types';
import MultipushTasks from './tasks';
import * as projects from './projects';

const d = debug.extend('main');

async function multipush(tasks: MultipushTask[]) {
  d(
    `Found ${tasks.length} task${tasks.length > 1 ? 's' : ''}:`,
    tasks.map((t) => `'${t.name}'`).join(', ')
  );
  for (const task of tasks) {
    const taskConnectors = await Promise.all(
      task.projects.map(projects.getProject)
    );

    if (task.files) {
      await MultipushTasks.file(task.name, taskConnectors, task.files).work();
    }
  }

  await projects.finalizeAll();
}

export default multipush;
