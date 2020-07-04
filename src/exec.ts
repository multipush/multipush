import { exec } from 'child_process';

export default (cmd: string, options = {}): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(cmd, options, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      return resolve(stdout ? stdout : stderr);
    });
  });
};
