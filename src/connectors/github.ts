import * as fs from 'fs';
import * as path from 'path';
import debug from '../debugLog';
import tmp, { uniqueIdentifier } from '../tmp';
import { MultipushConnector } from './types';
import exec from '../exec';
import { MultipushProject } from '../types';

const d = debug.extend('connector:github');

let ghChecked = false;

async function checkGh() {
  try {
    const userResult = await exec('gh api user', { timeout: 5000 });
    if (!userResult.includes('"login":')) {
      throw new Error('Unexpected gh api response');
    }
  } catch (err) {
    if ((err.message as string).includes('command not found')) {
      throw new Error('You need to have GitHub CLI `gh` installed');
    }
    console.error(err);
    throw new Error('`gh` not configured. Try running `gh api whoami` first');
  }
}

export default async (
  project: MultipushProject,
  normalizedName: string
): Promise<MultipushConnector> => {
  const repoPath = `${tmp}/.repos/github/${normalizedName}`;
  if (!ghChecked) {
    await checkGh();
    ghChecked = true;
    d('gh check completed');
  }

  return {
    async prepare() {
      d(`${normalizedName}: starting prepare`);
      if (fs.existsSync(repoPath)) {
        d(repoPath, 'already exists');
      } else {
        d('cloning', normalizedName, 'to', tmp);
        await exec(`gh repo clone ${normalizedName} ${repoPath} -- --depth 1`);
        await exec('git remote rm upstream', {
          cwd: repoPath,
        });
        d(`${normalizedName}: clone done`);
      }
      await exec(`git switch -c chore/syncaroo-${uniqueIdentifier}`, {
        cwd: repoPath,
      });
    },
    async readFile(filename) {
      return fs.readFileSync(path.join(repoPath, filename), 'utf8');
    },
    async writeFile(filename, content) {
      const fullPath = path.join(repoPath, filename);
      fs.mkdirSync(path.dirname(fullPath), { recursive: true });
      fs.writeFileSync(fullPath, content);
      await exec(`git add ${filename}`, { cwd: repoPath }); // stage file for later commit
    },
    async removeFile(filename) {
      const fullPath = path.join(repoPath, filename);
      if (fs.existsSync(fullPath)) {
        d(`Removing file "${filename}"`);
        await exec(`git rm ${filename}`, {
          cwd: repoPath,
        });
      } else {
        d(`File "${filename}" does not exist in the repo, nothing to remove`);
      }
    },
    async finalize() {
      const gitStatus = await exec('git status', {
        cwd: repoPath,
      });
      if (gitStatus.includes('nothing to commit, working tree clean')) {
        d('Nothing to commit');
        return 'Nothing to commit';
      }

      d('finalize, commiting');
      await exec(`git commit -m "chore(syncaroo): file sync"`, {
        cwd: repoPath,
      });
      const prCreateResult = await exec(
        `gh pr create --repo="${normalizedName}" --title="Syncaroo PR" --body="Automatic PR by syncaroo"`,
        { cwd: repoPath }
      );
      const url = prCreateResult.match(/https.*$/gm);
      // If we can't find PR URL, use output of PR command
      return url ? `Pull request opened at: ${url[0]}` : prCreateResult;
    },
  };
};
