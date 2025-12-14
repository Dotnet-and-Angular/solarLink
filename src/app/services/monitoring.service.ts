import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RealtimeData {
    siteId: number;
    currentProduction: number;
    totalProduction: number;
    systemHealth: number;
    timestamp: string;
}

export interface ProductionData {
    date: string;
    production: number;
    revenue: number;
}

export interface Inverter {
    id: number;
    siteId: number;
    name: string;
    status: string;
    production: number;
    efficiency: number;
    lastUpdated: string;
}

export interface Alert {
    id: number;
    siteId?: number;
    inverterId?: number;
    type: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    status: string;
    createdAt: string;
}

@Injectable({
    providedIn: 'root',
})
export class MonitoringService {
    private apiUrl = 'http://localhost:5011/api';

    constructor(private http: HttpClient) { }

    /**
     * Get realtime data for a site
     */
    getRealtimeData(siteId: number): Observable<RealtimeData> {
        return this.http.get<RealtimeData>(`${this.apiUrl}/sites/${siteId}/realtime`);
    }

    /**
     * Get production data (historical)
     */
    getProductionData(siteId: number): Observable<ProductionData[]> {
        return this.http.get<ProductionData[]>(`${this.apiUrl}/sites/${siteId}/production`);
    }

    /**
     * Get history data with date range
     */
    getHistoryData(siteId: number, startDate: string, endDate: string): Observable<any> {
        return this.http.get<any>(
            `${this.apiUrl}/sites/${siteId}/history?start_date=${startDate}&end_date=${endDate}`
        );
    }

    /**
     * Get all inverters
     */
    getAllInverters(): Observable<Inverter[]> {
        return this.http.get<Inverter[]>(`${this.apiUrl}/inverters`);
    }

    /**
     * Get inverter alerts
     */
    getInverterAlerts(inverterId: number): Observable<Alert[]> {
        return this.http.get<Alert[]>(`${this.apiUrl}/inverters/${inverterId}/alerts`);
    }

    /**
     * Get site alerts
     */
    getSiteAlerts(siteId: number): Observable<Alert[]> {
        return this.http.get<Alert[]>(`${this.apiUrl}/sites/${siteId}/alerts`);
    }
}
