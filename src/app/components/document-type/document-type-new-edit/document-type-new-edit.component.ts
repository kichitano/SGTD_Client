import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';

import { SpinnerPrimeNgService } from '../../../../shared/loader-spinner/spinner-primeng.service';
import { DocumentTypeService } from '../document-type.service';
import { DocumentTypeModel } from '../document-type.model';
import { RadioButtonModule } from 'primeng/radiobutton';

@Component({
  selector: 'app-document-type-new-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    DividerModule,
    RadioButtonModule
  ],
  providers: [MessageService],
  templateUrl: './document-type-new-edit.component.html',
  styleUrl: './document-type-new-edit.component.scss'
})

export class DocumentTypeNewEditComponent {
  @Output() dialogClosed = new EventEmitter<boolean>();
  unsubscribe$ = new Subject<void>();

  documentType: DocumentTypeModel = {} as DocumentTypeModel;
  isEditMode = false;
  visible = false;
  result = false;

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly documentTypeService: DocumentTypeService,
  ) { }

  private cleanVariables() {
    this.documentType = {} as DocumentTypeModel;
    this.isEditMode = false;
    this.result = false;
  }

  createComponent() {
    this.spinnerPrimeNgService
      .use(this.documentTypeService.createAsync(this.documentType))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.result = true;
          this.hideDialog();
        }
      });
  }

  updateComponent() {
    this.spinnerPrimeNgService
      .use(this.documentTypeService.updateAsync(this.documentType))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.result = true;
          this.hideDialog();
        }
      });
  }

  showDialog(documentTypeId?: number) {
    this.cleanVariables();
    if (documentTypeId) {
      this.isEditMode = true;
      this.loadComponent(documentTypeId);
    }
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
    this.dialogClosed.emit(this.result);
  }

  private loadComponent(documentTypeId: number) {
    this.spinnerPrimeNgService
      .use(this.documentTypeService.getByIdAsync(documentTypeId))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.documentType = res;
        }
      });
  }
}