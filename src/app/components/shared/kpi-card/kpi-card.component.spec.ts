import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KPICardComponent } from './kpi-card.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('KPICardComponent', () => {
    let component: KPICardComponent;
    let fixture: ComponentFixture<KPICardComponent>;
    let debugElement: DebugElement;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [KPICardComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(KPICardComponent);
        component = fixture.componentInstance;
        debugElement = fixture.debugElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display title', () => {
        component.title = 'Test KPI';
        fixture.detectChanges();
        const title = debugElement.query(By.css('.kpi-card__title'));
        expect(title.nativeElement.textContent).toContain('Test KPI');
    });

    it('should display value', () => {
        component.value = 42.5;
        fixture.detectChanges();
        const value = debugElement.query(By.css('.kpi-card__value'));
        expect(value.nativeElement.textContent).toContain('42.5');
    });

    it('should display unit', () => {
        component.value = 42.5;
        component.unit = 'kWh';
        fixture.detectChanges();
        const unit = debugElement.query(By.css('.kpi-card__unit'));
        expect(unit.nativeElement.textContent).toContain('kWh');
    });

    it('should apply correct color class', () => {
        component.valueColor = 'success';
        fixture.detectChanges();
        const value = debugElement.query(By.css('.kpi-card__value'));
        expect(value.nativeElement.classList.contains('text-success')).toBeTruthy();
    });

    it('should show change value when provided', () => {
        component.changeValue = 5;
        fixture.detectChanges();
        const change = debugElement.query(By.css('.kpi-card__change'));
        expect(change).toBeTruthy();
    });

    it('should display positive change indicator', () => {
        component.changeValue = 5;
        fixture.detectChanges();
        const change = debugElement.query(By.css('.kpi-card__change'));
        expect(change.nativeElement.classList.contains('positive')).toBeTruthy();
    });

    it('should display negative change indicator', () => {
        component.changeValue = -3;
        fixture.detectChanges();
        const change = debugElement.query(By.css('.kpi-card__change'));
        expect(change.nativeElement.classList.contains('negative')).toBeTruthy();
    });

    it('should display loading state', () => {
        component.isLoading = true;
        fixture.detectChanges();
        const card = debugElement.query(By.css('.kpi-card'));
        expect(card.nativeElement.classList.contains('loading')).toBeTruthy();
    });

    it('should display footer text when provided', () => {
        component.footerText = 'Last updated: 10:30 AM';
        fixture.detectChanges();
        const footer = debugElement.query(By.css('.kpi-card__footer-text'));
        expect(footer.nativeElement.textContent).toContain('Last updated: 10:30 AM');
    });
});
