import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusBannerComponent } from './status-banner.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';

describe('StatusBannerComponent', () => {
    let component: StatusBannerComponent;
    let fixture: ComponentFixture<StatusBannerComponent>;
    let debugElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [StatusBannerComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StatusBannerComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display title', () => {
        component.title = 'System Error';
        fixture.detectChanges();
        const title = debugElement.query(By.css('.status-banner__title'));
        expect(title.nativeElement.textContent).toContain('System Error');
    });

    it('should display message', () => {
        component.message = 'Something went wrong';
        fixture.detectChanges();
        const message = debugElement.query(By.css('.status-banner__description'));
        expect(message.nativeElement.textContent).toContain('Something went wrong');
    });

    it('should display action button when provided', () => {
        component.actionText = 'Retry';
        fixture.detectChanges();
        const button = debugElement.query(By.css('.status-banner__button--action'));
        expect(button).toBeTruthy();
        expect(button.nativeElement.textContent).toContain('Retry');
    });

    it('should apply correct severity class', () => {
        component.severity = 'danger';
        fixture.detectChanges();
        const banner = debugElement.query(By.css('.status-banner'));
        expect(banner.nativeElement.classList.contains('status-danger')).toBeTruthy();
    });

    it('should hide banner when isHidden is true', () => {
        component.isHidden = true;
        fixture.detectChanges();
        const banner = debugElement.query(By.css('.status-banner'));
        expect(banner).toBeFalsy();
    });

    it('should emit actionClick event when action button clicked', () => {
        const emitSpy = vi.spyOn(component.actionClick, 'emit');
        component.actionText = 'Retry';
        fixture.detectChanges();
        const button = debugElement.query(By.css('.status-banner__button--action'));
        button.nativeElement.click();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should emit closed event when close button clicked', () => {
        const emitSpy = vi.spyOn(component.closed, 'emit');
        fixture.detectChanges();
        const closeButton = debugElement.query(By.css('.status-banner__button--close'));
        closeButton.nativeElement.click();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('should display correct icon for danger severity', () => {
        component.severity = 'danger';
        fixture.detectChanges();
        const icon = debugElement.query(By.css('.status-icon--danger'));
        expect(icon).toBeTruthy();
    });

    it('should display correct icon for success severity', () => {
        component.severity = 'success';
        fixture.detectChanges();
        const icon = debugElement.query(By.css('.status-icon--success'));
        expect(icon).toBeTruthy();
    });
});
