import { TestBed } from '@angular/core/testing';
import { ToastService } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have toast methods available', () => {
    expect(service.show).toBeDefined();
    expect(service.success).toBeDefined();
    expect(service.error).toBeDefined();
    expect(service.warning).toBeDefined();
    expect(service.info).toBeDefined();
    expect(service.dismiss).toBeDefined();
    expect(service.clearAll).toBeDefined();
  });

});
