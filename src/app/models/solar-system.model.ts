/* Solar System Models and Interfaces */

// System Status Type
export type SystemStatus = 'online' | 'offline' | 'warning' | 'maintenance';
export type TicketPriority = 'critical' | 'high' | 'medium' | 'low';
export type TicketStatus = 'new' | 'assigned' | 'on-site' | 'resolved' | 'closed';
export type UserRole = 'customer' | 'installer' | 'admin' | 'technician';

// ============================================
// DASHBOARD KPI MODELS
// ============================================

export interface DailyKPI {
    generatedKwh: number;
    consumedKwh: number;
    savingsINR: number;
    co2OffsetKg: number;
    systemEfficiency: number;
    peakGenerationTime: string;
    lastUpdated: Date;
}

export interface EnergyDataPoint {
    timestamp: Date;
    generatedKwh: number;
    consumedKwh: number;
    temperature: number;
    irradiance: number;
}

export interface TimeSeriesData {
    label: string;
    data: EnergyDataPoint[];
}

// ============================================
// SYSTEM MODELS
// ============================================

export interface SolarSystem {
    id: string;
    name: string;
    customerId: string;
    location: string;
    capacity: number; // in kW
    installedDate: Date;
    status: SystemStatus;
    lastHealthCheck: Date;
    performanceMetrics: PerformanceMetrics;
    components: SystemComponent[];
    coordinates?: { latitude: number; longitude: number };
}

export interface PerformanceMetrics {
    currentOutput: number; // watts
    efficiency: number; // percentage
    uptime: number; // percentage
    predictedDailyGeneration: number; // kWh
    lastMaintenance: Date;
    nextScheduledMaintenance?: Date;
}

export interface SystemComponent {
    id: string;
    type: 'inverter' | 'panels' | 'battery' | 'controller' | 'monitor';
    serialNumber: string;
    manufacturer: string;
    model: string;
    status: SystemStatus;
    lastTested: Date;
    warrantyExpiry: Date;
}

// ============================================
// CUSTOMER MODELS
// ============================================

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    systems: SolarSystem[];
    totalCapacity: number; // kW
    subscriptionDate: Date;
    subscriptionPlan: 'basic' | 'pro' | 'enterprise';
    contactPreference: 'email' | 'sms' | 'call';
    isActive: boolean;
}

// ============================================
// SERVICE TICKET MODELS
// ============================================

export interface ServiceTicket {
    id: string;
    ticketNumber: string;
    customerId: string;
    systemId: string;
    title: string;
    description: string;
    priority: TicketPriority;
    status: TicketStatus;
    category: 'malfunction' | 'maintenance' | 'optimization' | 'inquiry';
    createdDate: Date;
    createdBy: string;
    assignedTo?: string;
    assignedDate?: Date;
    scheduledDate?: Date;
    visitDate?: Date;
    completedDate?: Date;
    resolution?: string;
    attachments?: Attachment[];
    estimatedResolutionTime: number; // hours
    actualResolutionTime?: number; // hours
    slaStatus: 'on-track' | 'at-risk' | 'breached';
}

export interface Attachment {
    id: string;
    filename: string;
    url: string;
    uploadedDate: Date;
    uploadedBy: string;
    type: 'image' | 'document' | 'video';
}

// ============================================
// TECHNICIAN/INSTALLER MODELS
// ============================================

export interface Technician {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: 'installer' | 'technician' | 'admin';
    specializations: string[];
    isAvailable: boolean;
    assignedTickets: string[];
    completedTickets: number;
    averageRating: number;
    certifications: Certification[];
}

export interface Certification {
    name: string;
    issueDate: Date;
    expiryDate: Date;
    certificateNumber: string;
}

// ============================================
// INVENTORY MODELS
// ============================================

export interface InventoryItem {
    id: string;
    name: string;
    category: 'inverter' | 'panels' | 'battery' | 'wiring' | 'other';
    manufacturer: string;
    model: string;
    serialNumber?: string;
    quantity: number;
    reorderLevel: number;
    unitCost: number;
    totalValue: number;
    location: string;
    addedDate: Date;
    lastUpdated: Date;
    specifications: Record<string, any>;
}

// ============================================
// ALERT/NOTIFICATION MODELS
// ============================================

export interface SystemAlert {
    id: string;
    systemId: string;
    type: 'error' | 'warning' | 'info' | 'success';
    severity: 'critical' | 'high' | 'medium' | 'low';
    title: string;
    message: string;
    timestamp: Date;
    isResolved: boolean;
    resolvedDate?: Date;
    actionRequired: boolean;
    suggestedAction?: string;
}

export interface Notification {
    id: string;
    userId: string;
    title: string;
    message: string;
    type: 'alert' | 'ticket' | 'maintenance' | 'achievement';
    read: boolean;
    timestamp: Date;
    actionUrl?: string;
}

// ============================================
// ANALYTICS & REPORT MODELS
// ============================================

export interface EnergyAnalytics {
    period: 'day' | 'week' | 'month' | 'year';
    totalGenerated: number;
    totalConsumed: number;
    peakHours: { time: string; value: number }[];
    averageEfficiency: number;
    costSavings: number;
    co2Offset: number;
    weatherImpact: {
        solarIrradiance: number[];
        temperature: number[];
        cloudCover: number[];
    };
}

export interface SystemHealthReport {
    systemId: string;
    generatedDate: Date;
    overallHealth: number; // 0-100
    componentHealth: { [key: string]: number };
    predictedIssues: PredictedIssue[];
    maintenanceRecommendations: string[];
    performanceTrend: 'improving' | 'stable' | 'declining';
}

export interface PredictedIssue {
    component: string;
    likelihood: number; // 0-100
    potentialImpact: string;
    suggestedAction: string;
    timeToFailure?: number; // days
}

// ============================================
// DASHBOARD STATE MODELS
// ============================================

export interface DashboardState {
    loading: boolean;
    error: string | null;
    selectedTimeRange: 'day' | 'week' | 'month' | 'year';
    systemFilter?: string;
    statusFilter?: SystemStatus[];
    lastRefreshTime: Date;
}

export interface CustomerDashboardState extends DashboardState {
    kpi: DailyKPI | null;
    energyData: EnergyDataPoint[];
    systemStatus: SystemStatus;
    recentAlerts: SystemAlert[];
    activeTickets: ServiceTicket[];
}

export interface AdminDashboardState extends DashboardState {
    totalSystems: number;
    activeSystems: number;
    systemsWithWarnings: number;
    offlineSystems: number;
    newTickets: ServiceTicket[];
    overdueTickets: ServiceTicket[];
    technicians: Technician[];
    inventory: InventoryItem[];
}

// ============================================
// API RESPONSE MODELS
// ============================================

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
    timestamp: Date;
}

export interface PaginatedResponse<T> {
    items: T[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

export interface FilterCriteria {
    page: number;
    pageSize: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    filters?: Record<string, any>;
}
