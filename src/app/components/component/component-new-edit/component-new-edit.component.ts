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
import { ComponentService } from '../component.service';
import { ComponentModel } from '../component.model';

@Component({
  selector: 'app-component-new-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    DividerModule,
  ],
  providers: [MessageService],
  templateUrl: './component-new-edit.component.html',
  styleUrl: './component-new-edit.component.scss'
})

export class ComponentNewEditComponent {
  @Output() dialogClosed = new EventEmitter<boolean>();
  unsubscribe$ = new Subject<void>();

  component: ComponentModel = {} as ComponentModel;
  isEditMode = false;
  visible = false;
  result = false;

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly componentService: ComponentService,
  ) { }

  private cleanVariables() {
    this.component = {} as ComponentModel;
    this.isEditMode = false;
    this.result = false;
  }

  createComponent() {
    this.spinnerPrimeNgService
      .use(this.componentService.CreateAsync(this.component))
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
      .use(this.componentService.UpdateAsync(this.component))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.result = true;
          this.hideDialog();
        }
      });
  }

  showDialog(componentId?: number) {
    this.cleanVariables();
    if (componentId) {
      this.isEditMode = true;
      this.loadComponent(componentId);
    }
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
    this.dialogClosed.emit(this.result);
  }

  private loadComponent(componentId: number) {
    this.spinnerPrimeNgService
      .use(this.componentService.GetByIdAsync(componentId))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.component = res;
        }
      });
  }
}