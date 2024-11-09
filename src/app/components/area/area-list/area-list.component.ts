import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { SpinnerPrimeNgService } from '../../../../shared/loader-spinner/spinner-primeng.service';
import { Subject, takeUntil } from 'rxjs';
import { AreaModel } from '../area.model';
import { AreaService } from '../area.service';
import { AreaNewEditComponent } from '../area-new-edit/area-new-edit.component';
import { AreaShowComponent } from '../area-show/area-show.component';
import { AreaShowOrganizationChartComponent } from '../area-show-organization-chart/area-show-organization-chart.component';

@Component({
  selector: 'app-area-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    TableModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    AreaNewEditComponent,
    AreaShowComponent,
    AreaShowOrganizationChartComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './area-list.component.html',
  styleUrl: './area-list.component.scss'
})
export class AreaListComponent {
  @ViewChild(AreaNewEditComponent) areaNewEditComponent!: AreaNewEditComponent;
  @ViewChild(AreaShowComponent) areaShowComponent!: AreaShowComponent;
  @ViewChild(AreaShowOrganizationChartComponent) areaShowOrganizationChartComponent!: AreaShowOrganizationChartComponent;
  @ViewChild('dt1') dt1: Table | undefined;

  unsubscribe$ = new Subject<void>();
  areas: Partial<AreaModel>[] = [];
  searchValue = '';
  selectedAreaId = 0;

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly confirmationService: ConfirmationService,
    private readonly areaService: AreaService,
    private readonly messageService: MessageService
  ) {
    this.loadAreas();
  }

  loadAreas() {
    this.spinnerPrimeNgService
      .use(this.areaService.getAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.areas = res;
        }
      });
  }

  createArea() {
    this.areaNewEditComponent.showDialog();
  }

  showArea(areaId: number) {
    this.areaShowComponent.showDialog(areaId);
  }

  showOrganizationChart() {
    this.areaShowOrganizationChartComponent.showDialog();
  }

  updateArea(areaId: number) {
    this.areaNewEditComponent.showDialog(areaId);
  }

  deleteArea(areaId: number) {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar el registro seleccionado?`,
      header: 'Advertencia',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',

      accept: () => {
        this.areas = this.areas.filter(q => q.id !== areaId);
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
    this.loadAreas();
  }
}