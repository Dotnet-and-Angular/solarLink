import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  dismissible?: boolean;
}

/**
 * Toast Notification Service
 * Manages toast messages displayed to users
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  public toasts$ = this.toastsSubject.asObservable();

  private toastId = 0;

  constructor(private ngZone: NgZone) { }

  /**
   * Show a toast notification
   */
  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration: number = 4000): Toast {
    const toast: Toast = {
      id: `toast-${++this.toastId}`,
      message,
      type,
      duration,
      dismissible: true,
    };

    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next([...currentToasts, toast]);

    // Auto-dismiss after duration (if duration is specified)
    if (duration > 0) {
      this.ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this.ngZone.run(() => {
            this.dismiss(toast.id);
          });
        }, duration);
      });
    }

    return toast;
  }

  /**
   * Show success toast
   */
  success(message: string, duration: number = 4000): Toast {
    return this.show(message, 'success', duration);
  }

  /**
   * Show error toast
   */
  error(message: string, duration: number = 5000): Toast {
    return this.show(message, 'error', duration);
  }

  /**
   * Show warning toast
   */
  warning(message: string, duration: number = 4000): Toast {
    return this.show(message, 'warning', duration);
  }

  /**
   * Show info toast
   */
  info(message: string, duration: number = 4000): Toast {
    return this.show(message, 'info', duration);
  }

  /**
   * Show unauthorized access message with required role
   */
  showUnauthorized(requiredRole: string, userRole: string): Toast {
    const message = `🔒 Unauthorized Access! Required role: ${requiredRole.toUpperCase()}. Your role: ${userRole.toUpperCase()}`;
    return this.show(message, 'error', 5000);
  }

  /**
   * Dismiss a toast
   */
  dismiss(id: string): void {
    const currentToasts = this.toastsSubject.value;
    this.toastsSubject.next(currentToasts.filter((t) => t.id !== id));
  }

  /**
   * Clear all toasts
   */
  clearAll(): void {
    this.toastsSubject.next([]);
  }
}
