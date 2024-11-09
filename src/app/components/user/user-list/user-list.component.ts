import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { Table, TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { SpinnerPrimeNgService } from '../../../../shared/loader-spinner/spinner-primeng.service';
import { UserService } from '../user.service';
import { UserModel } from '../user.model';
import { UserNewEditComponent } from '../user-new-edit/user-new-edit.component';
import { UserShowComponent } from '../user-show/user-show.component';

@Component({
  selector: 'app-user-list',
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
    InputSwitchModule,
    UserNewEditComponent,
    UserShowComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  @ViewChild(UserNewEditComponent) userNewEditComponent!: UserNewEditComponent;
  @ViewChild(UserShowComponent) userShowComponent!: UserShowComponent;
  @ViewChild('dt1') dt1: Table | undefined;

  unsubscribe$ = new Subject<void>();
  users: UserModel[] = [];
  searchValue = '';

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly confirmationService: ConfirmationService,
    private readonly userService: UserService,
    private readonly messageService: MessageService
  ) {
    this.loadUsers();
  }

  private cleanVariables() {
    this.users = [];
    this.searchValue = '';
  }

  loadUsers() {
    this.cleanVariables();
    this.spinnerPrimeNgService
      .use(this.userService.getAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.users = res;
        }
      });
  }

  createUser() {
    this.userNewEditComponent.showDialog();
  }

  showUser(userGuid: string) {
    this.userShowComponent.showDialog(userGuid);
  }

  updateUser(userGuid: string) {
    this.userNewEditComponent.showDialog(userGuid);
  }

  deleteUser(userId: number) {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar el registro seleccionado?',
      header: 'Advertencia',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',
      accept: () => {
        this.spinnerPrimeNgService
          .use(this.userService.deleteByIdAsync(userId))
          .pipe(takeUntil(this.unsubscribe$))
          .subscribe({
            next: () => {
              this.messageService.add({ severity: 'success', summary: 'Éxito', detail: 'Registro eliminado correctamente', life: 3000 });
              this.loadUsers();
            }
          });
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
    this.loadUsers();
  }
}