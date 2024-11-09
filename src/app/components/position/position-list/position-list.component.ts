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
import { PositionService } from '../position.service';
import { PositionModel } from '../position.model';
import { PositionNewEditComponent } from '../position-new-edit/position-new-edit.component';
import { PositionShowComponent } from '../position-show/position-show.component';
import { PositionShowPositionChartComponent } from '../position-show-position-chart/position-show-position-chart.component';

@Component({
  selector: 'app-position-list',
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
    PositionNewEditComponent,
    PositionShowComponent,
    PositionShowPositionChartComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './position-list.component.html',
  styleUrl: './position-list.component.scss'
})
export class PositionListComponent {
  @ViewChild(PositionNewEditComponent) positionNewEditComponent!: PositionNewEditComponent;
  @ViewChild(PositionShowComponent) positionShowComponent!: PositionShowComponent;
  @ViewChild(PositionShowPositionChartComponent) positionShowPositionChartComponent!: PositionShowPositionChartComponent;
  @ViewChild('dt1') dt1: Table | undefined;

  unsubscribe$ = new Subject<void>();
  positions: PositionModel[] = [];
  searchValue = '';
  selectedPositionId = 0;

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly confirmationService: ConfirmationService,
    private readonly positionService: PositionService,
    private readonly messageService: MessageService
  ) {
    this.loadPositions();
  }

  private cleanVariables() {
    this.positions = [];
    this.searchValue = '';
    this.selectedPositionId = 0;
  }

  loadPositions() {
    this.cleanVariables();
    this.spinnerPrimeNgService
      .use(this.positionService.getAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.positions = res;
        }
      });
  }

  createPosition() {
    this.positionNewEditComponent.showDialog();
  }

  showPosition(positionId: number) {
    this.positionShowComponent.showDialog(positionId);
  }

  updatePosition(positionId: number) {
    this.positionNewEditComponent.showDialog(positionId);
  }

  deletePosition(positionId: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar el registro seleccionado?',
      header: 'Advertencia',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.positions = this.positions.filter(q => q.id !== positionId);
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
    this.loadPositions();
  }

  showPositionChart() {
    this.positionShowPositionChartComponent.showDialog();
  }

}