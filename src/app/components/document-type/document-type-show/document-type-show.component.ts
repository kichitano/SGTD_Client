import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

import { SpinnerPrimeNgService } from '../../../../shared/loader-spinner/spinner-primeng.service';
import { DocumentTypeService } from '../document-type.service';
import { DocumentTypeModel } from '../document-type.model';

@Component({
  selector: 'app-document-type-show',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    FloatLabelModule
  ],
  templateUrl: './document-type-show.component.html',
  styleUrl: './document-type-show.component.scss'
})

export class DocumentTypeShowComponent {
  unsubscribe$ = new Subject<void>();
  visible = false;
  documentType: DocumentTypeModel = {} as DocumentTypeModel;

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly documentTypeService: DocumentTypeService
  ) { }

  private cleanVariables() {
    this.documentType = {} as DocumentTypeModel;
  }

  showDialog(documentTypeId: number) {
    this.cleanVariables();
    this.loadComponent(documentTypeId);
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
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