import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { GenderModel, PersonModel } from '../people.model';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';
import { SpinnerPrimeNgService } from '../../../../shared/loader-spinner/spinner-primeng.service';
import { CountryService } from '../../../../shared/services/Country.service';
import { PeopleService } from '../people.service';
import { CountryModel } from '../../../../shared/models.model';
import { AutoCompleteModule } from 'primeng/autocomplete';

@Component({
  selector: 'app-people-show',
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
    DividerModule
  ],
  templateUrl: './people-show.component.html',
  styleUrl: './people-show.component.scss'
})
export class PeopleShowComponent {

  @Output() dialogClosed = new EventEmitter<boolean>();
  unsubscribe$ = new Subject<void>();

  genders: GenderModel[] = [
    { name: 'Masculino', value: true },
    { name: 'Femenino', value: false }];
  person: PersonModel = {} as PersonModel;

  nationality: string = '';
  gender: string = '';
  visible = false;

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly peopleService: PeopleService,
    private readonly countryService: CountryService
  ) { }

  loadPerson(personId: number) {
    this.spinnerPrimeNgService
      .use(this.peopleService.GetByIdAsync(personId))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.person = res;
          this.loadCountries();
        }
      });
  }

  loadCountries() {
    this.spinnerPrimeNgService
      .use(this.countryService.GetAllAsync())
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.nationality = res.filter(q => q.code.match(this.person.nationalityCode))[0].name;
          this.gender = this.genders.filter(q => q.value == this.person.gender)[0].name;
        },
        error: (err: HttpErrorResponse) => {
          // TODO: Mostrar toaster de PrimeNG para mensajes de error
          // this.toastr.error(this.humanError.translate(err));
        }
      });
  }

  showDialog(personId: number) {
    this.loadPerson(personId);
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
  }
}
