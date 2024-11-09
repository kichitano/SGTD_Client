import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ChipsModule } from 'primeng/chips';

import { SpinnerPrimeNgService } from '../../../../shared/loader-spinner/spinner-primeng.service';
import { PositionService } from '../position.service';
import { PositionModel } from '../position.model';
import { AreaService } from '../../area/area.service';
import { PositionRoleService } from '../../position-role/position-role.service';
import { RoleService } from '../../role/role.service';
import { RoleModel } from '../../role/role.model';

@Component({
  selector: 'app-position-show',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    FloatLabelModule,
    ChipsModule
  ],
  templateUrl: './position-show.component.html',
  styleUrl: './position-show.component.scss'
})
export class PositionShowComponent {
  unsubscribe$ = new Subject<void>();
  visible = false;
  position: PositionModel = {} as PositionModel;
  areaName: string = '';
  parentPositionName: string = '';
  selectedRoles: RoleModel[] = [];

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly positionService: PositionService,
    private readonly areaService: AreaService,
    private readonly roleService: RoleService,
    private readonly positionRoleService: PositionRoleService
  ) { }

  private cleanVariables() {
    this.position = {} as PositionModel;
    this.areaName = '';
    this.parentPositionName = '';
    this.selectedRoles = [];
  }

  showDialog(positionId: number) {
    this.cleanVariables();
    this.loadPosition(positionId);
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
  }

  private loadPosition(positionId: number) {
    this.spinnerPrimeNgService
      .use(this.positionService.getByIdAsync(positionId))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.position = res;
          if (this.position.areaId) {
            this.loadArea(this.position.areaId);
          }
          if (this.position.parentPositionId) {
            this.loadParentPosition(this.position.parentPositionId);
          }
          this.loadPositionRoles(positionId);
        }
      });
  }

  private loadArea(areaId: number) {
    this.spinnerPrimeNgService
      .use(this.areaService.getByIdAsync(areaId))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.areaName = res.name;
        }
      });
  }

  private loadParentPosition(parentPositionId: number) {
    this.spinnerPrimeNgService
      .use(this.positionService.getByIdAsync(parentPositionId))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.parentPositionName = res.name;
        }
      });
  }

  private loadPositionRoles(positionId: number) {
    this.spinnerPrimeNgService
      .use(this.positionRoleService.getByPositionIdAsync(positionId))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (positionRoles) => {
          positionRoles.forEach(pr => {
            this.spinnerPrimeNgService
              .use(this.roleService.getByIdAsync(pr.roleId))
              .pipe(takeUntil(this.unsubscribe$))
              .subscribe({
                next: (role) => {
                  this.selectedRoles.push(role);
                }
              });
          });
        }
      });
  }
}