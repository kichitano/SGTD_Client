import { Component } from '@angular/core';

import { SpinnerPrimeNgService } from './spinner-primeng.service';

@Component({
  selector: 'app-spinner-primeng',
  templateUrl: './spinner-primeng.component.html',
  styleUrls: ['./spinner-primeng.component.scss']
})
export class SpinnerPrimeNgComponent {
  progressSpinnerVisible = false;

  constructor(private spinnerPrimeNgSrv: SpinnerPrimeNgService) {
    this.spinnerPrimeNgSrv.observableSpinnerVisible.subscribe({
      next: (res) => {
        this.progressSpinnerVisible = res;
      },
      error: () => {
        this.progressSpinnerVisible = false;
      }
    });
  }
}
