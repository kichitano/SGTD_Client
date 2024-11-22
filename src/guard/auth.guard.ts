import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../app/components/login/auth.service';
import { MessageService } from 'primeng/api';

export const AuthGuard: CanActivateFn = (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const messageService = inject(MessageService);
    
    if (authService.isAuthenticated()) {
        return true;
    }

    messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Sesión no válida',
        life: 3000
    });
    
    router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
    });
    
    return false;
};