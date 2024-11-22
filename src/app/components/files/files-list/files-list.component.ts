import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrimeNGConfig, MessageService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { HttpClientModule } from '@angular/common/http';

interface FileObject {
  name: string;
  size: number;
  objectURL?: string;
}

@Component({
  selector: 'app-files-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    ToastModule,
    FileUploadModule,
    BadgeModule,
    ProgressBarModule,
    HttpClientModule
  ],
  providers: [MessageService],
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss']
})
export class FilesListComponent {
  @ViewChild('fileUpload') fileUpload!: FileUpload;

  visible: boolean = false;
  files: FileObject[] = [];
  uploadedFiles: FileObject[] = [];
  totalSize: number = 0;
  uploadProgress: number = 0;
  maxFileSize: number = 10000000; // 10MB
  uploadUrl: string = 'your-api-url/upload';

  constructor(
    private readonly messageService: MessageService
  ) { }

  get hasFiles(): boolean {
    return this.files.length > 0;
  }

  showDialog(): void {
    this.visible = true;
  }

  hideDialog(): void {
    this.visible = false;
  }

  onFileSelect(event: any): void {
    this.files = event.currentFiles;
    this.updateTotalSize();
  }

  onFileRemove(event: any): void {
    this.updateTotalSize();
  }

  private updateTotalSize(): void {
    this.totalSize = this.files.reduce((total, file) =>
      total + file.size, 0);
    this.uploadProgress = (this.totalSize / this.maxFileSize) * 100;
  }

  startUpload(): void {
    this.fileUpload.upload();
  }

  clearFiles(): void {
    this.fileUpload.clear();
    this.totalSize = 0;
    this.uploadProgress = 0;
  }

  handleUpload(event: any): void {
    // Aquí manejas la subida real al backend
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Files uploaded successfully'
    });
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  getFileIcon(file: FileObject): string {
    const extension = file.name.split('.').pop()?.toLowerCase() ?? '';

    switch (extension) {
      case 'pdf':
        return 'pi pi-file-pdf text-red-500';
      case 'doc':
      case 'docx':
        return 'pi pi-file-word text-blue-500';
      case 'xls':
      case 'xlsx':
        return 'pi pi-file-excel text-green-500';
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return 'pi pi-image text-purple-500';
      case 'zip':
      case 'rar':
        return 'pi pi-file-zip text-orange-500';
      default:
        return 'pi pi-file text-gray-500';
    }
  }
}