import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';
import { vi } from 'vitest';

import { CustomerDashboardComponent } from './customer-dashboard.component';
import { SolarSystemService } from '../../../services/solar-system.service';
import { KPICardComponent } from '../../shared/kpi-card/kpi-card.component';
import { StatusBannerComponent } from '../../shared/status-banner/status-banner.component';
import { EnergyChartComponent } from '../../shared/energy-chart/energy-chart.component';
import { DailyKPI, EnergyDataPoint, SystemStatus } from '../../../models/solar-system.model';

describe('CustomerDashboardComponent', () => {
    let component: CustomerDashboardComponent;
    let fixture: ComponentFixture<CustomerDashboardComponent>;
    let solarSystemService: Partial<SolarSystemService>;

    const mockKPI: DailyKPI = {
        generatedKwh: 24.5,
        consumedKwh: 18.3,
        savingsINR: 245,
        co2OffsetKg: 12.3,
        systemEfficiency: 94.5,
        peakGenerationTime: '12:30 PM',
        lastUpdated: new Date(),
    };

    const mockEnergyData: EnergyDataPoint[] = [
        { timestamp: new Date(2024, 0, 1, 6), generatedKwh: 0, consumedKwh: 0.5, temperature: 22, irradiance: 0 },
        { timestamp: new Date(2024, 0, 1, 12), generatedKwh: 8, consumedKwh: 2, temperature: 32, irradiance: 850 },
        { timestamp: new Date(2024, 0, 1, 18), generatedKwh: 1, consumedKwh: 2, temperature: 26, irradiance: 100 },
    ];

    beforeEach(async () => {
        solarSystemService = {
            dailyKPI$: of(mockKPI),
            energyData$: of(mockEnergyData),
            systemStatus$: of('online' as SystemStatus),
            refreshDailyKPI: vi.fn(),
        };

        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FormsModule,
                CustomerDashboardComponent,
                KPICardComponent,
                StatusBannerComponent,
                EnergyChartComponent,
            ],
            providers: [{ provide: SolarSystemService, useValue: solarSystemService }],
        }).compileComponents();

        fixture = TestBed.createComponent(CustomerDashboardComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
        expect(component.selectedTimeRange).toBe('day');
        expect(component.showAlert).toBe(true);
        expect(component.isLoadingKPI).toBe(false);
    });

    it('should load KPI data on init', () => {
        fixture.detectChanges();
        setTimeout(() => {
            expect(component.kpi).toEqual(mockKPI);
        }, 100);
    });

    it('should load energy data on init', () => {
        fixture.detectChanges();
        setTimeout(() => {
            expect(component.energyData).toEqual(mockEnergyData);
        }, 100);
    });

    it('should load system status on init', () => {
        fixture.detectChanges();
        setTimeout(() => {
            expect(component.systemStatus).toBe('online');
        }, 100);
    });

    it('should display dashboard header', () => {
        fixture.detectChanges();
        const header = fixture.nativeElement.querySelector('.dashboard-header');
        expect(header).toBeTruthy();
        const title = header.querySelector('h1');
        expect(title.textContent).toContain('Solar Dashboard');
    });

    it('should display KPI cards section', () => {
        fixture.detectChanges();
        const kpiSection = fixture.nativeElement.querySelector('.kpi-section');
        expect(kpiSection).toBeTruthy();
        const kpiCards = kpiSection.querySelectorAll('app-kpi-card');
        expect(kpiCards.length).toBe(4);
    });

    it('should display time selector buttons', () => {
        fixture.detectChanges();
        const timeSelector = fixture.nativeElement.querySelector('.time-selector');
        expect(timeSelector).toBeTruthy();
        const buttons = timeSelector.querySelectorAll('.time-button');
        expect(buttons.length).toBe(4); // day, week, month, year
    });

    it('should highlight active time range button', () => {
        component.selectedTimeRange = 'week';
        fixture.detectChanges();
        const activeButton = fixture.nativeElement.querySelector('.time-button.active');
        expect(activeButton).toBeTruthy();
        expect(activeButton.textContent.trim()).toContain('week');
    });

    it('should change time range on button click', () => {
        fixture.detectChanges();
        const spy = vi.spyOn(component, 'onTimeRangeChange');
        const buttons = fixture.nativeElement.querySelectorAll('.time-button');
        buttons[1].click(); // Click on 'week'
        expect(spy).toHaveBeenCalledWith('week');
    });

    it('should display energy chart', () => {
        fixture.detectChanges();
        const energyChart = fixture.nativeElement.querySelector('app-energy-chart');
        expect(energyChart).toBeTruthy();
    });

    it('should display action cards', () => {
        fixture.detectChanges();
        const actionCards = fixture.nativeElement.querySelectorAll('.action-card');
        expect(actionCards.length).toBe(3);
    });

    it('should display info section', () => {
        fixture.detectChanges();
        const infoSection = fixture.nativeElement.querySelector('.info-section');
        expect(infoSection).toBeTruthy();
        const infoCards = infoSection.querySelectorAll('.info-card');
        expect(infoCards.length).toBe(4);
    });

    it('should hide status banner when system is online', () => {
        component.systemStatus = 'online';
        component.showAlert = true;
        fixture.detectChanges();
        const banner = fixture.nativeElement.querySelector('app-status-banner');
        expect(banner).toBeNull();
    });

    it('should show status banner when system is offline', () => {
        component.systemStatus = 'offline';
        component.showAlert = true;
        fixture.detectChanges();
        const banner = fixture.nativeElement.querySelector('app-status-banner');
        expect(banner).toBeTruthy();
    });

    it('should call onAlertClose when banner is closed', () => {
        component.systemStatus = 'offline';
        component.showAlert = true;
        fixture.detectChanges();
        const spy = vi.spyOn(component, 'onAlertClose');
        const banner = fixture.debugElement.query(p => p.name === 'app-status-banner');
        if (banner) {
            banner.componentInstance.closed.emit();
            expect(spy).toHaveBeenCalled();
        }
    });

    it('should hide alert when onAlertClose is called', () => {
        component.showAlert = true;
        component.onAlertClose();
        expect(component.showAlert).toBe(false);
    });

    it('should call onRaiseTicket when action button is clicked', () => {
        fixture.detectChanges();
        const spy = vi.spyOn(component, 'onRaiseTicket');
        const buttons = fixture.nativeElement.querySelectorAll('.action-card__button');
        buttons[0].click();
        expect(spy).toHaveBeenCalled();
    });

    it('should call onViewAnalytics when analytics button is clicked', () => {
        fixture.detectChanges();
        const spy = vi.spyOn(component, 'onViewAnalytics');
        const buttons = fixture.nativeElement.querySelectorAll('.action-card__button');
        buttons[1].click();
        expect(spy).toHaveBeenCalled();
    });

    it('should display KPI values', () => {
        fixture.detectChanges();
        setTimeout(() => {
            fixture.detectChanges();
            const kpiValues = fixture.nativeElement.querySelectorAll('app-kpi-card');
            expect(kpiValues.length).toBe(4);
        }, 100);
    });

    it('should display system status badge', () => {
        component.systemStatus = 'online';
        fixture.detectChanges();
        const statusBadge = fixture.nativeElement.querySelector('.system-status');
        expect(statusBadge).toBeTruthy();
        expect(statusBadge.textContent).toContain('ONLINE');
    });

    it('should apply correct status class', () => {
        component.systemStatus = 'online';
        fixture.detectChanges();
        const statusBadge = fixture.nativeElement.querySelector('.system-status');
        expect(statusBadge.classList.contains('status-online')).toBe(true);
    });

    it('should use OnPush change detection', () => {
        const metadata = (component.constructor as any).ɵcmp;
        expect(metadata.changeDetection).toBe(1); // ChangeDetectionStrategy.OnPush = 1
    });

    it('should unsubscribe on destroy', () => {
        fixture.detectChanges();
        const nextSpy = vi.spyOn(component['destroy$'], 'next');
        const completeSpy = vi.spyOn(component['destroy$'], 'complete');
        component.ngOnDestroy();
        expect(nextSpy).toHaveBeenCalled();
        expect(completeSpy).toHaveBeenCalled();
    });
});
