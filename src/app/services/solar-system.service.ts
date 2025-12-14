import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
    DailyKPI,
    EnergyDataPoint,
    SystemStatus,
    SolarSystem,
    PerformanceMetrics,
} from '../models/solar-system.model';

@Injectable({
    providedIn: 'root',
})
export class SolarSystemService {
    private readonly dailyKPISubject = new BehaviorSubject<DailyKPI | null>(null);
    private readonly energyDataSubject = new BehaviorSubject<EnergyDataPoint[]>([]);
    private readonly systemStatusSubject = new BehaviorSubject<SystemStatus>('online');
    private readonly systemsSubject = new BehaviorSubject<SolarSystem[]>([]);

    public dailyKPI$ = this.dailyKPISubject.asObservable();
    public energyData$ = this.energyDataSubject.asObservable();
    public systemStatus$ = this.systemStatusSubject.asObservable();
    public systems$ = this.systemsSubject.asObservable();

    constructor() {
        this.initializeMockData();
    }

    private initializeMockData(): void {
        // Initialize with mock data
        const mockKPI: DailyKPI = {
            generatedKwh: 42.5,
            consumedKwh: 28.3,
            savingsINR: 3825,
            co2OffsetKg: 38.75,
            systemEfficiency: 94.2,
            peakGenerationTime: '12:30 PM',
            lastUpdated: new Date(),
        };

        const mockEnergyData = this.generateMockEnergyData();
        const mockSystems = this.generateMockSystems();

        this.dailyKPISubject.next(mockKPI);
        this.energyDataSubject.next(mockEnergyData);
        this.systemsSubject.next(mockSystems);
    }

    private generateMockEnergyData(): EnergyDataPoint[] {
        const data: EnergyDataPoint[] = [];
        const now = new Date();

        for (let i = 24; i >= 0; i--) {
            const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
            const hour = timestamp.getHours();

            // Simulate realistic solar generation curve
            let generatedKwh = 0;
            if (hour >= 6 && hour <= 18) {
                const peakHour = 12;
                const deviation = Math.abs(hour - peakHour);
                generatedKwh = Math.max(0, 50 * Math.cos((deviation * Math.PI) / 6));
            }

            data.push({
                timestamp,
                generatedKwh: parseFloat(generatedKwh.toFixed(2)),
                consumedKwh: parseFloat((Math.random() * 3 + 1).toFixed(2)),
                temperature: 25 + Math.sin((hour / 24) * Math.PI) * 15,
                irradiance: Math.max(0, 900 * Math.cos((Math.abs(hour - 12) * Math.PI) / 12)),
            });
        }

        return data;
    }

    private generateMockSystems(): SolarSystem[] {
        return [
            {
                id: 'sys-001',
                name: 'Residential - Pune',
                customerId: 'cust-001',
                location: 'Pune, Maharashtra',
                capacity: 5,
                installedDate: new Date('2023-01-15'),
                status: 'online',
                lastHealthCheck: new Date(),
                performanceMetrics: {
                    currentOutput: 4250,
                    efficiency: 94.2,
                    uptime: 99.8,
                    predictedDailyGeneration: 42.5,
                    lastMaintenance: new Date('2024-11-01'),
                    nextScheduledMaintenance: new Date('2025-02-01'),
                },
                components: [],
            },
            {
                id: 'sys-002',
                name: 'Commercial - Mumbai',
                customerId: 'cust-002',
                location: 'Mumbai, Maharashtra',
                capacity: 15,
                installedDate: new Date('2022-06-20'),
                status: 'online',
                lastHealthCheck: new Date(),
                performanceMetrics: {
                    currentOutput: 12800,
                    efficiency: 92.5,
                    uptime: 98.9,
                    predictedDailyGeneration: 125.4,
                    lastMaintenance: new Date('2024-10-15'),
                    nextScheduledMaintenance: new Date('2025-01-15'),
                },
                components: [],
            },
        ];
    }

    public getSystemById(systemId: string): Observable<SolarSystem | undefined> {
        return new Observable((observer) => {
            const systems = this.systemsSubject.value;
            observer.next(systems.find((s) => s.id === systemId));
            observer.complete();
        });
    }

    public updateSystemStatus(systemId: string, status: SystemStatus): void {
        const systems = this.systemsSubject.value.map((s) =>
            s.id === systemId ? { ...s, status } : s
        );
        this.systemsSubject.next(systems);
    }

    public getEnergyDataForRange(startDate: Date, endDate: Date): Observable<EnergyDataPoint[]> {
        return new Observable((observer) => {
            const data = this.energyDataSubject.value.filter(
                (point) => point.timestamp >= startDate && point.timestamp <= endDate
            );
            observer.next(data);
            observer.complete();
        });
    }

    public refreshDailyKPI(): Observable<DailyKPI> {
        return new Observable((observer) => {
            const mockKPI: DailyKPI = {
                generatedKwh: 42.5 + Math.random() * 5,
                consumedKwh: 28.3 + Math.random() * 3,
                savingsINR: Math.random() * 500 + 3825,
                co2OffsetKg: 38.75 + Math.random() * 3,
                systemEfficiency: 94.2 + (Math.random() - 0.5) * 2,
                peakGenerationTime: '12:30 PM',
                lastUpdated: new Date(),
            };
            this.dailyKPISubject.next(mockKPI);
            observer.next(mockKPI);
            observer.complete();
        });
    }

    public getCurrentSystemStatus(): SystemStatus {
        return this.systemStatusSubject.value;
    }

    public getSystemsCount(): {
        total: number;
        active: number;
        warning: number;
        offline: number;
    } {
        const systems = this.systemsSubject.value;
        return {
            total: systems.length,
            active: systems.filter((s) => s.status === 'online').length,
            warning: systems.filter((s) => s.status === 'warning').length,
            offline: systems.filter((s) => s.status === 'offline').length,
        };
    }
}
