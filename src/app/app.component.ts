import { Component, OnInit } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { SpinnerPrimeNgModule } from '../shared/loader-spinner/spinner-primeng.module';
import { ToastModule } from 'primeng/toast';
import { AuthService } from './components/login/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    SpinnerPrimeNgModule,
    ToastModule
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'SGTD_Client';

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }else{
      if (this.authService.isAuthenticated() && !window.location.pathname.includes('/panel')) {
        this.router.navigate(['/panel']);
      }
    }
  }
}