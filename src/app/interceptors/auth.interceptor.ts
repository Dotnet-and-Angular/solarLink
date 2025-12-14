import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private toastService: ToastService,
        private router: Router
    ) { }

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // Add auth token to request headers
        const token = this.authService.getToken();
        if (token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`,
                },
            });
        }

        return next.handle(request).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // Unauthorized - token expired or invalid
                    this.authService.logout();
                    this.toastService.error('Session expired. Please login again.', 5000);
                    this.router.navigate(['/login']);
                } else if (error.status === 403) {
                    // Forbidden
                    this.toastService.error('Access denied. You do not have permission.', 5000);
                } else if (error.status === 404) {
                    // Not found
                    this.toastService.error('Resource not found.', 4000);
                } else if (error.status === 500) {
                    // Server error
                    this.toastService.error('Server error. Please try again later.', 5000);
                } else if (error.status === 0) {
                    // Network error
                    this.toastService.error('Network error. Please check your connection.', 5000);
                }
                return throwError(() => error);
            })
        );
    }
}
