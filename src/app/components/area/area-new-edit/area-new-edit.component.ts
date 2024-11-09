import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, EventEmitter, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AutoCompleteModule } from 'primeng/autocomplete';

import { SpinnerPrimeNgService } from '../../../../shared/loader-spinner/spinner-primeng.service';
import { AreaService } from '../area.service';
import { AreaModel } from '../area.model';

@Component({
  selector: 'app-area-new-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputTextareaModule,
    ButtonModule,
    InputSwitchModule,
    FloatLabelModule,
    DividerModule,
    AutoCompleteModule
  ],
  providers: [MessageService],
  templateUrl: './area-new-edit.component.html',
  styleUrl: './area-new-edit.component.scss'
})

export class AreaNewEditComponent {
  @Output() dialogClosed = new EventEmitter<boolean>();
  unsubscribe$ = new Subject<void>();

  area: AreaModel = {} as AreaModel;
  areaDependency: AreaModel = {} as AreaModel;
  parentAreas: AreaModel[] = [];
  filteredParentAreas: AreaModel[] = [];
  selectedParentArea: AreaModel | undefined;

  isEditMode = false;
  visible = false;
  result = false;

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly areaService: AreaService,
  ) { }

  createArea() {
    this.area.parentAreaId = this.selectedParentArea?.id;
    this.spinnerPrimeNgService
      .use(this.areaService.createAsync(this.area))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.result = true;
          this.hideDialog();
        }
      });
  }

  loadAreas(areaId?: number) {
    this.spinnerPrimeNgService
      .use(this.areaService.getAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.parentAreas = res;
          if (areaId) {
            this.loadArea(areaId);
          } else {
            this.area = {} as AreaModel;
            this.area.status = true;
            this.isEditMode = false;
          }
        }
      });
  }

  loadArea(areaId: number) {
    this.spinnerPrimeNgService
      .use(this.areaService.getByIdAsync(areaId))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.area = res;
          if (this.area.parentAreaId && this.area.parentAreaId > 0)
            this.loadAreaDependency(this.area.parentAreaId);
        }
      });
  }

  loadAreaDependency(areaId: number) {
    this.spinnerPrimeNgService
      .use(this.areaService.getByIdAsync(areaId))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.areaDependency = res;
          this.selectedParentArea = this.areaDependency;
        }
      });
  }

  updateArea() {
    this.area.parentAreaId = this.selectedParentArea?.id;
    this.spinnerPrimeNgService
      .use(this.areaService.updateAsync(this.area))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.result = true;
          this.hideDialog();
        }
      });
  }

  showDialog(areaId?: number) {
    this.cleanVariables();
    if (areaId)
      this.isEditMode = true;
    this.loadAreas(areaId);
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
    this.dialogClosed.emit(this.result);
  }

  filterParentArea(event: { query: string }) {
    const filtered: AreaModel[] = [];
    const query = event.query.toLowerCase();

    for (const area of this.parentAreas) {
      if (area.name.toLowerCase().includes(query)) {
        filtered.push(area);
      }
    }

    this.filteredParentAreas = filtered;
  }

  private cleanVariables() {
    this.area = {} as AreaModel;
    this.areaDependency = {} as AreaModel;
    this.selectedParentArea = undefined;
    this.isEditMode = false;
    this.result = false;
  }
}