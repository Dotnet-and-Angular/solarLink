import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { Observable } from 'rxjs';
import { User } from '../../../models/auth.model';

@Component({
    selector: 'app-navigation',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterLinkActive],
    templateUrl: './navigation.component.html',
    styleUrl: './navigation.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavigationComponent {
    currentUser$: Observable<User | null>;
    isAuthenticated$: Observable<boolean>;

    constructor(
        private authService: AuthService,
        private router: Router,
        private toastService: ToastService
    ) {
        this.currentUser$ = this.authService.currentUser$;
        this.isAuthenticated$ = this.authService.isAuthenticated$;
    }

    logout(): void {
        const currentUser = this.authService.getCurrentUser();
        const userName = currentUser?.name || 'User';

        this.authService.logout().subscribe({
            next: () => {
                this.toastService.warning(`👋 Goodbye ${userName}! You have been logged out.`, 3000);
                setTimeout(() => {
                    this.router.navigate(['/login'], { replaceUrl: true });
                }, 500);
            },
            error: () => {
                // Even if logout API fails, clear local state
                this.toastService.warning(`👋 Goodbye ${userName}! You have been logged out.`, 3000);
                setTimeout(() => {
                    this.router.navigate(['/login'], { replaceUrl: true });
                }, 500);
            }
        });
    }

    getRoleColor(role: string): string {
        const roleColors: { [key: string]: string } = {
            customer: 'role-customer',
            technician: 'role-technician',
            installer: 'role-installer',
            admin: 'role-admin',
        };
        return roleColors[role] || 'role-default';
    }
}

