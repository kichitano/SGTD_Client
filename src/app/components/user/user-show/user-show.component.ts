import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MeterGroupModule } from 'primeng/metergroup';

import { SpinnerPrimeNgService } from '../../../../shared/loader-spinner/spinner-primeng.service';
import { UserService } from '../user.service';
import { UserModel } from '../user.model';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { UserRoleService } from '../../user-role/user-role.service';
import { RoleService } from '../../role/role.service';
import { RoleModel } from '../../role/role.model';
import { ChipsModule } from 'primeng/chips';

@Component({
  selector: 'app-user-show',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    CalendarModule,
    CheckboxModule,
    ButtonModule,
    InputSwitchModule,
    AutoCompleteModule,
    FloatLabelModule,
    MeterGroupModule,
    ChipsModule
  ],
  templateUrl: './user-show.component.html',
  styleUrl: './user-show.component.scss'
})
export class UserShowComponent {
  @Output() dialogClosed = new EventEmitter<void>();
  unsubscribe$ = new Subject<void>();

  user: UserModel = {} as UserModel;
  selectedRoles: RoleModel[] = [];
  visible = false;
  storageMetrics: any[] = [{
    label: 'Archivos',
    value: 0,
    color: '#4CAF50',
    textColor: '#000000'
  }];

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly userService: UserService,
    private readonly userRoleService: UserRoleService,
    private readonly roleService: RoleService
  ) { }

  loadUser(userGuid: string) {
    this.spinnerPrimeNgService
      .use(this.userService.getByGuidAsync(userGuid))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.user = res;
          this.user.usedStorage = 0;
          this.calculateStorageMetrics();
          this.loadUserRoles(userGuid);
        }
      });
  }

  private loadUserRoles(userGuid: string) {
    this.spinnerPrimeNgService
      .use(this.userRoleService.getByUserGuidAsync(userGuid))
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

  private calculateStorageMetrics() {
    const usedStorageMB = this.user.usedStorage ?? 0;
    const totalStorageMB = this.user.storageSize ?? 1;

    if (totalStorageMB <= 0) {
      this.storageMetrics = [{
        label: 'Archivos',
        value: 0,
        color: '#4CAF50',
        textColor: '#000000'
      }];
      return;
    }

    const usedPercentage = (usedStorageMB / totalStorageMB) * 100;

    this.storageMetrics = [{
      label: 'Archivos',
      value: usedPercentage,
      color: this.getStorageColor(usedPercentage),
      textColor: '#000000'
    }];
  }

  private getStorageColor(percentage: number): string {
    if (percentage >= 90) return '#FF0000';
    if (percentage >= 75) return '#FFA500';
    return '#4CAF50';
  }

  private cleanVariables() {
    this.user = {} as UserModel;
    this.storageMetrics = [{
      label: 'Archivos',
      value: 0,
      color: '#4CAF50',
      textColor: '#000000'
    }];
    this.selectedRoles = [];
  }

  showDialog(userGuid: string) {
    this.cleanVariables();
    this.loadUser(userGuid);
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
    this.dialogClosed.emit();
  }
}