import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User, AuthCredentials, AuthResponse, UserRole } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private tokenSubject = new BehaviorSubject<string | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private redirectUrlSubject = new BehaviorSubject<string>('/');

  private apiUrl = 'http://localhost:5011/api/auth';

  public currentUser$ = this.currentUserSubject.asObservable();
  public token$ = this.tokenSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  public redirectUrl$ = this.redirectUrlSubject.asObservable();

  constructor(private http: HttpClient) {
    if (typeof window !== 'undefined') {
      this.loadStoredSession();
    }
  }

  private loadStoredSession(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    const storedToken = localStorage.getItem('auth_token');
    const storedUser = localStorage.getItem('current_user');

    if (storedToken && storedUser) {
      this.tokenSubject.next(storedToken);
      const user = JSON.parse(storedUser);
      this.currentUserSubject.next(user);
      this.isAuthenticatedSubject.next(true);
    }
  }

  login(credentials: AuthCredentials): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap((response: any) => {
        try {
          if (response && response.token) {
            const token = response.token;

            // Handle different response formats from backend
            const userData = response.user || response;
            const roleStr = (userData.role || 'customer').toString().toLowerCase();

            const user: User = {
              id: userData.id || userData.userId || '',
              email: userData.email || credentials.email,
              name: userData.name || 'User',
              role: roleStr as UserRole,
              phone: userData.phone || '',
              isActive: userData.isActive ?? true,
              organizationId: userData.organizationId,
            };

            // Store session
            localStorage.setItem('auth_token', token);
            localStorage.setItem('current_user', JSON.stringify(user));

            // Update subjects
            this.tokenSubject.next(token);
            this.currentUserSubject.next(user);
            this.isAuthenticatedSubject.next(true);
          } else {
            throw new Error('Invalid login response: No token received');
          }
        } catch (error: any) {
          throw error;
        }
      }),
      catchError((error) => {
        throw error;
      })
    );
  }

  logout(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        this.tokenSubject.next(null);
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
      }),
      catchError((error) => {
        // Clear local state even if API call fails
        localStorage.removeItem('auth_token');
        localStorage.removeItem('current_user');
        this.tokenSubject.next(null);
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
        throw error;
      })
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return this.tokenSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  hasRole(role: UserRole): boolean {
    const currentUser = this.currentUserSubject.value;
    return currentUser?.role === role;
  }

  hasPermission(permission: string): boolean {
    const currentUser = this.currentUserSubject.value;
    if (!currentUser) return false;

    const rolePermissions = this.getRolePermissions(currentUser.role);
    return rolePermissions.includes(permission);
  }

  private getRolePermissions(role: UserRole): string[] {
    const permissions: Record<UserRole, string[]> = {
      customer: [
        'view_own_systems',
        'view_own_production',
        'view_own_savings',
        'create_ticket',
        'view_own_tickets',
      ],
      technician: [
        'view_assigned_systems',
        'update_ticket',
        'view_tickets',
        'view_inventory',
        'create_service_log',
      ],
      installer: [
        'view_all_systems',
        'create_system',
        'update_system',
        'view_all_clients',
        'manage_inventory',
      ],
      admin: [
        'view_all_systems',
        'view_all_clients',
        'manage_users',
        'manage_tickets',
        'view_analytics',
        'manage_roles',
        'manage_inventory',
        'export_data',
      ],
    };
    return permissions[role] || [];
  }

  /**
   * Register new user (signup)
   */
  registerUser(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/signup`, userData);
  }

  /**
   * Get current user profile
   */
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/profile`);
  }

  /**
   * Get the redirect URL (for post-login navigation)
   */
  getRedirectUrl(): string {
    return this.redirectUrlSubject.value;
  }

  /**
   * Set the redirect URL (called by auth guard when intercepting unauthorized access)
   */
  setRedirectUrl(url: string): void {
    this.redirectUrlSubject.next(url);
  }
  /**
   * Clear the redirect URL after navigation
   */
  clearRedirectUrl(): void {
    this.redirectUrlSubject.next('/');
  }
}
