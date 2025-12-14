import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SolarSystemService } from '../../../services/solar-system.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { ClientsService } from '../../../services/clients.service';
import { InventoryService } from '../../../services/inventory.service';
import { ToastService } from '../../../services/toast.service';
import { ServiceTicket, SolarSystem } from '../../../models/solar-system.model';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './admin-dashboard.component.html',
    styleUrl: './admin-dashboard.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
    activeTab: 'operations' | 'clients' | 'tickets' | 'inventory' | 'reports' = 'operations';

    systemStats = {
        total: 24,
        active: 18,
        warning: 4,
        offline: 2,
    };

    // Dashboard data
    portfolioOverview: any = null;
    clients: any[] = [];
    systemRanking: any[] = [];
    inventoryStatus: any = null;
    faultAnalysis: any = null;
    ticketsData: any[] = [];

    mockTickets: ServiceTicket[] = [
        {
            id: '1',
            ticketNumber: '#TKT001',
            customerId: 'C001',
            systemId: 'S001',
            title: 'Inverter malfunction',
            description: 'Inverter not responding',
            priority: 'critical',
            status: 'new',
            category: 'malfunction',
            createdDate: new Date('2025-12-13T10:00:00'),
            createdBy: 'Support Team',
            assignedTo: undefined,
            estimatedResolutionTime: 4,
            slaStatus: 'on-track',
        },
        {
            id: '2',
            ticketNumber: '#TKT002',
            customerId: 'C002',
            systemId: 'S002',
            title: 'Panel cleaning required',
            description: 'Panels need cleaning for optimal performance',
            priority: 'medium',
            status: 'assigned',
            category: 'maintenance',
            createdDate: new Date('2025-12-12T14:00:00'),
            createdBy: 'Support Team',
            assignedTo: 'Arjun',
            estimatedResolutionTime: 2,
            slaStatus: 'on-track',
        },
        {
            id: '3',
            ticketNumber: '#TKT003',
            customerId: 'C003',
            systemId: 'S003',
            title: 'Monitoring system offline',
            description: 'Dashboard not updating',
            priority: 'high',
            status: 'on-site',
            category: 'malfunction',
            createdDate: new Date('2025-12-13T09:15:00'),
            createdBy: 'Support Team',
            assignedTo: 'Vikram',
            estimatedResolutionTime: 3,
            slaStatus: 'at-risk',
        },
        {
            id: '4',
            ticketNumber: '#TKT004',
            customerId: 'C004',
            systemId: 'S004',
            title: 'Performance drop - check wiring',
            description: 'System efficiency down 15%',
            priority: 'medium',
            status: 'new',
            category: 'malfunction',
            createdDate: new Date('2025-12-13T08:45:00'),
            createdBy: 'Support Team',
            assignedTo: undefined,
            estimatedResolutionTime: 5,
            slaStatus: 'on-track',
        },
    ];

    systems: SolarSystem[] = [
        {
            id: '1',
            name: 'Mumbai - Residential',
            customerId: 'CUST001',
            status: 'online',
            capacity: 5.5,
            location: 'Bandra, Mumbai',
            installedDate: new Date('2023-01-15'),
            lastHealthCheck: new Date('2025-12-13T09:00:00'),
            performanceMetrics: {
                currentOutput: 4.2,
                efficiency: 94,
                uptime: 99.8,
                predictedDailyGeneration: 22.5,
                lastMaintenance: new Date('2025-11-15'),
            },
            components: [],
        },
        {
            id: '2',
            name: 'Delhi - Commercial',
            customerId: 'CUST002',
            status: 'online',
            capacity: 25,
            location: 'Gurgaon, Delhi',
            installedDate: new Date('2022-06-20'),
            lastHealthCheck: new Date('2025-12-13T08:30:00'),
            performanceMetrics: {
                currentOutput: 18.5,
                efficiency: 92,
                uptime: 99.5,
                predictedDailyGeneration: 120,
                lastMaintenance: new Date('2025-10-20'),
            },
            components: [],
        },
        {
            id: '3',
            name: 'Bangalore - Industrial',
            customerId: 'CUST003',
            status: 'warning',
            capacity: 50,
            location: 'Whitefield, Bangalore',
            installedDate: new Date('2021-03-10'),
            lastHealthCheck: new Date('2025-12-13T10:15:00'),
            performanceMetrics: {
                currentOutput: 35.2,
                efficiency: 87,
                uptime: 98.2,
                predictedDailyGeneration: 220,
                lastMaintenance: new Date('2025-09-10'),
            },
            components: [],
        },
        {
            id: '4',
            name: 'Chennai - Factory',
            customerId: 'CUST004',
            status: 'offline',
            capacity: 100,
            location: 'Kanchipuram, Chennai',
            installedDate: new Date('2020-11-05'),
            lastHealthCheck: new Date('2025-12-12T14:00:00'),
            performanceMetrics: {
                currentOutput: 0,
                efficiency: 0,
                uptime: 0,
                predictedDailyGeneration: 0,
                lastMaintenance: new Date('2025-08-01'),
            },
            components: [],
        },
    ];

    private destroy$ = new Subject<void>();

    constructor(
        private solarSystemService: SolarSystemService,
        private analyticsService: AnalyticsService,
        private clientsService: ClientsService,
        private inventoryService: InventoryService,
        private toastService: ToastService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.loadDashboardData();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private loadDashboardData(): void {
        // Initialize tickets data with mock data
        this.ticketsData = this.mockTickets;

        this.solarSystemService.systems$
            .pipe(takeUntil(this.destroy$))
            .subscribe((systems) => {
                this.systems = systems;
                this.cdr.markForCheck();
            });

        // Load portfolio overview
        this.analyticsService.getPortfolioOverview()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.portfolioOverview = data;
                this.cdr.markForCheck();
            });

        // Load clients
        this.clientsService.getClients()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.clients = data;
                this.cdr.markForCheck();
            });

        // Load system ranking
        this.analyticsService.getSystemRanking('efficiency')
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.systemRanking = data;
                this.cdr.markForCheck();
            });

        // Load inventory status
        this.inventoryService.getStockStatusReport()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.inventoryStatus = data;
                this.cdr.markForCheck();
            });

        // Load fault analysis
        this.analyticsService.getFaultAnalysisReport()
            .pipe(takeUntil(this.destroy$))
            .subscribe((data) => {
                this.faultAnalysis = data;
                this.cdr.markForCheck();
            });
    }

    setActiveTab(tab: 'operations' | 'clients' | 'tickets' | 'inventory' | 'reports'): void {
        this.activeTab = tab;
        this.cdr.markForCheck();
    }

    onCreateSystem(): void {
        this.toastService.success('System creation form opened - New 10kW residential system added', 5000);
        // Add new mock system
        this.systemStats.total += 1;
        this.systemStats.active += 1;
        this.systemRanking.unshift({
            rank: 1,
            name: 'New System - ' + new Date().toLocaleDateString(),
            efficiency: 95.2,
            capacity: 10,
            status: 'online'
        });
        this.cdr.markForCheck();
    }

    onManageUsers(): void {
        this.toastService.info('User management panel opened', 4000);
        // Show user management modal/drawer
    }

    onExportReport(): void {
        this.toastService.success('Portfolio report exported as PDF to Downloads', 5000);
        // Simulate report download
        const report = {
            name: `Portfolio_Report_${new Date().toLocaleDateString()}.pdf`,
            size: '2.5 MB',
            timestamp: new Date().toLocaleString()
        };
    }

    onViewAnalytics(systemId?: string): void {
        this.toastService.info(`Viewing analytics for ${systemId || 'all systems'}`, 4000);
        // Navigate to analytics page
    }

    onAssignTicket(ticketId: string): void {
        const ticket = this.ticketsData.find(t => t.id === ticketId);
        if (ticket) {
            ticket.status = 'assigned';
            ticket.assignedTo = 'Technician Team';
            this.toastService.success(`Ticket ${ticket.ticketNumber} assigned to Technician Team`, 4000);
            this.cdr.markForCheck();
        }
    }

    onManageInventory(): void {
        this.toastService.info('Inventory management panel opened', 4000);
        // Show inventory management modal
    }

    onViewClientDetail(clientId: number): void {
        this.toastService.info(`Opening client details for Client #${clientId}`, 4000);
        // Navigate to client profile
    }
}
