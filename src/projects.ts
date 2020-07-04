import { MultipushProject } from './types';
import multipushConnectors from './connectors';
import { MultipushConnector } from './connectors/types';

function normalizeProjectNameAndGetType(
  project: MultipushProject
): {
  normalizedName: string;
  type: string;
} {
  if (project.target.match(/^[a-z-]+\/[a-z-]+$/i)) {
    return {
      type: 'github', // TODO: dont use string
      normalizedName: project.target,
    };
  }
  if (project.target.includes('github.com/')) {
    return {
      type: 'github',
      normalizedName: project.target.match(/^.*\/([a-z-]+\/[a-z-]+)$/i)[1],
    };
  }
  throw new Error('Unknown or unsupported target');
}

export const connectors: Record<string, MultipushConnector> = {};

export async function getProject(
  project: MultipushProject
): Promise<MultipushConnector> {
  const { normalizedName, type } = normalizeProjectNameAndGetType(project);
  if (connectors[normalizedName]) {
    return connectors[normalizedName];
  }

  connectors[normalizedName] = await multipushConnectors[type](
    project,
    normalizedName
  );
  await connectors[normalizedName].prepare();
  return connectors[normalizedName];
}

export async function finalizeAll() {
  for (const connector of Object.keys(connectors)) {
    await connectors[connector].finalize();
  }
}
