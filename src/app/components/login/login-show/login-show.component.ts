import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';

import { AuthService } from '../auth.service';
import { SpinnerPrimeNgService } from '../../../../shared/loader-spinner/spinner-primeng.service';
import { FloatLabelModule } from 'primeng/floatlabel';


@Component({
  selector: 'app-login-show',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FloatLabelModule
  ],
  templateUrl: './login-show.component.html',
  styleUrls: ['./login-show.component.scss']
})
export class LoginShowComponent {
  loginForm: FormGroup;
  submitted = false;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
    private readonly messageService: MessageService
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    const loginData = {
      email: this.loginForm.get('username')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.spinnerPrimeNgService
      .use(this.authService.login(loginData))
      .subscribe({
        next: (response) => {
          this.authService.setSession(response);
          this.router.navigate(['/panel/show']);
        },
        error: (error) => {
          // this.messageService.add({
          //   severity: 'error',
          //   summary: 'Error',
          //   detail: 'Credenciales inválidas',
          //   life: 3000
          // });
        }
      });
  }
}