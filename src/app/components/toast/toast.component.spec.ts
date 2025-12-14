import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastComponent } from './toast.component';
import { ToastService } from '../../services/toast.service';

describe('ToastComponent', () => {
  let component: ToastComponent;
  let fixture: ComponentFixture<ToastComponent>;
  let toastService: ToastService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToastComponent, BrowserAnimationsModule],
      providers: [ToastService],
    }).compileComponents();

    toastService = TestBed.inject(ToastService);
    fixture = TestBed.createComponent(ToastComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get correct icon for success type', () => {
    expect(component.getIconClass('success')).toBe('✓');
  });

  it('should get correct icon for error type', () => {
    expect(component.getIconClass('error')).toBe('✕');
  });

  it('should get correct icon for warning type', () => {
    expect(component.getIconClass('warning')).toBe('⚠');
  });

  it('should get correct icon for info type', () => {
    expect(component.getIconClass('info')).toBe('ℹ');
  });

});
