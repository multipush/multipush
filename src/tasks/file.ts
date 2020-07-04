import debug from '../debugLog';
import { MultipushTaskFiles } from '../types';
import { MultipushConnector } from '../connectors/types';

const d = debug.extend('task:file');

export default (
  name: string,
  connectors: MultipushConnector[],
  files: MultipushTaskFiles
) => {
  return {
    async work() {
      d(`"${name}": writing files`);
      for (const [filename, fileContent] of Object.entries(files)) {
        for (const connector of connectors) {
          if (!fileContent) {
            d('removing', filename);
            await connector.removeFile(filename);
            // TODO: handle dynamic/template functions
          } else if (typeof fileContent === 'function') {
            console.error('not implemented');
            // const oldFile = await connector.readFile(filename)
            // const newFile = await fileContent(oldFile)
            // await connector.writeFile(filename, newFile);
          } else {
            d('writing', filename);
            await connector.writeFile(filename, fileContent);
          }
        }
      }
      d(`"${name}": done writing`);
    },
  };
};
