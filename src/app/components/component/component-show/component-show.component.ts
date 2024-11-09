import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

import { SpinnerPrimeNgService } from '../../../../shared/loader-spinner/spinner-primeng.service';
import { ComponentService } from '../component.service';
import { ComponentModel } from '../component.model';

@Component({
  selector: 'app-component-show',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DialogModule,
    ButtonModule,
    DividerModule,
    InputTextModule,
    FloatLabelModule
  ],
  templateUrl: './component-show.component.html',
  styleUrl: './component-show.component.scss'
})

export class ComponentShowComponent {
  unsubscribe$ = new Subject<void>();
  visible = false;
  component: ComponentModel = {} as ComponentModel;

  constructor(
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly componentService: ComponentService
  ) { }

  private cleanVariables() {
    this.component = {} as ComponentModel;
  }

  showDialog(componentId: number) {
    this.cleanVariables();
    this.loadComponent(componentId);
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
  }

  private loadComponent(componentId: number) {
    this.spinnerPrimeNgService
      .use(this.componentService.getByIdAsync(componentId))
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          this.component = res;
        }
      });
  }
}