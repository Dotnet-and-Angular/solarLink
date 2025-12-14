import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { TechnicianScheduleService } from '../../../services/technician-schedule.service';
import { ToastService } from '../../../services/toast.service';
import { AnalyticsService } from '../../../services/analytics.service';
import { ServiceOperationsService } from '../../../services/service-operations.service';

@Component({
    selector: 'app-technician-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './technician-dashboard.component.html',
    styleUrl: './technician-dashboard.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TechnicianDashboardComponent implements OnInit, OnDestroy {
    activeTab: 'schedule' | 'jobs' | 'performance' | 'clients' = 'schedule';

    // Dashboard data
    todaySchedule: any[] = [];
    assignedJobs: any[] = [];
    performanceMetrics: any = null;
    clientSites: any[] = [];

    // KPI data
    todayJobs = 0;
    completedJobs = 0;
    totalRevenue = 0;
    customerRating = 4.8;

    private destroy$ = new Subject<void>();

    constructor(
        private techScheduleService: TechnicianScheduleService,
        private toastService: ToastService,
        private analyticsService: AnalyticsService,
        private serviceOpsService: ServiceOperationsService,
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
        // Load today's schedule
        const mockSchedule = [
            {
                id: 'SCH-001',
                startTime: '09:00',
                duration: '4 hrs',
                jobTitle: 'Installation - Residential',
                location: 'Bangalore, Karnataka',
                customer: 'Rajesh Kumar',
                estimatedArrival: '09:15'
            },
            {
                id: 'SCH-002',
                startTime: '01:30 PM',
                duration: '3 hrs',
                jobTitle: 'Maintenance Check',
                location: 'Whitefield, Bangalore',
                customer: 'Tech Park Solutions',
                estimatedArrival: '01:45 PM'
            }
        ];

        this.todaySchedule = mockSchedule;
        this.todayJobs = mockSchedule.length;

        // Load assigned jobs
        const mockJobs = [
            {
                id: 'JOB-001',
                title: 'Residential Solar Installation',
                status: 'ASSIGNED',
                priority: 'HIGH',
                systemId: 'SYS-001',
                date: '2024-01-15',
                duration: '8 hrs',
                description: 'Complete installation of 10kW residential solar system'
            },
            {
                id: 'JOB-002',
                title: 'Commercial System Setup',
                status: 'IN-PROGRESS',
                priority: 'HIGH',
                systemId: 'SYS-002',
                date: '2024-01-15',
                duration: '6 hrs',
                description: 'Install and configure 50kW commercial system'
            },
            {
                id: 'JOB-003',
                title: 'Maintenance & Checkup',
                status: 'ASSIGNED',
                priority: 'MEDIUM',
                systemId: 'SYS-003',
                date: '2024-01-16',
                duration: '3 hrs',
                description: 'Quarterly maintenance and performance check'
            }
        ];

        this.assignedJobs = mockJobs;
        this.completedJobs = mockJobs.filter(j => j.status === 'COMPLETED').length;

        // Load performance metrics
        const mockPerformance = {
            thisMonth: {
                jobsCompleted: 18,
                customerSatisfaction: 98,
                onTimeCompletion: 96
            },
            thisYear: {
                totalJobs: 156,
                avgRating: 4.8,
                revenueGenerated: 1250000
            },
            skills: [
                { name: 'Residential Installation', certified: true },
                { name: 'Commercial Systems', certified: true },
                { name: 'Maintenance & Repair', certified: true },
                { name: 'Safety Management', certified: true }
            ]
        };

        this.performanceMetrics = mockPerformance;
        this.totalRevenue = mockPerformance.thisYear.revenueGenerated;
        this.customerRating = mockPerformance.thisYear.avgRating;

        // Load client sites
        const mockClients = [
            {
                id: 'CLIENT-001',
                name: 'Rajesh Kumar',
                systemType: 'Residential',
                location: 'Bangalore',
                capacity: 10,
                lastServiceDate: '2024-01-10',
                nextServiceDate: '2024-02-10',
                phone: '+91-9876543210'
            },
            {
                id: 'CLIENT-002',
                name: 'Tech Park Solutions',
                systemType: 'Commercial',
                location: 'Whitefield',
                capacity: 50,
                lastServiceDate: '2024-01-12',
                nextServiceDate: '2024-02-12',
                phone: '+91-8765432109'
            },
            {
                id: 'CLIENT-003',
                name: 'Manufacturing Co.',
                systemType: 'Industrial',
                location: 'Peenya',
                capacity: 100,
                lastServiceDate: '2024-01-08',
                nextServiceDate: '2024-02-08',
                phone: '+91-7654321098'
            }
        ];

        this.clientSites = mockClients;
        this.cdr.markForCheck();
    }

    setActiveTab(tab: 'schedule' | 'jobs' | 'performance' | 'clients'): void {
        this.activeTab = tab;
        this.cdr.markForCheck();
    }

    onStartJob(job: any): void {
        job.status = 'IN-PROGRESS';
        this.toastService.success(`✓ Job started: ${job.title} - Check-in recorded at ${new Date().toLocaleTimeString()}`, 4000);
        this.cdr.markForCheck();
    }

    onCompleteJob(job: any): void {
        job.status = 'COMPLETED';
        this.completedJobs += 1;
        this.toastService.success(`✓ Job completed: ${job.title} - Work order closed`, 4000);
        this.cdr.markForCheck();
    }

    onCallCustomer(customer: any): void {
        this.toastService.success(`Calling ${customer.name} at ${customer.phone}...`, 4000);
        // Trigger VoIP call
    }

    onNavigateToSite(site: any): void {
        this.toastService.info(`Opening Google Maps to ${site.location}...`, 3000);
        // Open navigation - window.open('https://maps.google.com...')
    }

    onUpdateJobStatus(job: any): void {
        this.toastService.success('Job status updated successfully', 4000);
        // Show update form modal
    }

    onDownloadJobDetails(job: any): void {
        this.toastService.success(`Downloaded job details for ${job.title} as PDF`, 4000);
        // Download PDF with work order details
    }

    onViewPerformanceReport(): void {
        this.toastService.info('Opening your performance analytics dashboard...', 4000);
        // Navigate to performance analytics
    }

    onRequestTraining(): void {
        this.toastService.success('Training request #TR001 submitted - Admin will review within 24 hours', 5000);
        // Submit training request to admin
    }
}
