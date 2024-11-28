import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiBaseUrl = 'http://localhost:3000';
  private loginUrl = `${this.apiBaseUrl}/api/login`;
  private refreshUrl = `${this.apiBaseUrl}/api/refresh`;

  private tokenKey = 'jwtToken';
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(
    !!this.getToken()
  );

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<any> {
    return this.http.post(this.loginUrl, credentials).pipe(
      map((response: any) => {
        if (response?.token) {
          this.storeToken(response.token);
          this.isAuthenticatedSubject.next(true);
        }
        return response;
      }),
      catchError((error) => {
        console.error('Login failed', error);
        throw error;
      })
    );
  }

  refreshToken(): Observable<any> {
    return this.http
      .post(this.refreshUrl, {}, { headers: this.getAuthHeaders() })
      .pipe(
        map((response: any) => {
          if (response?.token) {
            this.storeToken(response.token);
          }
          return response;
        }),
        catchError((error) => {
          console.error('Token refresh failed', error);
          throw error;
        })
      );
  }

  isAuthenticated(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  private storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  private getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }
}
