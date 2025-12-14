import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { SolarSystem } from '../models/solar-system.model';

/**
 * System Monitoring API Service
 * Handles inverter monitoring and system status
 * Available to: Technician, Installer, Admin
 */
@Injectable({
  providedIn: 'root',
})
export class SystemMonitoringService {
  private invertersSubject = new BehaviorSubject<any[]>([]);
  public inverters$ = this.invertersSubject.asObservable();

  private mockInverters: any[] = [
    {
      id: '1',
      serial_no: 'INV001',
      model: 'Fronius Primo 8.0',
      manufacturer: 'Fronius',
      status: 'ONLINE',
      site_id: '1',
      power_output: 7.5,
      efficiency: 97.2,
      lastHealthCheck: new Date(),
    },
    {
      id: '2',
      serial_no: 'INV002',
      model: 'SolarEdge SE8000',
      manufacturer: 'SolarEdge',
      status: 'OFFLINE',
      site_id: '2',
      power_output: 0,
      efficiency: 0,
      lastHealthCheck: new Date('2025-12-12T15:00:00'),
    },
  ];

  constructor() {
    this.invertersSubject.next(this.mockInverters);
  }

  /**
   * GET /api/inverters
   * Fetch all inverters for monitoring grid (admin dashboard)
   */
  getInverters(): Observable<any[]> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next(this.mockInverters);
        observer.complete();
      }, 300);
    });
  }

  /**
   * GET /api/inverters?site_id=X
   * Fetch inverters for a specific site
   */
  getInvertersBySite(siteId: string): Observable<any[]> {
    return new Observable((observer) => {
      setTimeout(() => {
        const siteInverters = this.mockInverters.filter((inv) => inv.site_id === siteId);
        observer.next(siteInverters);
        observer.complete();
      }, 300);
    });
  }

  /**
   * GET /api/inverters/:serialNo
   * Get detailed inverter information
   */
  getInverterDetail(serialNo: string): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        const inverter = this.mockInverters.find((inv) => inv.serial_no === serialNo);
        if (inverter) {
          observer.next({
            ...inverter,
            dc_voltage: 485.3,
            dc_current: 15.8,
            ac_voltage: 230,
            ac_frequency: 50,
            temperature: 38.2,
            events: [],
          });
        }
        observer.complete();
      }, 300);
    });
  }

  /**
   * Monitor inverter health status
   */
  monitorInverterHealth(invertersNoList: string[]): Observable<any> {
    return new Observable((observer) => {
      const interval = setInterval(() => {
        const statusUpdate = invertersNoList.map((serialNo) => ({
          serial_no: serialNo,
          status: Math.random() > 0.2 ? 'ONLINE' : 'OFFLINE',
          timestamp: new Date(),
          errorCode: null,
        }));
        observer.next(statusUpdate);
      }, 5000);

      return () => clearInterval(interval);
    });
  }

  /**
   * Register inverter with platform
   */
  registerInverter(inverterData: any): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        const newInverter = { ...inverterData, id: Math.random().toString(36).substr(2, 9) };
        this.mockInverters.push(newInverter);
        this.invertersSubject.next([...this.mockInverters]);
        observer.next(newInverter);
        observer.complete();
      }, 300);
    });
  }
}
