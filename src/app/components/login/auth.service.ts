import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse, DecodedToken } from './auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/Auth`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'user_data';

  constructor(
    private readonly http: HttpClient
  ) { }

  loginAsync(credentials: { email: string; password: string }): Observable<AuthResponse> {
    this.clearAllStorageData();
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials);
  }

  setSession(response: AuthResponse) {
    if (response.success) {
      localStorage.setItem(this.TOKEN_KEY, response.token);
    }
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return false;
    try {
      const decoded = this.getDecodedToken();
      if (!decoded) return false;
      const expirationDate = new Date(decoded.exp * 1000);
      const isExpired = expirationDate <= new Date();
      if (isExpired) {
        localStorage.removeItem(this.TOKEN_KEY);
        return false;
      }
      return true;
    } catch {
      return false;
    }
  }

  getUserData() {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  logoutAsync(): Observable<HttpResponse<void>> {
    const userEmail = this.getUserEmail();
    return this.http.post<void>(
      `${this.apiUrl}/logout`,
      { email: userEmail },
      { observe: 'response' }
    ).pipe(
      tap(() => {
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
      })
    );
  }

  getDecodedToken(): DecodedToken | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return null;

    try {
      const payload = token.split('.')[1];
      const decodedPayload = JSON.parse(atob(payload));
      return decodedPayload;
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  }

  getUserEmail(): string | null {
    const decoded = this.getDecodedToken();
    return decoded?.sub ?? null;
  }

  getUserGuidAsync(): Observable<string | null> {
    const decoded = this.getDecodedToken();
    return of(decoded?.userGuid ?? null);
  }

  isTokenValidAsync(): Observable<boolean> {
    const token = localStorage.getItem(this.TOKEN_KEY);
    if (!token) return of(false);
    return this.http.post<boolean>(`${this.apiUrl}/validate-token`, { token });
  }

  refreshTokenAsync(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/refresh-token`,
      {},
      { withCredentials: true }
    ).pipe(
      tap(response => {
        this.setSession(response);
      })
    );
  }

  private clearAllStorageData() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }
}