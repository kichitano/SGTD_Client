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
import { InputSwitchModule } from 'primeng/inputswitch';
import { PasswordModule } from 'primeng/password';
import { SliderModule } from 'primeng/slider';

import { SpinnerPrimeNgService } from '../../../../shared/loader-spinner/spinner-primeng.service';
import { UserService } from '../user.service';
import { UserModel } from '../user.model';
import { PositionModel, PositionRoleModel } from '../../position/position.model';
import { PositionService } from '../../position/position.service';
import { PersonModel } from '../../people/people.model';
import { PeopleService } from '../../people/people.service';
import { UserPositionService } from '../../user-position/user-position.service';
import { UserPositionModel } from '../../user-position/user-position.model';
import { RoleModel } from '../../role/role.model';
import { PositionRoleService } from '../../position-role/position-role.service';
import { RoleService } from '../../role/role.service';
import { UserRoleModel } from '../../user-role/user-role.model';
import { UserRoleService } from '../../user-role/user-role.service';

@Component({
  selector: 'app-user-new-edit',
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
    InputSwitchModule,
    PasswordModule,
    SliderModule
  ],
  templateUrl: './user-new-edit.component.html',
  styleUrl: './user-new-edit.component.scss'
})
export class UserNewEditComponent {
  @Output() dialogClosed = new EventEmitter<boolean>();
  unsubscribe$ = new Subject<void>();

  user: UserModel = {} as UserModel;
  storageSizeMB: number = 50;

  persons: PersonModel[] = [];
  filteredPersons: PersonModel[] = [];
  selectedPerson: PersonModel | undefined;

  positions: PositionModel[] = [];
  filteredPositions: PositionModel[] = [];
  selectedPosition: PositionModel | undefined;

  roles: RoleModel[] = [];
  filteredRoles: RoleModel[] = [];
  selectedRoles: RoleModel[] = [];

  userPosition: UserPositionModel = {} as UserPositionModel;

  isEditMode = false;
  visible = false;
  result = false;

  readonly MAX_STORAGE_MB = 100;

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly userService: UserService,
    private readonly peopleService: PeopleService,
    private readonly positionService: PositionService,
    private readonly userRoleService: UserRoleService,
    private readonly userPositionService: UserPositionService,
    private readonly messageService: MessageService,
    private readonly roleService: RoleService,
  ) { }

  private cleanVariables() {
    this.user = {} as UserModel;
    this.storageSizeMB = 50;
    this.selectedPerson = undefined;
    this.selectedPosition = undefined;
    this.selectedRoles = [];
    this.isEditMode = false;
    this.result = false;
  }

  loadData(userGuid?: string) {
    this.loadPersons();
    this.loadPositions();
    this.loadRoles();
    if (userGuid) {
      this.loadUser(userGuid);
    } else {
      this.user.status = true;
    }
  }

  private loadPersons() {
    this.spinnerPrimeNgService
      .use(this.peopleService.getAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.persons = res;
        }
      });
  }

  private loadPositions() {
    this.spinnerPrimeNgService
      .use(this.positionService.getAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.positions = res;
        }
      });
  }

  private loadRoles() {
    this.spinnerPrimeNgService
      .use(this.roleService.getAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.roles = res;
        }
      });
  }

  private loadUser(userGuid: string) {
    this.spinnerPrimeNgService
      .use(this.userService.getByGuidAsync(userGuid))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          console.log(res);
          this.user = res;
          this.storageSizeMB = this.user.storageSize / (1024 * 1024);
          this.selectedPerson = this.user.person;
          if (this.selectedPerson)
            this.selectedPerson.fullName = `${this.user.person?.firstName} ${this.user.person?.lastName} - ${this.user.person?.documentNumber}`;
          this.selectedPosition = this.user.position;
          this.loadUserRoles(userGuid);
        }
      });
  }

  createUser() {
    if (!this.selectedPerson || !this.selectedPosition) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar una persona y un cargo', life: 3000 });
      return;
    }

    this.user.personId = this.selectedPerson.id;
    this.user.storageSize = this.storageSizeMB * 1024 * 1024;

    this.spinnerPrimeNgService
      .use(this.userService.createReturnGuidAsync(this.user))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          const formattedId = res.replace(/[{}]/g, '');
          this.userPosition.userGuid = formattedId;
          this.userPosition.positionId = this.selectedPosition!.id;
          this.spinnerPrimeNgService
            .use(this.userPositionService.createAsync(this.userPosition))
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
              next: () => {
                if (this.selectedRoles.length > 0) {
                  this.createUserRoles(this.userPosition.userGuid);
                } else {
                  this.result = true;
                  this.hideDialog();
                }
              }
            });
        }
      });
  }

  updateUser() {
    if (!this.selectedPerson || !this.selectedPosition) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar una persona y un cargo', life: 3000 });
      return;
    }

    this.user.personId = this.selectedPerson.id;
    this.user.storageSize = this.storageSizeMB;

    this.spinnerPrimeNgService
      .use(this.userService.updateAsync(this.user))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          const userPosition = {
            userGuid: this.user.guid,
            positionId: this.selectedPosition!.id
          };

          this.spinnerPrimeNgService
            .use(this.userPositionService.updateAsync(userPosition))
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe({
              next: () => {
                if (this.selectedRoles.length > 0) {
                  this.updateUserRoles(this.userPosition.userGuid);
                } else {
                  this.result = true;
                  this.hideDialog();
                }
              }
            });
        }
      });
  }

  private createUserRoles(userGuid: string) {
    const userRoles = this.selectedRoles.map(role => ({
      userGuid: userGuid,
      roleId: role.id
    } as UserRoleModel));

    let completedRoles = 0;
    userRoles.forEach(userRole => {
      this.spinnerPrimeNgService
        .use(this.userRoleService.createAsync(userRole))
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe({
          next: () => {
            completedRoles++;
            if (completedRoles === userRoles.length) {
              this.result = true;
              this.hideDialog();
            }
          }
        });
    });
  }

  private updateUserRoles(userGuid: string) {
    this.spinnerPrimeNgService
      .use(this.userRoleService.deleteByUserGuidAsync(userGuid))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.createUserRoles(userGuid);
        }
      });
  }

  private loadUserRoles(userGuid: string) {
    this.spinnerPrimeNgService
      .use(this.userRoleService.getByUserGuidAsync(userGuid))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.selectedRoles = this.roles.filter(role =>
            res.some(pr => pr.roleId === role.id)
          );
        }
      });
  }

  showDialog(userGuid?: string) {
    this.cleanVariables();
    if (userGuid) {
      this.isEditMode = true;
    }
    this.loadData(userGuid);
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
    this.dialogClosed.emit(this.result);
  }

  filterPerson(event: { query: string }) {
    const filtered: PersonModel[] = [];
    const query = event.query.toLowerCase();

    for (const person of this.persons) {
      const fullName = `${person.firstName} ${person.lastName} - ${person.documentNumber}`;
      if (fullName.toLowerCase().includes(query)) {
        person.fullName = fullName;
        filtered.push(person);
      }
    }

    this.filteredPersons = filtered;
  }

  filterPosition(event: { query: string }) {
    const filtered: PositionModel[] = [];
    const query = event.query.toLowerCase();

    for (const position of this.positions) {
      if (position.name.toLowerCase().includes(query)) {
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