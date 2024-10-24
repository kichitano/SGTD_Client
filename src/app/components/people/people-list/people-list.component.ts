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
import { HttpErrorResponse } from '@angular/common/http';
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
    private spinnerPrimeNgService: SpinnerPrimeNgService,
    private peopleService: PeopleService,
    private messageService: MessageService
  ) {
    this.loadPeople();
  }

  loadPeople() {
    this.spinnerPrimeNgService
      .use(this.peopleService.GetAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.people = res;
        },
        error: (err: HttpErrorResponse) => {
          // TODO: Mostrar toaster de PrimeNG para mensajes de error
          // this.toastr.error(this.humanError.translate(err));
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
    throw new Error('Method not implemented.');
  }

  deletePerson(personId: number) {
    throw new Error('Method not implemented.');
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
