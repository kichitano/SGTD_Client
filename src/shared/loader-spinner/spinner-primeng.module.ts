import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { ProgressSpinnerModule } from 'primeng/progressspinner';

import { SpinnerPrimeNgComponent } from './spinner-primeng.component';

@NgModule({
  declarations: [SpinnerPrimeNgComponent],
  imports: [CommonModule, ProgressSpinnerModule],
  exports: [SpinnerPrimeNgComponent]
})
export class SpinnerPrimeNgModule {}
