export interface MultipushConnector {
  prepare: MultipushConnectorPrepare;
  readFile: MultipushConnectorReadFile;
  writeFile: MultipushConnectorWriteFile;
  removeFile: MultipushConnectorRemoveFile;
  finalize: MultipushConnectorFinalize;
}

export interface MultipushConnectorPrepare {
  (): Promise<void>;
}

export interface MultipushConnectorWriteFile {
  (filename: string, content: string): Promise<void>;
}

export interface MultipushConnectorReadFile {
  (filename: string): Promise<string | null | void>;
}

export interface MultipushConnectorRemoveFile {
  (filename: string): Promise<void>;
}

export interface MultipushConnectorFinalize {
  (): Promise<string>;
}
