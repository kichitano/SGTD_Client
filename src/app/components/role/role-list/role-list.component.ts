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
import { RoleService } from '../role.service';
import { RoleModel } from '../role.model';
import { RoleNewEditComponent } from '../role-new-edit/role-new-edit.component';
import { RoleShowComponent } from '../role-show/role-show.component';

@Component({
  selector: 'app-role-list',
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
    RoleNewEditComponent,
    RoleShowComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './role-list.component.html',
  styleUrl: './role-list.component.scss'
})

export class RoleListComponent {
  @ViewChild(RoleNewEditComponent) roleNewEditComponent!: RoleNewEditComponent;
  @ViewChild(RoleShowComponent) roleShowComponent!: RoleShowComponent;
  @ViewChild('dt1') dt1: Table | undefined;

  unsubscribe$ = new Subject<void>();
  roles: RoleModel[] = [];
  searchValue = '';

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly confirmationService: ConfirmationService,
    private readonly roleService: RoleService,
    private readonly messageService: MessageService
  ) {
    this.loadRoles();
  }

  private cleanVariables() {
    this.roles = [];
    this.searchValue = '';
  }

  loadRoles() {
    this.cleanVariables();
    this.spinnerPrimeNgService
      .use(this.roleService.GetAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.roles = res;
        }
      });
  }

  createRole() {
    this.roleNewEditComponent.showDialog();
  }

  showRole(roleId: number) {
    this.roleShowComponent.showDialog(roleId);
  }

  updateRole(roleId: number) {
    this.roleNewEditComponent.showDialog(roleId);
  }

  deleteRole(roleId: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar el registro seleccionado?',
      header: 'Advertencia',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.roles = this.roles.filter(q => q.id !== roleId);
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
    this.loadRoles();
  }
}