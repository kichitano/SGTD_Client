import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../app/components/login/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
        private readonly router: Router
    ) {}

    canActivate(): boolean {
        if (this.authService.isAuthenticated()) {
            return true;
        }
        
        this.router.navigate(['/login']);
        return false;
    }
}