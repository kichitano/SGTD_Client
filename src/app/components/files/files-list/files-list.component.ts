import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressBarModule } from 'primeng/progressbar';
import { Table, TableModule } from 'primeng/table';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { UserFileModel } from '../files.model';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../../login/auth.service';
import { FilesService } from '../files.service';
import { SpinnerPrimeNgService } from '../../../../shared/loader-spinner/spinner-primeng.service';
import { Subject, takeUntil } from 'rxjs';

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
    HttpClientModule,
    TableModule,
    ConfirmDialogModule,
    ToolbarModule,
    TooltipModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './files-list.component.html',
  styleUrls: ['./files-list.component.scss']
})
export class FilesListComponent {
  @ViewChild('fileUpload') fileUpload!: FileUpload;
  @ViewChild('dt1') dt1: Table | undefined;

  unsubscribe$ = new Subject<void>();

  visible: boolean = false;
  files: UserFileModel[] = [];
  uploadedFiles: UserFileModel[] = [];
  selectedFiles: UserFileModel[] = [];
  totalSize: number = 0;
  uploadProgress: number = 0;
  maxFileSize: number = 10000000; // 10MB
  uploadUrl: string = 'your-api-url/upload';
  searchValue = '';
  userGuid = '';

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly messageService: MessageService,
    private readonly confirmationService: ConfirmationService,
    private readonly filesService: FilesService,
    private readonly authService: AuthService
  ) {
  }

  getUserGuid(): void {
    this.spinnerPrimeNgService
      .use(this.authService.getUserGuidAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.userGuid = res ?? '';
          if (this.userGuid) {
            this.loadUploadedFiles();
          }
        }
      });
  }

  loadUploadedFiles(): void {
    this.spinnerPrimeNgService
      .use(this.filesService.getByUserGuIdAsync(this.userGuid))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.uploadedFiles = res;
        }
      });
  }

  handleUpload(event: any): void {
    const files = event.files;
    this.spinnerPrimeNgService
      .use(this.filesService.uploadFiles(files, this.userGuid))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Archivos subidos correctamente'
          });
          this.fileUpload.clear();
          this.loadUploadedFiles();
        }
      });
  }

  downloadFile(file: UserFileModel): void {
    if (file.id) {
      this.messageService.add({
        severity: 'info',
        summary: 'Descarga iniciada',
        detail: `Descargando ${file.fileName}`
      });

      this.spinnerPrimeNgService
        .use(this.filesService.downloadFileAsync(file.id))
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: (blob: Blob) => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${this.uploadedFiles.find(f => f.id === file.id)?.fileName ?? 'download'}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            this.messageService.add({
              severity: 'success',
              summary: 'Descarga Finalizada',
              detail: 'Archivo descargado correctamente'
            });
          },
        });
    }


  }

  showDialog(): void {
    this.visible = true;
    this.getUserGuid();
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
    this.totalSize = this.files.reduce((total, file) => total + file.fileSize, 0);
    this.uploadProgress = (this.totalSize / this.maxFileSize) * 100;
  }

  downloadSelectedFiles(): void {
    if (this.selectedFiles.length > 0) {
      this.messageService.add({
        severity: 'info',
        summary: 'Descarga múltiple',
        detail: `Descargando ${this.selectedFiles.length} archivos`
      });
    }
  }

  shareFile(file: UserFileModel): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Compartir',
      detail: `Compartiendo ${file.fileName}`
    });
  }

  deleteFile(file: UserFileModel): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar el archivo "${file.fileName}"?`,
      header: 'Advertencia',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.uploadedFiles = this.uploadedFiles.filter(f => f.id !== file.id);
        this.messageService.add({ severity: 'success', summary: 'Eliminado', detail: 'Archivo eliminado correctamente', life: 3000 });
      }
    });
  }

  deleteSelectedFiles(): void {
    this.confirmationService.confirm({
      message: `¿Está seguro de eliminar ${this.selectedFiles.length} archivos seleccionados?`,
      header: 'Advertencia',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        const selectedIds = this.selectedFiles.map(f => f.id);
        this.uploadedFiles = this.uploadedFiles.filter(f => !selectedIds.includes(f.id));
        this.selectedFiles = [];
        this.messageService.add({
          severity: 'success',
          summary: 'Eliminados',
          detail: 'Archivo(s) eliminado(s) correctamente',
          life: 3000
        });
      }
    });
  }

  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  getFileIcon(file: any): string {

    if (!file) return 'pi pi-file text-gray-500';
    const fileName = file.fileName || file.name;
    if (!fileName) return 'pi pi-file text-gray-500';
    const extension = fileName.split('.').pop()?.toLowerCase() ?? '';

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

  applyFilterGlobal($event: Event, stringVal: string) {
    const value = ($event.target as HTMLInputElement).value;
    this.dt1?.filterGlobal(value, stringVal);
  }

  clearSearchText(table: Table) {
    table.clear();
    this.searchValue = '';
  }
}