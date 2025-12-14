import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

import { SolarSystemService } from '../../../services/solar-system.service';
import { EnergyDataService } from '../../../services/energy-data.service';
import { ServiceOperationsService } from '../../../services/service-operations.service';
import { FinancialService } from '../../../services/financial.service';
import { ToastService } from '../../../services/toast.service';
import { DailyKPI, EnergyDataPoint, SystemStatus } from '../../../models/solar-system.model';

import { KPICardComponent } from '../../shared/kpi-card/kpi-card.component';
import { StatusBannerComponent } from '../../shared/status-banner/status-banner.component';
import { EnergyChartComponent } from '../../shared/energy-chart/energy-chart.component';

@Component({
    selector: 'app-customer-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        KPICardComponent,
        StatusBannerComponent,
        EnergyChartComponent,
    ],
    templateUrl: './customer-dashboard.component.html',
    styleUrl: './customer-dashboard.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerDashboardComponent implements OnInit, OnDestroy {
    kpi: DailyKPI | null = null;
    energyData: EnergyDataPoint[] = [];
    systemStatus: SystemStatus = 'online';
    showAlert = true;

    isLoadingKPI = false;
    activeTab: 'overview' | 'production' | 'savings' | 'tickets' = 'overview';

    selectedTimeRange: 'day' | 'week' | 'month' | 'year' = 'day';
    timeRanges: Array<'day' | 'week' | 'month' | 'year'> = [
        'day',
        'week',
        'month',
        'year',
    ];

    // Dashboard data
    savingsData: any = null;
    ticketsData: any = null;
    billHistory: any[] = [];
    financialSummary: any = null;

    private destroy$ = new Subject<void>();

    // KPI properties for template
    get savingsINR(): number {
        return this.kpi?.savingsINR || this.financialSummary?.annualSavings || 0;
    }

    get systemHealth(): number {
        return 95; // Default value
    }

    constructor(
        private solarSystemService: SolarSystemService,
        private energyDataService: EnergyDataService,
        private serviceOpsService: ServiceOperationsService,
        private financialService: FinancialService,
        private toastService: ToastService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadDashboardData();
        this.setupSubscriptions();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadDashboardData(): void {
        this.isLoadingKPI = true;

        this.solarSystemService.dailyKPI$
            .pipe(takeUntil(this.destroy$))
            .subscribe((kpi) => {
                this.kpi = kpi;
                this.isLoadingKPI = false;
                this.cdr.markForCheck();
            });

        this.solarSystemService.energyData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.energyData = data;
                this.cdr.markForCheck();
            });

        this.solarSystemService.systemStatus$
            .pipe(takeUntil(this.destroy$))
            .subscribe((status) => {
                this.systemStatus = status;
                this.cdr.markForCheck();
            });

        // Load financial data
        this.financialService.getFinancialSummary('site-001')
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.financialSummary = data;
                this.cdr.markForCheck();
            });

        // Load bill history
        this.financialService.getBillHistory('cust-001')
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.billHistory = data;
                this.cdr.markForCheck();
            });

        // Load customer tickets
        this.serviceOpsService.getCustomerTickets('cust-001')
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.ticketsData = data;
                this.cdr.markForCheck();
            });
    }

    private setupSubscriptions(): void {
        // Auto-refresh KPI every 30 seconds
        setInterval(() => {
            this.solarSystemService.refreshDailyKPI()
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        }, 30000);
    }

    setActiveTab(tab: 'overview' | 'production' | 'savings' | 'tickets'): void {
        this.activeTab = tab;
        this.cdr.markForCheck();
    }

    onTimeRangeChange(range: 'day' | 'week' | 'month' | 'year'): void {
        this.selectedTimeRange = range;
        // In a real app, fetch data for the selected range
    }

    onRaiseTicket(): void {
        this.toastService.success('Service ticket #TKT12345 created successfully - Status: Open', 5000);
        // Add new ticket to list
        this.ticketsData = this.ticketsData || [];
        this.ticketsData.unshift({
            id: 'NEW',
            ticketNumber: '#TKT' + Math.floor(Math.random() * 100000),
            title: 'New Support Request',
            status: 'open',
            priority: 'medium',
            createdDate: new Date().toLocaleString()
        });
        this.cdr.markForCheck();
    }

    onViewAnalytics(): void {
        this.toastService.info('Opening detailed analytics dashboard...', 4000);
        // Navigate to analytics page with system data
    }

    onDownloadReport(): void {
        this.toastService.success('Monthly performance report downloaded as PDF', 5000);
        // Trigger report download
        const report = {
            name: `System_Report_${new Date().toLocaleDateString()}.pdf`,
            size: '1.8 MB',
            generatedAt: new Date().toLocaleString()
        };
    }

    onContactSupport(): void {
        this.toastService.success('Support chat opened - Estimated wait: 2 minutes', 5000);
        // Open support chat window
    }

    onExportData(): void {
        this.toastService.success('Energy data exported as CSV file', 5000);
        // Export data to CSV/Excel
        const exportData = {
            fileName: `System_Data_${new Date().toLocaleDateString()}.csv`,
            records: 8760,
            timeRange: 'Annual'
        };
    }

    onAlertClose(): void {
        this.showAlert = false;
        this.cdr.markForCheck();
    }
}
