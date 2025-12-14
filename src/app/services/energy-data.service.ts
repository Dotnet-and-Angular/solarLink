import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DailyKPI, EnergyDataPoint, SolarSystem, PerformanceMetrics } from '../models/solar-system.model';

/**
 * Energy Data API Service
 * Handles real-time power flow and production data
 * Available to: Customer, Technician, Installer, Admin
 */
@Injectable({
  providedIn: 'root',
})
export class EnergyDataService {
  private realtimeDataSubject = new BehaviorSubject<{
    powerKw: number;
    consumptionKw: number;
    timestamp: Date;
  } | null>(null);

  public realtimeData$ = this.realtimeDataSubject.asObservable();

  constructor() {
    this.startRealtimeSimulation();
  }

  /**
   * GET /api/sites/:siteId/realtime
   * Fetch real-time power flow visualization data
   */
  getRealtimeData(siteId: string): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({
          powerKw: Math.random() * 5,
          consumptionKw: Math.random() * 3,
          timestamp: new Date(),
          siteId,
        });
        observer.complete();
      }, 300);
    });
  }

  /**
   * GET /api/sites/:siteId/production
   * Fetch historical production data for charts
   */
  getProductionHistory(siteId: string, period: 'day' | 'month' | 'year'): Observable<EnergyDataPoint[]> {
    return new Observable((observer) => {
      setTimeout(() => {
        const data = this.generateProductionData(period);
        observer.next(data);
        observer.complete();
      }, 300);
    });
  }

  /**
   * GET /api/sites/:siteId/alerts
   * Fetch system alerts and faults
   */
  getAlerts(siteId: string): Observable<any[]> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next([
          {
            code: 404,
            message: 'Grid power lost',
            severity: 'HIGH',
            timestamp: new Date(),
          },
        ]);
        observer.complete();
      }, 300);
    });
  }

  private generateProductionData(period: 'day' | 'month' | 'year'): EnergyDataPoint[] {
    const data: EnergyDataPoint[] = [];
    const now = new Date();
    let intervals = 24; // hourly for day

    if (period === 'month') intervals = 30;
    if (period === 'year') intervals = 12;

    for (let i = 0; i < intervals; i++) {
      const date = new Date(now);
      if (period === 'day') date.setHours(date.getHours() - intervals + i);
      if (period === 'month') date.setDate(date.getDate() - intervals + i);
      if (period === 'year') date.setMonth(date.getMonth() - intervals + i);

      data.push({
        timestamp: date,
        generatedKwh: Math.random() * 20 + 10,
        consumedKwh: Math.random() * 10 + 5,
        temperature: 25 + Math.random() * 10,
        irradiance: Math.random() * 800,
      });
    }

    return data;
  }

  private startRealtimeSimulation(): void {
    setInterval(() => {
      this.realtimeDataSubject.next({
        powerKw: Math.random() * 5,
        consumptionKw: Math.random() * 3,
        timestamp: new Date(),
      });
    }, 5000);
  }
}
