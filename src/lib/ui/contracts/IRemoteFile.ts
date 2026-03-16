export interface IRemoteFile {
  getDownloadUrl(): string | null;
  getName(): string | null;
}
