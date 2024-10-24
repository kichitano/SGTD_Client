import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { RadioButtonModule } from 'primeng/radiobutton';

import { SpinnerPrimeNgService } from '../../../../shared/loader-spinner/spinner-primeng.service';
import { CountryService } from '../../../../shared/services/Country.service';
import { CountryModel } from '../../../../shared/models.model';
import { PeopleService } from '../people.service';
import { GenderModel, PersonModel } from '../people.model';


@Component({
  selector: 'app-people-new-edit',
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
    FloatLabelModule,
    DividerModule,
    AutoCompleteModule,
    RadioButtonModule
  ],
  providers: [MessageService],
  templateUrl: './people-new-edit.component.html',
  styleUrl: './people-new-edit.component.scss'
})

export class PeopleNewEditComponent {

  @Output() dialogClosed = new EventEmitter<boolean>();
  unsubscribe$ = new Subject<void>();

  countries: CountryModel[] = [];
  genders: GenderModel[] = [
    { name: 'Masculino', value: true },
    { name: 'Femenino', value: false }];
  filteredCountries: CountryModel[] | any;
  filteredGenders: GenderModel[] | any;
  person: PersonModel = {} as PersonModel;
  selectedCountry: CountryModel | undefined;
  selectedGender: GenderModel | undefined;
  isEditMode = false;
  visible = false;
  result = false;

  constructor(
    private spinnerPrimeNgService: SpinnerPrimeNgService,
    private peopleService: PeopleService,
    private countryService: CountryService
  ) {  }

  loadCountries() {
    this.spinnerPrimeNgService
      .use(this.countryService.GetAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.countries = res;
        },
        error: (err: HttpErrorResponse) => {
          // TODO: Mostrar toaster de PrimeNG para mensajes de error
          // this.toastr.error(this.humanError.translate(err));
        }
      });
  }

  createPerson() {
    this.person.nationalityCode = this.selectedCountry?.code ?? 'PE';
    this.person.gender = this.selectedGender?.value ?? false;

    this.spinnerPrimeNgService
      .use(this.peopleService.CreateAsync(this.person))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: () => {
          this.result = true;
          this.hideDialog();
        },
        error: (err: HttpErrorResponse) => {
          // TODO: Mostrar toaster de PrimeNG para mensajes de error
          // this.toastr.error(this.humanError.translate(err));
        }
      });
  }

  showDialog(personId?: number) {
    this.loadCountries();
    if (personId) {
      // this.loadPerson(personId);
      this.isEditMode = true;
    } else {
      // this.cleanPerson();
      this.isEditMode = false;
    }
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
    // this.cleanPerson();
    this.isEditMode = false;
    this.dialogClosed.emit(this.result);
  }

  filterCountry(value: string) {
    let filtered: any[] = [];
    for (let i = 0; i < (this.countries as any[]).length; i++) {
      let country = (this.countries as any[])[i];
      if (country.name.toLowerCase().indexOf(value.toLowerCase()) == 0) {
        filtered.push(country);
      }
    }
    this.filteredCountries = filtered;
  }

  filterGender(value: string) {
    let filtered: any[] = [];
    for (let i = 0; i < (this.genders as any[]).length; i++) {
      let gender = (this.genders as any[])[i];
      if (gender.name.toLowerCase().indexOf(value.toLowerCase()) == 0) {
        filtered.push(gender);
      }
    }
    this.filteredGenders = filtered;
  }
}
