import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { SpinnerPrimeNgService } from '../../../../shared/loader-spinner/spinner-primeng.service';
import { DocumentTypeService } from '../document-type.service';
import { DocumentTypeModel } from '../document-type.model';
import { DocumentTypeNewEditComponent } from '../document-type-new-edit/document-type-new-edit.component';
import { DocumentTypeShowComponent } from '../document-type-show/document-type-show.component';

@Component({
  selector: 'app-document-type-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    DialogModule,
    DividerModule,
    ConfirmDialogModule,
    ToastModule,
    DocumentTypeNewEditComponent,
    DocumentTypeShowComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './document-type-list.component.html',
  styleUrl: './document-type-list.component.scss'
})

export class DocumentTypeListComponent {

  @ViewChild(DocumentTypeNewEditComponent) documentTypeNewEditComponent!: DocumentTypeNewEditComponent;
  @ViewChild(DocumentTypeShowComponent) documentTypeShowComponent!: DocumentTypeShowComponent;
  @ViewChild('dt1') dt1: Table | undefined;

  unsubscribe$ = new Subject<void>();
  documentTypes: DocumentTypeModel[] = [];
  searchValue = '';

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly confirmationService: ConfirmationService,
    private readonly documentTypeService: DocumentTypeService,
    private readonly messageService: MessageService
  ) {
    this.loadComponents();
  }

  private cleanVariables() {
    this.documentTypes = [];
    this.searchValue = '';
  }

  loadComponents() {
    this.cleanVariables();
    this.spinnerPrimeNgService
      .use(this.documentTypeService.getAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.documentTypes = res;
        }
      });
  }

  createComponent() {
    this.documentTypeNewEditComponent.showDialog();
  }

  showComponent(documentTypeId: number) {
    this.documentTypeShowComponent.showDialog(documentTypeId);
  }

  updateComponent(documentTypeId: number) {
    this.documentTypeNewEditComponent.showDialog(documentTypeId);
  }

  deleteComponent(documentTypeId: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar el registro seleccionado?',
      header: 'Advertencia',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.documentTypes = this.documentTypes.filter(q => q.id !== documentTypeId);
        this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro eliminado correctamente', life: 3000 });
      }
    });
  }

  clearSearchText(table: Table) {
    table.clear();
    this.searchValue = '';
  }

  applyFilterGlobal($event: Event, stringVal: string) {
    const value = ($event.target as HTMLInputElement).value;
    this.dt1?.filterGlobal(value, stringVal);
  }

  onDialogClosed(result: boolean) {
    if (result) {
      this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro guardado correctamente', life: 3000 });
    }
    this.loadComponents();
  }
}