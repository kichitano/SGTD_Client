import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SpinnerPrimeNgModule } from '../shared/loader-spinner/spinner-primeng.module';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SpinnerPrimeNgModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'SGTD_Client';
}
