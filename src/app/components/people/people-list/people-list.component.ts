import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { Table, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';

import { SpinnerPrimeNgService } from '../../../../shared/loader-spinner/spinner-primeng.service';

import { PeopleShowComponent } from '../people-show/people-show.component';
import { PeopleNewEditComponent } from '../people-new-edit/people-new-edit.component';
import { PeopleService } from '../people.service';
import { Subject, takeUntil } from 'rxjs';
import { PersonModel } from '../people.model';

@Component({
  selector: 'app-people-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    RippleModule,
    TableModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
    PeopleNewEditComponent,
    PeopleShowComponent
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './people-list.component.html',
  styleUrl: './people-list.component.scss'
})
export class PeopleListComponent {

  @ViewChild(PeopleNewEditComponent) peopleNewEditComponent!: PeopleNewEditComponent;
  @ViewChild(PeopleShowComponent) peopleShowComponent!: PeopleShowComponent;
  @ViewChild('dt1') dt1: Table | undefined;

  unsubscribe$ = new Subject<void>();

  people: Partial<PersonModel>[] = [];

  searchValue = '';
  selectedPersonId = 0;

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly confirmationService: ConfirmationService,
    private readonly peopleService: PeopleService,
    private readonly messageService: MessageService
  ) {
    this.loadPeople();
  }

  loadPeople() {
    this.spinnerPrimeNgService
      .use(this.peopleService.getAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.people = res;
        }
      });
  }

  createPerson() {
    this.peopleNewEditComponent.showDialog();
  }

  showPerson(personId: number) {
    this.peopleShowComponent.showDialog(personId);
  }

  updatePerson(personId: number) {
    this.peopleNewEditComponent.showDialog(personId);
  }

  deletePerson(personId: number) {
    this.confirmationService.confirm({
      message: `¿Está seguro que desea eliminar el registro seleccionado?`,
      header: 'Advertencia',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí',
      rejectLabel: 'No',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text',

      accept: () => {
        this.people = this.people.filter(q => q.id !== personId);
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
    this.loadPeople();
  }
}
