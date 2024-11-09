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
import { ComponentService } from '../component.service';
import { ComponentModel } from '../component.model';
import { ComponentNewEditComponent } from '../component-new-edit/component-new-edit.component';
import { ComponentShowComponent } from '../component-show/component-show.component';

@Component({
  selector: 'app-component-list',
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
    ComponentNewEditComponent,
    ComponentShowComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './component-list.component.html',
  styleUrl: './component-list.component.scss'
})

export class ComponentListComponent {

  @ViewChild(ComponentNewEditComponent) componentNewEditComponent!: ComponentNewEditComponent;
  @ViewChild(ComponentShowComponent) componentShowComponent!: ComponentShowComponent;
  @ViewChild('dt1') dt1: Table | undefined;

  unsubscribe$ = new Subject<void>();
  components: ComponentModel[] = [];
  searchValue = '';

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly confirmationService: ConfirmationService,
    private readonly componentService: ComponentService,
    private readonly messageService: MessageService
  ) {
    this.loadComponents();
  }

  private cleanVariables() {
    this.components = [];
    this.searchValue = '';
  }

  loadComponents() {
    this.cleanVariables();
    this.spinnerPrimeNgService
      .use(this.componentService.getAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.components = res;
        }
      });
  }

  createComponent() {
    this.componentNewEditComponent.showDialog();
  }

  showComponent(componentId: number) {
    this.componentShowComponent.showDialog(componentId);
  }

  updateComponent(componentId: number) {
    this.componentNewEditComponent.showDialog(componentId);
  }

  deleteComponent(componentId: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar el registro seleccionado?',
      header: 'Advertencia',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.components = this.components.filter(q => q.id !== componentId);
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