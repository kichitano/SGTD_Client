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
import { AreaDependencyModel, AreaModel } from '../area.model';
import { AreaDependencyService } from '../../services/area-dependency.service';

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
    private readonly messageService: MessageService,
    private readonly areaService: AreaService,
    private readonly areaDependencyService: AreaDependencyService
  ) { }

  createArea() {
    console.log(this.selectedParentArea);
    this.area.parentAreaId = this.selectedParentArea?.id;

    this.spinnerPrimeNgService
      .use(this.areaService.CreateAsync(this.area))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.result = true;
          this.hideDialog();
        }
      });
  }

  loadAreas() {
    this.spinnerPrimeNgService
      .use(this.areaService.GetAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.parentAreas = res;
        }
      });
  }

  loadArea(areaId: number) {
    this.spinnerPrimeNgService
      .use(this.areaService.GetByIdAsync(areaId))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.area = res;
          this.loadAreaRelationship();
        }
      });
  }

  loadAreaRelationship() {
    this.spinnerPrimeNgService
      .use(this.areaDependencyService.GetByIdAsync(this.area.id))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          if (res.parentAreaId > 0)
            this.loadAreaDependency(res.parentAreaId);
        }
      });
  }

  loadAreaDependency(areaId: number) {
    this.spinnerPrimeNgService
      .use(this.areaService.GetByIdAsync(areaId))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.areaDependency = res;
        }
      });
  }

  updateArea() {
    // this.spinnerPrimeNgService
    //   .use(this.areaService.UpdateAsync(this.area, this.selectedParentArea?.id))
    //   .pipe(takeUntil(this.unsubscribe$))
    //   .subscribe({
    //     next: () => {
    //       this.result = true;
    //       this.hideDialog();
    //     }
    //   });
  }

  showDialog(areaId?: number) {
    this.loadAreas();
    if (areaId) {
      this.loadArea(areaId);
      this.isEditMode = true;
      this.selectedParentArea = this.areaDependency;
    } else {
      this.area = {} as AreaModel;
      this.area.status = true;
      this.isEditMode = false;
    }
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
    this.area = {} as AreaModel;
    this.selectedParentArea = undefined;
    this.isEditMode = false;
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
}