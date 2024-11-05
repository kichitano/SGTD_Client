import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, Subject, switchMap, takeUntil } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';

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
  selector: 'app-role-show',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    FloatLabelModule,
    DividerModule,
    TableModule
  ],
  templateUrl: './role-show.component.html',
  styleUrl: './role-show.component.scss'
})
export class RoleShowComponent {
  unsubscribe$ = new Subject<void>();
  visible = false;

  role: RoleModel = {} as RoleModel;
  components: ComponentModel[] = [];
  permissionMatrix: PermissionMatrix[] = [];

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

  private initializePermissionMatrix() {
    this.permissionMatrix = this.components.map(component => ({
      componentId: component.id,
      componentName: component.name,
      create: false,
      read: false,
      update: false,
      delete: false
    }));
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

  showDialog(roleId: number) {
    this.cleanVariables();
    this.loadComponents();
    this.loadRole(roleId);
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
  }
}