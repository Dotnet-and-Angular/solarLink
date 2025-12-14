import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { vi } from 'vitest';

import { AdminDashboardComponent } from './admin-dashboard.component';
import { SolarSystemService } from '../../../services/solar-system.service';
import { of } from 'rxjs';

describe('AdminDashboardComponent', () => {
    let component: AdminDashboardComponent;
    let fixture: ComponentFixture<AdminDashboardComponent>;
    let solarSystemService: Partial<SolarSystemService>;

    beforeEach(async () => {
        solarSystemService = {
            systems$: of([]),
        };

        await TestBed.configureTestingModule({
            imports: [
                CommonModule,
                FormsModule,
                AdminDashboardComponent,
            ],
            providers: [{ provide: SolarSystemService, useValue: solarSystemService }],
        }).compileComponents();

        fixture = TestBed.createComponent(AdminDashboardComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should display admin header', () => {
        fixture.detectChanges();
        const header = fixture.nativeElement.querySelector('.admin-header');
        expect(header).toBeTruthy();
        const title = header.querySelector('h1');
        expect(title.textContent).toContain('Mission Control');
    });

    it('should display admin layout', () => {
        fixture.detectChanges();
        const layout = fixture.nativeElement.querySelector('.admin-layout');
        expect(layout).toBeTruthy();
    });

    it('should display sidebar navigation', () => {
        fixture.detectChanges();
        const sidebar = fixture.nativeElement.querySelector('.admin-sidebar');
        expect(sidebar).toBeTruthy();
        const navLinks = sidebar.querySelectorAll('.sidebar-nav__link');
        expect(navLinks.length).toBe(8);
    });

    it('should display main content area', () => {
        fixture.detectChanges();
        const main = fixture.nativeElement.querySelector('.admin-main');
        expect(main).toBeTruthy();
    });

    it('should display status overview cards', () => {
        fixture.detectChanges();
        const statusOverview = fixture.nativeElement.querySelector('.status-overview');
        expect(statusOverview).toBeTruthy();
    });

    it('should display tickets section', () => {
        fixture.detectChanges();
        const ticketsSection = fixture.nativeElement.querySelector('.tickets-section');
        expect(ticketsSection).toBeTruthy();
    });

    it('should display systems section', () => {
        fixture.detectChanges();
        const systemsSection = fixture.nativeElement.querySelector('.systems-section');
        expect(systemsSection).toBeTruthy();
    });

    it('should display action buttons in header', () => {
        fixture.detectChanges();
        const buttons = fixture.nativeElement.querySelectorAll('.admin-header__button');
        expect(buttons.length).toBe(2);
    });

    it('should display tickets table', () => {
        fixture.detectChanges();
        const table = fixture.nativeElement.querySelector('.tickets-table');
        expect(table).toBeTruthy();
        const headers = table.querySelectorAll('th');
        expect(headers.length).toBeGreaterThan(0);
    });

    it('should display system cards grid', () => {
        fixture.detectChanges();
        const systemsGrid = fixture.nativeElement.querySelector('.systems-grid');
        expect(systemsGrid).toBeTruthy();
    });

    it('should display search input for systems', () => {
        fixture.detectChanges();
        const searchInput = fixture.nativeElement.querySelector('.search-input');
        expect(searchInput).toBeTruthy();
        expect(searchInput.placeholder).toContain('Search');
    });

    it('should display filter selects for tickets', () => {
        fixture.detectChanges();
        const filters = fixture.nativeElement.querySelectorAll('.filter-select');
        expect(filters.length).toBe(2);
    });

    it('should initialize systemStats', () => {
        expect(component.systemStats).toBeDefined();
        expect(component.systemStats.total).toBeGreaterThan(0);
    });

    it('should have mock tickets data', () => {
        expect(component.mockTickets).toBeDefined();
        expect(component.mockTickets.length).toBeGreaterThan(0);
    });

    it('should have systems data', () => {
        expect(component.systems).toBeDefined();
        expect(component.systems.length).toBeGreaterThan(0);
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
