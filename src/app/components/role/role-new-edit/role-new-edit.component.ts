import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, Subject, switchMap, takeUntil } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';

import { SpinnerPrimeNgService } from '../../../../shared/loader-spinner/spinner-primeng.service';
import { RoleService } from '../role.service';
import { PermissionMatrix, RoleModel } from '../role.model';
import { ComponentModel } from '../../component/component.model';
import { PermissionService } from '../../permission/permissions.service';
import { ComponentService } from '../../component/component.service';
import { RoleComponentPermissionService } from '../../role-component-permission/role-component-permission.service';
import { RoleComponentPermissionModel } from '../../role-component-permission/role-component-permission.model';
import { PermissionModel, PermissionName } from '../../permission/permission.model';

@Component({
  selector: 'app-role-new-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    DividerModule,
    TableModule,
    CheckboxModule
  ],
  providers: [MessageService],
  templateUrl: './role-new-edit.component.html',
  styleUrl: './role-new-edit.component.scss'
})
export class RoleNewEditComponent {
  @Output() dialogClosed = new EventEmitter<boolean>();
  unsubscribe$ = new Subject<void>();

  role: RoleModel = {} as RoleModel;
  components: ComponentModel[] = [];
  permissionMatrix: PermissionMatrix[] = [];

  allModulesSelected = false;
  isEditMode = false;
  visible = false;
  result = false;

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly roleService: RoleService,
    private readonly componentService: ComponentService,
    private readonly permissionService: PermissionService,
    private readonly roleComponentPermissionService: RoleComponentPermissionService
  ) { }

  private cleanVariables() {
    this.role = {} as RoleModel;
    this.permissionMatrix = [];
    this.isEditMode = false;
    this.result = false;
  }

  loadData(roleId?: number) {
    this.loadComponents();
    if (roleId) {
      this.loadRole(roleId);
    }
  }

  private loadComponents() {
    this.spinnerPrimeNgService
      .use(this.componentService.GetAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.components = res;
          this.initializePermissionMatrix();
        }
      });
  }

  private loadRole(roleId: number) {
    this.spinnerPrimeNgService
      .use(
        this.roleService.GetByIdAsync(roleId)
          .pipe(
            switchMap(role => {
              this.role = role;
              return forkJoin({
                rolePermissions: this.roleComponentPermissionService.GetByRoleIdAsync(roleId),
                allPermissions: this.permissionService.GetAllAsync()
              });
            })
          )
      )
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: ({ rolePermissions, allPermissions }) => {
          this.updatePermissionMatrix(rolePermissions, allPermissions);
        }
      });
  }

  private updatePermissionMatrix(rolePermissions: RoleComponentPermissionModel[], allPermissions: PermissionModel[]) {
    rolePermissions.forEach(permission => {
      const matrixItem = this.findMatrixItem(permission.componentId);
      if (matrixItem) {
        this.updateMatrixItemPermissions(matrixItem, permission.permissionId, allPermissions);
      }
    });
  }

  private findMatrixItem(componentId: number): PermissionMatrix | undefined {
    return this.permissionMatrix.find(p => p.componentId === componentId);
  }

  private updateMatrixItemPermissions(
    matrixItem: PermissionMatrix,
    permissionId: number,
    allPermissions: PermissionModel[]
  ) {
    const currentPermission = allPermissions.find(p => p.id === permissionId);
    if (!currentPermission) return;

    switch (currentPermission.name.toLowerCase()) {
      case PermissionName.Create.toLowerCase():
        matrixItem.create = true;
        break;
      case PermissionName.Read.toLowerCase():
        matrixItem.read = true;
        break;
      case PermissionName.Update.toLowerCase():
        matrixItem.update = true;
        break;
      case PermissionName.Delete.toLowerCase():
        matrixItem.delete = true;
        break;
    }
  }

  createRole() {
    this.spinnerPrimeNgService
      .use(this.roleService.CreateReturnIdAsync(this.role))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (response) => {
          this.savePermissions(response.id);
        }
      });
  }

  updateRole() {
    this.spinnerPrimeNgService
      .use(this.roleService.UpdateAsync(this.role))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.savePermissions(this.role.id);
        }
      });
  }

  private async savePermissions(roleId: number) {
    this.spinnerPrimeNgService
      .use(this.permissionService.GetAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (permissions) => {
          const rolePermissions = this.buildRolePermissions(roleId, permissions);
          const serviceCall = this.isEditMode ?
            this.roleComponentPermissionService.UpdateArrayAsync(roleId, rolePermissions) :
            this.roleComponentPermissionService.CreateArrayAsync(rolePermissions);

          this.spinnerPrimeNgService
            .use(serviceCall)
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
              next: () => {
                this.result = true;
                this.hideDialog();
              }
            });
        }
      });
  }

  private buildRolePermissions(roleId: number, permissions: PermissionModel[]): RoleComponentPermissionModel[] {
    const rolePermissions: RoleComponentPermissionModel[] = [];

    const permissionMap = {
      create: PermissionName.Create,
      read: PermissionName.Read,
      update: PermissionName.Update,
      delete: PermissionName.Delete
    };

    this.permissionMatrix.forEach(matrix => {
      Object.entries(permissionMap).forEach(([key, permissionName]) => {
        if (matrix[key as keyof typeof permissionMap]) {
          const permission = permissions?.find(p =>
            p.name.toLowerCase() === permissionName.toLowerCase()
          );
          if (permission) {
            rolePermissions.push({
              roleId: roleId,
              componentId: matrix.componentId,
              permissionId: permission.id
            });
          }
        }
      });
    });

    return rolePermissions;
  }

  showDialog(roleId?: number) {
    this.cleanVariables();
    if (roleId) {
      this.isEditMode = true;
    }
    this.loadData(roleId);
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
    this.dialogClosed.emit(this.result);
  }

  private initializePermissionMatrix() {
    this.permissionMatrix = this.components.map(component => ({
      componentId: component.id,
      componentName: component.name,
      allSelected: false,
      create: false,
      read: false,
      update: false,
      delete: false
    }));
  }

  isAllSelected(permission: PermissionMatrix): boolean {
    return permission.create &&
      permission.read &&
      permission.update &&
      permission.delete;
  }

  toggleRowPermissions(permission: PermissionMatrix) {
    const newValue = !this.isAllSelected(permission);
    permission.create = newValue;
    permission.read = newValue;
    permission.update = newValue;
    permission.delete = newValue;
  }

  toggleAllModules() {
    const allSelected = this.permissionMatrix.every(p => this.isAllSelected(p));
    this.permissionMatrix.forEach(permission => {
      permission.create = !allSelected;
      permission.read = !allSelected;
      permission.update = !allSelected;
      permission.delete = !allSelected;
    });
  }
}