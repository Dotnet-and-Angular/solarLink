import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Financial & Savings API Service
 * Calculates savings, ROI, and financial metrics
 * Available to: Customer (own), Technician (assigned), Installer (managed), Admin (all)
 */
@Injectable({
  providedIn: 'root',
})
export class FinancialService {
  private savingsSubject = new BehaviorSubject<any[]>([]);
  public savings$ = this.savingsSubject.asObservable();

  constructor() { }

  /**
   * GET /api/sites/:siteId/savings
   * Calculate estimated bill savings based on production
   */
  getEstimatedSavings(siteId: string, yearlyConsumption: number): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        // Simulated calculation: Average 4.5 kWh per day from 5.5 kW system
        const dailyProduction = 4.5;
        const yearlyProduction = dailyProduction * 365;
        const gridRate = 7.5; // ₹/kWh average rate

        const estimatedBillReduction = yearlyProduction * gridRate;
        const monthlyAverage = estimatedBillReduction / 12;

        observer.next({
          siteId,
          yearlyProduction,
          dailyAverage: dailyProduction,
          gridRate,
          estimatedAnnualSavings: estimatedBillReduction,
          estimatedMonthlySavings: monthlyAverage,
          paybackPeriodMonths: (275000 / monthlyAverage) * 12,
          roi_percentage: ((estimatedBillReduction * 25) / 275000) * 100,
          currency: 'INR',
        });
        observer.complete();
      }, 300);
    });
  }

  /**
   * GET /api/customers/:customerId/bill-history
   * Fetch customer's bill history before and after solar installation
   */
  getBillHistory(customerId: string): Observable<any[]> {
    return new Observable((observer) => {
      setTimeout(() => {
        const billHistory = [
          {
            month: 'Jan 2024',
            beforeSolar: 4500,
            afterSolar: 2100,
            savings: 2400,
            grid_units: 280,
          },
          {
            month: 'Feb 2024',
            beforeSolar: 4800,
            afterSolar: 2400,
            savings: 2400,
            grid_units: 320,
          },
          {
            month: 'Mar 2024',
            beforeSolar: 5200,
            afterSolar: 1800,
            savings: 3400,
            grid_units: 240,
          },
          {
            month: 'Apr 2024',
            beforeSolar: 5500,
            afterSolar: 1500,
            savings: 4000,
            grid_units: 200,
          },
          {
            month: 'May 2024',
            beforeSolar: 6200,
            afterSolar: 2100,
            savings: 4100,
            grid_units: 280,
          },
        ];
        observer.next(billHistory);
        observer.complete();
      }, 300);
    });
  }

  /**
   * GET /api/sites/:siteId/financial-summary
   * Comprehensive financial metrics: investment, payback, lifetime earnings
   */
  getFinancialSummary(siteId: string): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({
          siteId,
          investment: {
            systemCost: 275000,
            installationCost: 25000,
            permits: 2000,
            totalInvestment: 302000,
            currency: 'INR',
          },
          performance: {
            yearlyProduction: 1642.5, // kWh
            systemCapacity: 5.5, // kW
            prr: 0.299, // Performance Ratio
            efficiency: 94.5,
          },
          financial: {
            gridRate: 7.5, // ₹/kWh
            annualSavings: 12318,
            monthlySavings: 1026.5,
            paybackYears: 24.5,
            paybackMonths: 294,
            roi_25_years: 1024.5, // ₹
            roi_percentage: 338.7,
          },
          comparison: {
            vs_grid: { savings_per_month: 1026, units_offset: 219 },
            vs_diesel: { savings_per_month: 3500, units_offset: 467 },
          },
          carbonOffset: {
            annual_ton_co2: 2.1,
            equiv_trees: 35,
            equiv_cars_off_road_days: 12,
          },
        });
        observer.complete();
      }, 300);
    });
  }

  /**
   * POST /api/financial-projections
   * Generate long-term financial projections (5, 10, 25 years)
   */
  getProjections(siteId: string, systemCapacity: number, investment: number): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        const yearlyProduction = 300 * systemCapacity; // kWh/kW/year baseline
        const gridRate = 7.5;
        const annualSavings = yearlyProduction * gridRate;
        const escalation = 0.05; // 5% yearly escalation

        const projections = [];
        for (let year = 1; year <= 25; year++) {
          const inflated_savings = annualSavings * Math.pow(1 + escalation, year - 1);
          const cumulative = (inflated_savings * (Math.pow(1 + escalation, year) - 1)) / escalation - investment;
          projections.push({
            year,
            annual_savings: Math.round(inflated_savings),
            cumulative_savings: Math.round(Math.max(cumulative, 0)),
            payback_achieved: cumulative >= 0,
          });
        }

        observer.next({
          siteId,
          systemCapacity,
          investment,
          baseline_yearly_production: yearlyProduction,
          grid_rate: gridRate,
          escalation_rate: escalation * 100 + '%',
          projections,
        });
        observer.complete();
      }, 300);
    });
  }

  /**
   * GET /api/warranty/:siteId
   * Warranty and service coverage information
   */
  getWarrantyInfo(siteId: string): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({
          siteId,
          moduleWarranty: {
            duration_years: 25,
            powerOutput_years: 25,
            degradation_year1: 2.5,
            degradation_annual: 0.6,
          },
          inverterWarranty: {
            duration_years: 10,
            extendable: true,
          },
          servicePackage: {
            type: 'PREMIUM',
            duration_years: 1,
            annualCost: 3000,
            coverage: ['Maintenance', 'Repairs', 'Parts'],
          },
          claimsHistory: [],
        });
        observer.complete();
      }, 300);
    });
  }

  /**
   * POST /api/roi-calculator
   * Interactive ROI calculator (before purchase decision)
   */
  calculateROI(input: {
    systemCapacity: number;
    installationCost: number;
    monthlyElectricityCost: number;
    gridRate: number;
  }): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        const monthlyProduction = input.systemCapacity * 300 / 12; // kWh
        const monthlySavings = monthlyProduction * input.gridRate;
        const paybackMonths = input.installationCost / monthlySavings;
        const lifetime25Years = monthlySavings * 300 - input.installationCost;

        observer.next({
          ...input,
          estimatedMonthlySavings: Math.round(monthlySavings),
          estimatedMonthlyProduction: Math.round(monthlyProduction),
          paybackPeriod: {
            months: Math.round(paybackMonths),
            years: (paybackMonths / 12).toFixed(1),
          },
          lifetimeEarnings: {
            '5_years': Math.round(monthlySavings * 60 - input.installationCost),
            '10_years': Math.round(monthlySavings * 120 - input.installationCost),
            '25_years': Math.round(lifetime25Years),
          },
          roi_percentage: {
            '5_years': ((monthlySavings * 60) / input.installationCost) * 100,
            '25_years': (lifetime25Years / input.installationCost) * 100,
          },
        });
        observer.complete();
      }, 300);
    });
  }
}
