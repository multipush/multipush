export type MultipushProject = {
  target: string;
};

export type MultipushTask = {
  name: string;
  projects: MultipushProject[];
  files?: MultipushTaskFiles;
};

export type MultipushTaskFiles = Record<string, string | Function>;
