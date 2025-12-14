import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ServiceOperationsService } from '../../../services/service-operations.service';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-installer-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './installer-dashboard.component.html',
  styleUrls: ['./installer-dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InstallerDashboardComponent implements OnInit, OnDestroy {
  activeTab: 'projects' | 'team' | 'inventory' | 'analytics' | 'documents' = 'projects';

  activeProjects: any[] = [];
  teamMembers: any[] = [];
  inventoryItems: any[] = [];
  analyticsData: any = null;
  documents: any[] = [];

  projectStats = {
    active: 0,
    completed: 0,
    totalRevenue: 0,
    completionRate: 0
  };

  private destroy$ = new Subject<void>();

  constructor(
    private serviceOpsService: ServiceOperationsService,
    private toastService: ToastService,
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
    // Load active projects
    const mockProjects = [
      {
        id: 'PROJ-001',
        name: 'Residential Solar Installation - Villa Heights',
        location: 'Bangalore, Karnataka',
        capacity: 10,
        progress: 75,
        status: 'IN_PROGRESS',
        startDate: '2024-01-15',
        endDate: '2024-02-15',
        budget: 500000,
        spent: 375000,
        teamLead: 'Rajesh Kumar',
        installationDays: 8,
        daysRemaining: 2
      },
      {
        id: 'PROJ-002',
        name: 'Commercial Solar Installation - Tech Park',
        location: 'Pune, Maharashtra',
        capacity: 50,
        progress: 45,
        status: 'IN_PROGRESS',
        startDate: '2024-01-20',
        endDate: '2024-03-20',
        budget: 2500000,
        spent: 1125000,
        teamLead: 'Priya Sharma',
        installationDays: 30,
        daysRemaining: 16
      },
      {
        id: 'PROJ-003',
        name: 'Industrial Solar Installation - Manufacturing Unit',
        location: 'Hyderabad, Telangana',
        capacity: 100,
        progress: 30,
        status: 'PENDING',
        startDate: '2024-02-01',
        endDate: '2024-04-01',
        budget: 5000000,
        spent: 0,
        teamLead: 'Unassigned',
        installationDays: 45,
        daysRemaining: 45
      }
    ];

    this.activeProjects = mockProjects;
    this.projectStats = {
      active: mockProjects.filter(p => p.status === 'IN_PROGRESS').length,
      completed: 0,
      totalRevenue: 8000000,
      completionRate: 50
    };

    // Load team members
    const mockTeam = [
      {
        id: 'TECH-001',
        name: 'Rajesh Kumar',
        role: 'Team Lead',
        assignedProjects: 1,
        currentWorkload: 85,
        certification: 'Level 1 & 2',
        projectsCompleted: 15,
        rating: 4.8
      },
      {
        id: 'TECH-002',
        name: 'Priya Sharma',
        role: 'Senior Installer',
        assignedProjects: 1,
        currentWorkload: 75,
        certification: 'Level 1 & 2',
        projectsCompleted: 12,
        rating: 4.7
      },
      {
        id: 'TECH-003',
        name: 'Akshay Singh',
        role: 'Installer',
        assignedProjects: 0,
        currentWorkload: 20,
        certification: 'Level 1',
        projectsCompleted: 8,
        rating: 4.5
      },
      {
        id: 'TECH-004',
        name: 'Deepak Patel',
        role: 'Junior Installer',
        assignedProjects: 0,
        currentWorkload: 30,
        certification: 'Level 1',
        projectsCompleted: 3,
        rating: 4.3
      }
    ];

    this.teamMembers = mockTeam;

    // Load inventory items
    const mockInventory = [
      { id: 'INV-001', name: 'Solar Panels (500W)', quantity: 250, reorderPoint: 50, unit: 'pcs', status: 'ADEQUATE' },
      { id: 'INV-002', name: 'Inverter (5kW)', quantity: 35, reorderPoint: 20, unit: 'pcs', status: 'LOW' },
      { id: 'INV-003', name: 'Mounting Structure', quantity: 500, reorderPoint: 100, unit: 'sets', status: 'ADEQUATE' },
      { id: 'INV-004', name: 'DC Cables (6mm)', quantity: 10, reorderPoint: 50, unit: 'rolls', status: 'LOW' },
      { id: 'INV-005', name: 'AC Breakers', quantity: 150, reorderPoint: 30, unit: 'pcs', status: 'ADEQUATE' }
    ];

    this.inventoryItems = mockInventory;

    // Load analytics
    const mockAnalytics = {
      thisMonth: {
        projectsStarted: 2,
        projectsCompleted: 1,
        systemsInstalled: 3,
        panelsInstalled: 650,
        revenue: 1200000,
        efficiency: 92
      },
      thisYear: {
        projectsCompleted: 8,
        systemsInstalled: 18,
        panelsInstalled: 4500,
        totalRevenue: 8000000,
        avgEfficiency: 95,
        teamUtilization: 78
      }
    };

    this.analyticsData = mockAnalytics;

    // Load documents
    const mockDocuments = [
      { id: 'DOC-001', name: 'Project PROJ-001 Blueprint', type: 'PDF', size: '2.5 MB', uploadDate: '2024-01-15', status: 'APPROVED' },
      { id: 'DOC-002', name: 'Safety Compliance Checklist', type: 'PDF', size: '1.2 MB', uploadDate: '2024-01-10', status: 'APPROVED' },
      { id: 'DOC-003', name: 'Team Training Manual - 2024', type: 'PDF', size: '5.8 MB', uploadDate: '2024-01-05', status: 'APPROVED' },
      { id: 'DOC-004', name: 'Equipment Warranty Documents', type: 'ZIP', size: '8.3 MB', uploadDate: '2023-12-20', status: 'PENDING' }
    ];

    this.documents = mockDocuments;
    this.cdr.markForCheck();
  }

  setActiveTab(tab: 'projects' | 'team' | 'inventory' | 'analytics' | 'documents'): void {
    this.activeTab = tab;
    this.cdr.markForCheck();
  }

  onViewProjectDetails(project: any): void {
    this.toastService.info(`Opening project details for ${project.id} - ${project.name}`, 4000);
  }

  onStartProject(project: any): void {
    project.status = 'IN_PROGRESS';
    this.projectStats.active += 1;
    this.toastService.success(`✓ Project ${project.id} started - Team assigned: ${project.teamLead}`, 5000);
    this.cdr.markForCheck();
  }

  onCompleteProject(project: any): void {
    project.status = 'COMPLETED';
    project.progress = 100;
    this.projectStats.completed += 1;
    this.projectStats.active -= 1;
    this.toastService.success(`✓ Project ${project.id} marked as completed - Final inspection done`, 5000);
    this.cdr.markForCheck();
  }

  onAssignTeam(project: any): void {
    this.toastService.success(`Team assignment panel opened for ${project.id}`, 4000);
  }

  onDownloadProjectDoc(project: any): void {
    this.toastService.success(`Project documents (${project.id}) downloaded as ZIP - 12 files`, 5000);
  }

  onAssignTechnician(technician: any): void {
    this.toastService.success(`${technician.name} has been assigned to PROJ-003`, 4000);
    technician.assignedProjects += 1;
    this.cdr.markForCheck();
  }

  onViewTechnicianDetails(technician: any): void {
    this.toastService.info(`Opening profile for ${technician.name} (${technician.role})`, 4000);
  }

  onScheduleTraining(technician: any): void {
    this.toastService.success(`Training scheduled for ${technician.name} - Confirmation sent via email`, 5000);
  }

  onUpdateWorkload(technician: any): void {
    this.toastService.success(`Workload updated for ${technician.name}: ${technician.currentWorkload}% utilized`, 4000);
  }

  onReorderInventory(item: any): void {
    this.toastService.success(`Reorder request #PO${Math.floor(Math.random() * 10000)} created for ${item.name} - 100 units`, 5000);
    item.quantity += 100;
    item.status = 'ADEQUATE';
    this.cdr.markForCheck();
  }

  onCheckInventory(item: any): void {
    this.toastService.success(`Physical stock count for ${item.name} scheduled - Completion in 2 hours`, 4000);
  }

  onViewAnalyticsReport(): void {
    this.toastService.info('Loading detailed analytics dashboard...', 4000);
  }

  onExportAnalytics(): void {
    this.toastService.success(`Analytics report exported as PDF - This Month & This Year data`, 5000);
  }

  onDownloadDocument(doc: any): void {
    this.toastService.success(`Downloaded ${doc.name} (${doc.size}) to Downloads folder`, 4000);
  }

  onApproveDocument(doc: any): void {
    doc.status = 'APPROVED';
    this.toastService.success(`Document ${doc.id} approved by Admin - Notification sent`, 4000);
    this.cdr.markForCheck();
  }

  onUploadDocument(): void {
    this.toastService.info('Document upload dialog opened - Supported formats: PDF, XLS, DOC', 4000);
  }
}
