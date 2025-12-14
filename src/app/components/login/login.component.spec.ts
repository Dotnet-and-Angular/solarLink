import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: any;
  let router: any;
  let toastService: any;

  beforeEach(async () => {
    // Create mock objects without jasmine spies
    authService = {
      login: () => { },
      isAuthenticated: () => false,
      getRedirectUrl: () => '/',
      clearRedirectUrl: () => { },
    };

    router = {
      navigate: () => { },
    };

    toastService = {
      show: () => { },
      success: () => { },
      error: () => { },
      warning: () => { },
      info: () => { },
      dismiss: () => { },
      clearAll: () => { },
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent, ReactiveFormsModule, FormsModule, BrowserAnimationsModule],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router },
        { provide: ToastService, useValue: toastService },
      ],
    }).compileComponents();

    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    toastService = TestBed.inject(ToastService);

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form on init', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('email')).toBeDefined();
    expect(component.loginForm.get('password')).toBeDefined();
    expect(component.loginForm.get('rememberMe')).toBeDefined();
  });

  it('should redirect to home if already authenticated', () => {
    authService.isAuthenticated.and.returnValue(true);
    component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should not submit if form is invalid', () => {
    component.submitted = false;
    component.onSubmit();

    expect(component.submitted).toBe(true);
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBe(false);
    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(true);
    component.togglePasswordVisibility();
    expect(component.showPassword).toBe(false);
  });

  it('should toggle test credentials display', () => {
    expect(component.showTestCredentials).toBe(true);
    component.toggleTestCredentials();
    expect(component.showTestCredentials).toBe(false);
    component.toggleTestCredentials();
    expect(component.showTestCredentials).toBe(true);
  });

  it('should populate form with test credentials', () => {
    const testCred = component.testCredentials[0];
    component.useTestCredential(testCred);

    expect(component.loginForm.get('email')?.value).toBe(testCred.email);
    expect(component.loginForm.get('password')?.value).toBe(testCred.password);
  });

  it('should have test credentials available', () => {
    expect(component.testCredentials.length).toBe(4);
    expect(component.testCredentials[0].role).toBe('Customer');
    expect(component.testCredentials[1].role).toBe('Technician');
    expect(component.testCredentials[2].role).toBe('Installer');
    expect(component.testCredentials[3].role).toBe('Admin');
  });

  it('should validate email format', () => {
    const emailControl = component.loginForm.get('email');

    emailControl?.setValue('invalid-email');
    expect(emailControl?.hasError('email')).toBe(true);

    emailControl?.setValue('valid@example.com');
    expect(emailControl?.hasError('email')).toBe(false);
  });

  it('should validate required fields', () => {
    const emailControl = component.loginForm.get('email');
    const passwordControl = component.loginForm.get('password');

    emailControl?.setValue('');
    passwordControl?.setValue('');

    expect(emailControl?.hasError('required')).toBe(true);
    expect(passwordControl?.hasError('required')).toBe(true);
  });

  it('should have form controls accessor', () => {
    const controls = component.f;
    expect(controls['email']).toBeDefined();
    expect(controls['password']).toBeDefined();
    expect(controls['rememberMe']).toBeDefined();
  });

  it('should initialize with empty form values', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.get('rememberMe')?.value).toBe(false);
  });

  it('should have loading flag set to false initially', () => {
    expect(component.loading).toBe(false);
  });

  it('should have submitted flag set to false initially', () => {
    expect(component.submitted).toBe(false);
  });

  it('should have empty error message initially', () => {
    expect(component.error).toBe('');
  });
});
