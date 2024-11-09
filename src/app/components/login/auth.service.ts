import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

  @Injectable({
    providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
    private readonly TOKEN_KEY = 'auth_token';

    constructor(
      private readonly http: HttpClient
    ) {}

    login(credentials: { email: string; password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth/login`, credentials);
    }

    setSession(authResult: any) {
        localStorage.setItem(this.TOKEN_KEY, authResult.token);
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem(this.TOKEN_KEY);
        return !!token;
    }

    logout() {
        localStorage.removeItem(this.TOKEN_KEY);
    }
}