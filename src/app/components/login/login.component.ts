import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { ToastComponent } from '../toast/toast.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ToastComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  error = '';
  showPassword = false;
  showTestCredentials = true;

  testCredentials = [
    { email: 'admin@example.com', password: 'admin123', role: 'Admin' },
    { email: 'admin@solarlink.com', password: 'admin123', role: 'Admin 2' },
    { email: 'technician@example.com', password: 'tech123', role: 'Technician' },
    { email: 'tech@solarlink.com', password: 'tech123', role: 'Technician 2' },
    { email: 'installer@example.com', password: 'installer123', role: 'Installer' },
    { email: 'customer@example.com', password: 'customer123', role: 'Customer' },
    { email: 'customer@rajufarms.com', password: 'customer123', role: 'Customer 2' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // redirect to home if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
      return;
    }

    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.loginForm.controls;
  }

  onSubmit(): void {
    this.submitted = true;
    this.error = '';

    // return if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    this.authService.login({ email: this.f['email'].value, password: this.f['password'].value }).subscribe({
      next: (response: any) => {
        try {
          const redirectUrl = this.authService.getRedirectUrl();

          // Get the role from response and normalize it
          const role = response.user?.role || response.role || 'customer';
          const normalizedRole = role.toLowerCase();
          const userRole = normalizedRole.charAt(0).toUpperCase() + normalizedRole.slice(1);

          // Get user info for display
          const userName = response.user?.name || response.name || 'User';

          // Show success toast
          this.toastService.success(`✓ Welcome ${userName}! Login successful. Redirecting...`, 3000);
          this.cdr.markForCheck();

          // Navigate based on role
          setTimeout(() => {
            if (normalizedRole === 'customer') {
              this.router.navigate(['/customer'], { replaceUrl: true });
            } else if (normalizedRole === 'admin') {
              this.router.navigate(['/admin'], { replaceUrl: true });
            } else if (normalizedRole === 'technician') {
              this.router.navigate(['/technician'], { replaceUrl: true });
            } else if (normalizedRole === 'installer') {
              this.router.navigate(['/installer'], { replaceUrl: true });
            } else {
              this.router.navigate([redirectUrl], { replaceUrl: true });
            }
          }, 500);

          this.authService.clearRedirectUrl();
        } catch (error: any) {
          this.error = 'Error processing login response';
          this.toastService.error('✕ Login error: ' + error.message, 4000);
          this.loading = false;
          this.cdr.markForCheck();
        }
      },
      error: (err: any) => {
        this.error = err.error?.message || err.message || 'Invalid email or password';
        this.toastService.error('✕ Login failed: ' + this.error, 4000);
        this.loading = false;
        this.cdr.markForCheck();
      },
    });
  }

  useTestCredential(credential: any): void {
    this.loginForm.patchValue({
      email: credential.email,
      password: credential.password,
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleTestCredentials(): void {
    this.showTestCredentials = !this.showTestCredentials;
  }
}
