import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ToastrService } from 'ngx-toastr';

interface User {
  id: number;
  email: string;
  name: string;
  token: string;
}

interface LoginResponse {
  data: {
    token_type: string;
    access_token: string;
    access_token_expires: string;
    refresh_token: string;
    refresh_token_expires: string;
  };
  meta: {
    error: boolean;
    message: string | null;
  };
  status_code: number;
}

interface UserProfileResponse {
  data: {
    id: number;
    name: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser: Observable<User | null>;
  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.currentUserSubject = new BehaviorSubject<User | null>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private getUserProfile(): Observable<UserProfileResponse> {
    return this.http.get<UserProfileResponse>(`${this.apiUrl}/auth/me`);
  }

  login(username: string, password: string): Observable<any> {
    const loginData = {
      email: username,
      password: password,
      remember: true
    };

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, loginData)
      .pipe(
        switchMap(response => {
          if (response?.data?.access_token) {
            // Store tokens
            localStorage.setItem(environment.auth.tokenKey, response.data.access_token);
            localStorage.setItem(environment.auth.refreshTokenKey, response.data.refresh_token);
            localStorage.setItem(environment.auth.tokenExpiryKey, response.data.access_token_expires);

            // Get user profile
            return this.getUserProfile().pipe(
              map(profileResponse => {
                const userData = {
                  id: profileResponse.data.id,
                  email: profileResponse.data.email,
                  name: profileResponse.data.name,
                  token: response.data.access_token
                };

                // Store user data
                localStorage.setItem('currentUser', JSON.stringify(userData));
                this.currentUserSubject.next(userData);
                return userData;
              })
            );
          }
          return throwError(() => new Error('Login response invalid'));
        }),
        catchError(error => {
          console.error('Login error:', error);
          let errorMessage = 'Đăng nhập thất bại';

          // Handle the specific error format from your API
          if (error.error?.data) {
            errorMessage = error.error.data;
          } else if (error.error?.message) {
            errorMessage = error.error.message;
          }

          return throwError(() => ({ message: errorMessage }));
        })
      );
  }

  logout() {
    // Attempt to call logout endpoint if it exists
    const headers = {
      'Authorization': `Bearer ${this.getAuthToken()}`
    };

    this.http.post(`${this.apiUrl}/auth/logout`, {}, { headers }).subscribe({
      next: () => this.handleLogout(),
      error: () => this.handleLogout() // Still logout locally even if server request fails
    });
  }

  private handleLogout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem(environment.auth.tokenKey);
    localStorage.removeItem(environment.auth.refreshTokenKey);
    localStorage.removeItem(environment.auth.tokenExpiryKey);
    this.currentUserSubject.next(null);
    this.toastr.info('Đã đăng xuất khỏi hệ thống', 'Thông báo');
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(environment.auth.tokenKey);
    return !!token;
  }

  getAuthToken(): string | null {
    return localStorage.getItem(environment.auth.tokenKey);
  }
}
