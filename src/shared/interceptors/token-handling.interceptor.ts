import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../app/components/login/auth.service';
import { SpinnerPrimeNgService } from '../loader-spinner/spinner-primeng.service';
import { MessageService } from 'primeng/api';

@Injectable()
export class TokenHandlingInterceptor implements HttpInterceptor {
    private publicUrls: string[] = ['/login', '/register'];

    constructor(
        private authService: AuthService,
        private router: Router,
        private readonly spinnerPrimeNgService: SpinnerPrimeNgService,
        private readonly messageService: MessageService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if (this.isPublicUrl(request.url)) {
            return next.handle(request);
        }

        const token = localStorage.getItem('auth_token');
        if (!token) {
            this.handleLogout('No se encontró token');
            return new Observable<HttpEvent<any>>();
        }

        if (this.isTokenExpired(token)) {
            this.handleLogout('Sesión caducada');
            return new Observable<HttpEvent<any>>();
        }

        const clonedRequest = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            },
        });

        return next.handle(clonedRequest).pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Error en la petición:', error);
                if (error.status === 401) {
                    this.handleLogout('Sesión inválida');
                }
                return throwError(() => error);
            })
        );
    }

    private handleLogout(message: string): void {
        this.spinnerPrimeNgService.hide();
        this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: message,
            life: 3000
        });
        this.authService.logoutAsync().subscribe(() => {
            this.router.navigate(['/login']);
        });
    }

    private isPublicUrl(url: string): boolean {
        return this.publicUrls.some(publicUrl => url.includes(publicUrl));
    }

    private isTokenExpired(token: string): boolean {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            const exp = payload.exp * 1000;
            const isExpired = Date.now() > exp;
            return isExpired;
        } catch (error) {
            console.error('Error decodificando token:', error);
            return true;
        }
    }
}
