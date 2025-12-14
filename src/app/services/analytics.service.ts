import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Analytics & Reports API Service
 * Aggregates performance data, efficiency metrics, and generates reports
 * Available to: Technician (assigned), Installer (managed), Admin (all)
 */
@Injectable({
  providedIn: 'root',
})
export class AnalyticsService {
  private analyticsSubject = new BehaviorSubject<any>(null);
  public analytics$ = this.analyticsSubject.asObservable();

  constructor() { }

  /**
   * GET /api/analytics/portfolio-overview
   * High-level portfolio metrics and KPIs
   */
  getPortfolioOverview(): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({
          total_systems: 42,
          total_capacity: 215.5, // kW
          total_installed_value: 12750000, // ₹
          ytd_generation: 352500, // kWh
          ytd_savings: 2643750, // ₹
          average_system_age: 2.3, // years
          systems_by_status: {
            online: 40,
            offline: 1,
            maintenance: 1,
          },
          key_metrics: {
            average_prr: 0.295, // Performance Ratio
            average_efficiency: 93.8,
            average_uptime: 99.2,
            average_daily_production: 967.3, // kWh
          },
          comparison_to_last_year: {
            generation_growth: 12.5, // %
            efficiency_improvement: 2.1, // %
          },
        });
        observer.complete();
      }, 300);
    });
  }

  /**
   * GET /api/analytics/system-performance-ranking
   * Rank systems by performance metrics (efficiency, uptime, ROI)
   */
  getSystemRanking(rankBy: 'efficiency' | 'uptime' | 'roi' | 'generation'): Observable<any[]> {
    return new Observable((observer) => {
      setTimeout(() => {
        const systems = [
          { system_id: 1, name: 'Raju Farms - System 1', efficiency: 95.2, uptime: 99.8, roi: 18.5, monthly_generation: 650 },
          { system_id: 2, name: 'TechPark - System 1', efficiency: 92.1, uptime: 98.5, roi: 16.2, monthly_generation: 1850 },
          { system_id: 3, name: 'Raju Farms - System 2', efficiency: 90.5, uptime: 97.2, roi: 15.8, monthly_generation: 620 },
          { system_id: 4, name: 'Factory Complex', efficiency: 88.9, uptime: 99.1, roi: 14.5, monthly_generation: 2100 },
          { system_id: 5, name: 'Retail Store', efficiency: 85.3, uptime: 96.8, roi: 12.1, monthly_generation: 450 },
        ];

        let ranked = [...systems];
        if (rankBy === 'efficiency') {
          ranked.sort((a, b) => b.efficiency - a.efficiency);
        } else if (rankBy === 'uptime') {
          ranked.sort((a, b) => b.uptime - a.uptime);
        } else if (rankBy === 'roi') {
          ranked.sort((a, b) => b.roi - a.roi);
        } else if (rankBy === 'generation') {
          ranked.sort((a, b) => b.monthly_generation - a.monthly_generation);
        }

        ranked = ranked.map((sys, index) => ({ ...sys, rank: index + 1 }));
        observer.next(ranked);
        observer.complete();
      }, 300);
    });
  }

  /**
   * GET /api/analytics/sites/:siteId/performance
   * Detailed performance metrics for a specific site
   */
  getSitePerformance(siteId: string): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({
          siteId,
          capacity: 5.5, // kW
          location: 'Piler',
          installation_date: '2022-01-15',
          age_months: 24,
          system_efficiency: {
            current: 94.5,
            target: 95.0,
            deviation: -0.5,
          },
          performance_ratio: {
            current: 0.299,
            target: 0.3,
            deviation: -0.001,
          },
          uptime: {
            last_month: 99.8,
            last_quarter: 99.5,
            lifetime: 99.2,
          },
          fault_history: {
            total_faults: 2,
            resolved: 2,
            pending: 0,
            average_resolution_days: 1.5,
          },
          generation_trend: [
            { month: 'Nov', generation: 380, target: 385 },
            { month: 'Dec', generation: 420, target: 425 },
            { month: 'Jan', generation: 395, target: 400 },
            { month: 'Feb', generation: 410, target: 415 },
            { month: 'Mar', generation: 520, target: 525 },
            { month: 'Apr', generation: 560, target: 565 },
          ],
          seasonal_adjustment: {
            summer_avg: 545,
            monsoon_avg: 380,
            winter_avg: 410,
          },
        });
        observer.complete();
      }, 300);
    });
  }

  /**
   * GET /api/analytics/reports/installation-efficiency
   * Installation quality report: efficiency metrics by installer
   */
  getInstallationEfficiencyReport(): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({
          report_type: 'Installation Efficiency',
          period: 'Last 12 months',
          installers: [
            {
              installer_id: 1,
              name: 'Sunlight Installations',
              systems_installed: 15,
              average_efficiency: 94.2,
              average_uptime: 99.1,
              customer_satisfaction: 4.8,
              defect_rate: 0.02,
              average_installation_time: 2.3,
            },
            {
              installer_id: 2,
              name: 'GreenEnergy Solutions',
              systems_installed: 12,
              average_efficiency: 93.5,
              average_uptime: 98.9,
              customer_satisfaction: 4.6,
              defect_rate: 0.04,
              average_installation_time: 2.5,
            },
            {
              installer_id: 3,
              name: 'Solar Experts',
              systems_installed: 8,
              average_efficiency: 92.8,
              average_uptime: 99.3,
              customer_satisfaction: 4.9,
              defect_rate: 0.01,
              average_installation_time: 2.1,
            },
          ],
          recommendations: [
            'GreenEnergy Solutions should review installation procedures (high defect rate)',
            'Solar Experts showing excellent customer satisfaction - consider for premium projects',
          ],
        });
        observer.complete();
      }, 300);
    });
  }

  /**
   * GET /api/analytics/reports/energy-production
   * Aggregated energy production report with comparisons
   */
  getEnergyProductionReport(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        const data = this.generateProductionData(period);
        observer.next({
          report_type: 'Energy Production',
          period,
          total_systems: 42,
          total_generation: data.total,
          average_per_system: Math.round(data.total / 42),
          peak_generation: data.peak,
          peak_time: '12:30 PM',
          low_generation: data.low,
          low_time: '6:00 AM',
          efficiency_index: 94.2,
          data_points: data.points,
          comparison_to_forecast: { actual: data.total, forecasted: data.total * 0.98, variance: '2%' },
        });
        observer.complete();
      }, 300);
    });
  }

  /**
   * GET /api/analytics/reports/fault-analysis
   * Fault occurrence and resolution metrics
   */
  getFaultAnalysisReport(): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({
          report_type: 'Fault Analysis',
          period: 'Last 6 months',
          total_faults: 12,
          resolved_faults: 11,
          pending_faults: 1,
          fault_types: [
            { type: 'String Disconnected', count: 4, avg_resolution_hours: 8 },
            { type: 'Inverter Error', count: 3, avg_resolution_hours: 24 },
            { type: 'DC Isolator Trip', count: 2, avg_resolution_hours: 4 },
            { type: 'Meter Communication Loss', count: 2, avg_resolution_hours: 2 },
            { type: 'Array Tracking Issue', count: 1, avg_resolution_hours: 48 },
          ],
          most_affected_system: 'Factory Complex',
          fault_impact: { total_lost_generation: 145, unit: 'kWh' },
          mttr: 15.3, // Mean Time To Repair (hours)
          mttf: 240, // Mean Time To Failure (hours)
          preventive_measures: [
            'Increase monitoring frequency for Factory Complex system',
            'Schedule preventive maintenance for 3 systems showing string issues',
          ],
        });
        observer.complete();
      }, 300);
    });
  }

  /**
   * GET /api/analytics/reports/customer-segment-analysis
   * Performance and ROI metrics segmented by customer type
   */
  getCustomerSegmentAnalysis(): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({
          report_type: 'Customer Segment Analysis',
          segments: [
            {
              segment: 'Residential',
              systems_count: 18,
              avg_capacity: 5.2,
              avg_efficiency: 93.8,
              avg_roi_percentage: 17.2,
              avg_payback_years: 5.8,
              customer_satisfaction: 4.7,
            },
            {
              segment: 'Commercial',
              systems_count: 15,
              avg_capacity: 12.3,
              avg_efficiency: 94.5,
              avg_roi_percentage: 18.9,
              avg_payback_years: 5.3,
              customer_satisfaction: 4.8,
            },
            {
              segment: 'Industrial',
              systems_count: 9,
              avg_capacity: 28.5,
              avg_efficiency: 95.1,
              avg_roi_percentage: 19.5,
              avg_payback_years: 5.1,
              customer_satisfaction: 4.9,
            },
          ],
          insights: [
            'Industrial segment showing highest efficiency and best ROI',
            'Residential segment requires additional support for optimization',
            'Commercial segment shows strong growth potential',
          ],
        });
        observer.complete();
      }, 300);
    });
  }

  /**
   * POST /api/analytics/export-report
   * Export report in various formats
   */
  exportReport(reportType: string, format: 'pdf' | 'xlsx' | 'csv'): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        const filename = `${reportType}_${new Date().toISOString().split('T')[0]}.${format}`;
        observer.next({
          download_url: `/reports/${filename}`,
          filename,
          generated_at: new Date(),
          format,
        });
        observer.complete();
      }, 300);
    });
  }

  /**
   * Helper method to generate production data
   */
  private generateProductionData(period: string) {
    if (period === 'daily') {
      return {
        total: 28450,
        peak: 3200,
        low: 150,
        points: Array.from({ length: 24 }, (_, i) => ({
          time: `${i}:00`,
          generation: Math.max(150, 1500 * Math.sin((i - 6) * Math.PI / 12) + 1500),
        })),
      };
    }
    return {
      total: 352500,
      peak: 28450,
      low: 12500,
      points: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        generation: 11000 + Math.random() * 5000,
      })),
    };
  }
}
