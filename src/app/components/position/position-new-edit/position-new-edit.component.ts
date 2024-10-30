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
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ChipsModule } from 'primeng/chips';

import { SpinnerPrimeNgService } from '../../../../shared/loader-spinner/spinner-primeng.service';
import { PositionService } from '../position.service';
import { PositionModel, PositionRoleModel } from '../position.model';
import { AreaService } from '../../area/area.service';
import { AreaModel } from '../../area/area.model';
import { PositionRoleService } from '../../position-role/position-role.service';
import { RoleService } from '../../role/role.service';
import { RoleModel } from '../../role/role.model';

@Component({
  selector: 'app-position-new-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    DividerModule,
    AutoCompleteModule,
    ChipsModule
  ],
  providers: [MessageService],
  templateUrl: './position-new-edit.component.html',
  styleUrl: './position-new-edit.component.scss'
})
export class PositionNewEditComponent {
  @Output() dialogClosed = new EventEmitter<boolean>();
  unsubscribe$ = new Subject<void>();

  position: PositionModel = {} as PositionModel;

  areas: AreaModel[] = [];
  filteredAreas: AreaModel[] = [];
  selectedArea: AreaModel | undefined;

  positions: PositionModel[] = [];
  filteredPositions: PositionModel[] = [];
  selectedParentPosition: PositionModel | undefined;

  roles: RoleModel[] = [];
  filteredRoles: RoleModel[] = [];
  selectedRoles: RoleModel[] = [];

  isEditMode = false;
  visible = false;
  result = false;

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly messageService: MessageService,
    private readonly positionService: PositionService,
    private readonly areaService: AreaService,
    private readonly roleService: RoleService,
    private readonly positionRoleService: PositionRoleService
  ) { }

  private cleanVariables() {
    this.position = {} as PositionModel;
    this.selectedArea = undefined;
    this.selectedParentPosition = undefined;
    this.selectedRoles = [];
    this.isEditMode = false;
    this.result = false;
  }

  createPosition() {
    this.position.areaId = this.selectedArea?.id!;
    this.position.parentPositionId = this.selectedParentPosition?.id;

    this.spinnerPrimeNgService
      .use(this.positionService.CreateAsync(this.position))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          if (this.selectedRoles.length > 0) {
            this.createPositionRoles(this.position.id);
          } else {
            this.result = true;
            this.hideDialog();
          }
        }
      });
  }

  updatePosition() {
    this.position.areaId = this.selectedArea?.id!;
    this.position.parentPositionId = this.selectedParentPosition?.id;

    this.spinnerPrimeNgService
      .use(this.positionService.UpdateAsync(this.position))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          if (this.selectedRoles.length > 0) {
            this.updatePositionRoles(this.position.id);
          } else {
            this.result = true;
            this.hideDialog();
          }
        }
      });
  }

  private createPositionRoles(positionId: number) {
    const positionRoles = this.selectedRoles.map(role => ({
      positionId: positionId,
      roleId: role.id
    } as PositionRoleModel));

    let completedRoles = 0;
    positionRoles.forEach(positionRole => {
      this.spinnerPrimeNgService
        .use(this.positionRoleService.CreateAsync(positionRole))
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            completedRoles++;
            if (completedRoles === positionRoles.length) {
              this.result = true;
              this.hideDialog();
            }
          }
        });
    });
  }

  private updatePositionRoles(positionId: number) {
    this.spinnerPrimeNgService
      .use(this.positionRoleService.DeleteByPositionIdAsync(positionId))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.createPositionRoles(positionId);
        }
      });
  }

  loadData(positionId?: number) {
    this.loadAreas();
    this.loadPositions();
    this.loadRoles();
    if (positionId) {
      this.loadPosition(positionId);
    }
  }

  private loadAreas() {
    this.spinnerPrimeNgService
      .use(this.areaService.GetAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.areas = res;
        }
      });
  }

  private loadPositions() {
    this.spinnerPrimeNgService
      .use(this.positionService.GetAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.positions = res;
        }
      });
  }

  private loadRoles() {
    this.spinnerPrimeNgService
      .use(this.roleService.GetAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.roles = res;
        }
      });
  }

  private loadPosition(positionId: number) {
    this.spinnerPrimeNgService
      .use(this.positionService.GetByIdAsync(positionId))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.position = res;
          if (this.position.areaId) {
            this.selectedArea = this.areas.find(a => a.id === this.position.areaId);
          }
          if (this.position.parentPositionId) {
            this.selectedParentPosition = this.positions.find(p => p.id === this.position.parentPositionId);
          }
          this.loadPositionRoles(positionId);
        }
      });
  }

  private loadPositionRoles(positionId: number) {
    this.spinnerPrimeNgService
      .use(this.positionRoleService.GetByPositionIdAsync(positionId))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.selectedRoles = this.roles.filter(role =>
            res.some(pr => pr.roleId === role.id)
          );
        }
      });
  }

  showDialog(positionId?: number) {
    this.cleanVariables();
    if (positionId) {
      this.isEditMode = true;
    }
    this.loadData(positionId);
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
    this.dialogClosed.emit(this.result);
  }

  filterArea(event: { query: string }) {
    const filtered: AreaModel[] = [];
    const query = event.query.toLowerCase();

    for (const area of this.areas) {
      if (area.name.toLowerCase().includes(query)) {
        filtered.push(area);
      }
    }

    this.filteredAreas = filtered;
  }

  filterPosition(event: { query: string }) {
    const filtered: PositionModel[] = [];
    const query = event.query.toLowerCase();

    for (const position of this.positions) {
      if (position.name.toLowerCase().includes(query) && position.id !== this.position.id) {
        filtered.push(position);
      }
    }

    this.filteredPositions = filtered;
  }

  filterRole(event: { query: string }) {
    const filtered: RoleModel[] = [];
    const query = event.query.toLowerCase();

    for (const role of this.roles) {
      if (role.name.toLowerCase().includes(query)) {
        filtered.push(role);
      }
    }

    this.filteredRoles = filtered;
  }
}