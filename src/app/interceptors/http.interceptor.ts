import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../environments/environment';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token
    const token = this.authService.getAuthToken();

    // Clone the request and add headers
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    });

    // Add authorization header if token exists
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    // Clone the request with new headers
    const clonedRequest = request.clone({
      headers: headers,
      withCredentials: true // This is important for CORS
    });

    return next.handle(clonedRequest);
  }
}
