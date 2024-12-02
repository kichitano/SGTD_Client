export interface UserFileModel {
  id?: number;
  fileName: string;
  fileSize: number;
  contentType: string;
  createdAt?: Date;
}