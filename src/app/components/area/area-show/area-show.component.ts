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
import { AreaService } from '../area.service';
import { AreaModel } from '../area.model';

@Component({
  selector: 'app-area-show',
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
  templateUrl: './area-show.component.html',
  styleUrl: './area-show.component.scss'
})
export class AreaShowComponent {
  unsubscribe$ = new Subject<void>();
  visible = false;
  area: AreaModel = {} as AreaModel;
  parentAreaName: string = '';

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly areaService: AreaService
  ) { }

  showDialog(areaId: number) {
    this.loadArea(areaId);
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
    this.area = {} as AreaModel;
    this.parentAreaName = '';
  }

  private loadArea(areaId: number) {
    this.spinnerPrimeNgService
      .use(this.areaService.getByIdAsync(areaId))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.area = res;
          if (this.area.parentAreaId) {
            this.loadParentArea(this.area.parentAreaId);
          }
        }
      });
  }

  private loadParentArea(parentAreaId: number) {
    this.spinnerPrimeNgService
      .use(this.areaService.getByIdAsync(parentAreaId))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.parentAreaName = res.name;
        }
      });
  }
}