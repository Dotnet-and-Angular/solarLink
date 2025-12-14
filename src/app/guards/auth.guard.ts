import { Injectable } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';

/**
 * Auth Guard using CanActivateFn (Angular 17+ functional approach)
 * Protects routes based on authentication and role-based access control
 */
@Injectable({
  providedIn: 'root',
})
export class AuthGuardService {
  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) { }

  /**
   * Functional guard to check if user is authenticated
   */
  canActivateAuth(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Store the attempted URL for redirecting after login
    this.authService.setRedirectUrl(state.url);
    this.router.navigate(['/login']);
    return false;
  }

  /**
   * Functional guard to check if user has required role
   * Shows toast notification but does NOT redirect to unauthorized page
   */
  canActivateRole(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredRole = route.data['requiredRole'];

    if (!this.authService.isAuthenticated()) {
      this.toastService.error('Please log in to access this page', 5000);
      this.authService.setRedirectUrl(state.url);
      this.router.navigate(['/login']);
      return false;
    }

    if (requiredRole && !this.authService.hasRole(requiredRole)) {
      const currentUser = this.authService.getCurrentUser();
      const userRole = currentUser?.role || 'unknown';
      this.toastService.showUnauthorized(requiredRole, userRole);
      // Only show toast - don't redirect
      return false;
    }

    return true;
  }

  /**
   * Functional guard to check if user has required permission
   * Shows toast notification but does NOT redirect to unauthorized page
   */
  canActivatePermission(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const requiredPermission = route.data['requiredPermission'];

    if (!this.authService.isAuthenticated()) {
      this.toastService.error('Please log in to access this page', 5000);
      this.authService.setRedirectUrl(state.url);
      this.router.navigate(['/login']);
      return false;
    }

    if (requiredPermission && !this.authService.hasPermission(requiredPermission)) {
      const currentUser = this.authService.getCurrentUser();
      const userRole = currentUser?.role || 'unknown';
      this.toastService.showUnauthorized(requiredPermission, userRole);
      // Only show toast - don't redirect
      return false;
    }

    return true;
  }
}

/**
 * Standalone function guard for authentication check
 * Usage: canActivate: [authGuard]
 */
export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authGuardService = inject(AuthGuardService);
  return authGuardService.canActivateAuth(route, state);
};

/**
 * Standalone function guard for role-based access control
 * Usage: canActivate: [roleGuard]
 * In route config: data: { requiredRole: 'admin' }
 */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authGuardService = inject(AuthGuardService);
  return authGuardService.canActivateRole(route, state);
};

/**
 * Standalone function guard for permission-based access control
 * Usage: canActivate: [permissionGuard]
 * In route config: data: { requiredPermission: 'manage_users' }
 */
export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authGuardService = inject(AuthGuardService);
  return authGuardService.canActivatePermission(route, state);
};
