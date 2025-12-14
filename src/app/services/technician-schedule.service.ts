import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Technician Schedule & Workload API Service
 * Manages technician schedules, job assignments, and workload distribution
 * Available to: Technician (own schedule), Installer (team management), Admin (all)
 */
@Injectable({
  providedIn: 'root',
})
export class TechnicianScheduleService {
  private scheduleSubject = new BehaviorSubject<any[]>([]);
  public schedule$ = this.scheduleSubject.asObservable();

  private mockTechnicians: any[] = [
    {
      tech_id: 1,
      name: 'Ramesh Kumar',
      email: 'ramesh@solarpros.com',
      phone: '+91 98765 43210',
      expertise: ['Installation', 'Maintenance', 'Troubleshooting'],
      certification: 'IEC 61482',
      current_workload: 6, // jobs
      availability_status: 'AVAILABLE',
    },
    {
      tech_id: 2,
      name: 'Priya Sharma',
      email: 'priya@solarpros.com',
      phone: '+91 98765 12345',
      expertise: ['Maintenance', 'Electrical'],
      certification: 'Basic Safety',
      current_workload: 8,
      availability_status: 'BUSY',
    },
  ];

  private mockSchedules: any[] = [
    {
      schedule_id: 1,
      tech_id: 1,
      date: '2024-01-20',
      day_of_week: 'Saturday',
      jobs_scheduled: 3,
      estimated_hours: 8,
      jobs: [
        {
          job_id: 1,
          site_name: 'Raju Farms',
          task: 'String replacement',
          start_time: '09:00',
          end_time: '11:00',
          duration_minutes: 120,
          status: 'SCHEDULED',
          address: 'Plot 123, Piler',
          distance_km: 12.5,
        },
        {
          job_id: 2,
          site_name: 'TechPark',
          task: 'Inverter servicing',
          start_time: '12:00',
          end_time: '14:00',
          duration_minutes: 120,
          status: 'SCHEDULED',
          address: 'Tech Lane, Bangalore',
          distance_km: 45.0,
        },
        {
          job_id: 3,
          site_name: 'Factory Complex',
          task: 'Monthly inspection',
          start_time: '15:00',
          end_time: '17:00',
          duration_minutes: 120,
          status: 'SCHEDULED',
          address: 'Industrial Zone, Chennai',
          distance_km: 120.0,
        },
      ],
    },
  ];

  constructor() {
    this.scheduleSubject.next(this.mockSchedules);
  }

  /**
   * GET /api/technicians
   * Fetch all technicians with current workload status
   */
  getTechnicians(filters?: { expertise?: string; availability?: string }): Observable<any[]> {
    return new Observable((observer) => {
      setTimeout(() => {
        let filtered = this.mockTechnicians.map((tech) => ({
          ...tech,
          workload_percentage: Math.round((tech.current_workload / 10) * 100),
          next_available_slot: new Date(Date.now() + tech.current_workload * 2 * 60 * 60 * 1000),
        }));

        if (filters?.expertise) {
          filtered = filtered.filter((t) => t.expertise.includes(filters.expertise));
        }

        if (filters?.availability) {
          filtered = filtered.filter((t) => t.availability_status === filters.availability);
        }

        observer.next(filtered);
        observer.complete();
      }, 300);
    });
  }

  /**
   * GET /api/technicians/:techId/schedule
   * Fetch technician's schedule for a specific date or period
   */
  getTechnicianSchedule(techId: number, date?: string): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        const schedule = this.mockSchedules.find((s) => s.tech_id === techId);
        if (schedule) {
          observer.next({
            ...schedule,
            total_distance: schedule.jobs.reduce((sum: number, job: any) => sum + job.distance_km, 0),
            suggested_route: this.getRouteOrder(schedule.jobs),
            breaks: [{ start: '11:00', end: '12:00', type: 'LUNCH' }],
            travel_time_total: Math.round(schedule.jobs.reduce((sum: number, job: any) => sum + job.distance_km, 0) / 40), // minutes
          });
        }
        observer.complete();
      }, 300);
    });
  }

  /**
   * POST /api/schedule/assign-job
   * Assign a job to a technician
   */
  assignJob(
    jobId: number,
    techId: number,
    scheduleDate: string,
    estimatedDuration: number
  ): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({
          assignment_id: `ASSIGN-${Date.now()}`,
          job_id: jobId,
          tech_id: techId,
          tech_name: this.mockTechnicians.find((t) => t.tech_id === techId)?.name,
          scheduled_date: scheduleDate,
          estimated_duration_minutes: estimatedDuration,
          status: 'ASSIGNED',
          assigned_at: new Date(),
          notification_sent: true,
        });
        observer.complete();
      }, 300);
    });
  }

  /**
   * PUT /api/schedule/:scheduleId/job/:jobId/status
   * Update job status (scheduled, in-progress, completed, cancelled)
   */
  updateJobStatus(
    scheduleId: number,
    jobId: number,
    status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled',
    notes?: string
  ): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        const schedule = this.mockSchedules.find((s) => s.schedule_id === scheduleId);
        if (schedule) {
          const job = schedule.jobs.find((j: any) => j.job_id === jobId);
          if (job) {
            job.status = status.toUpperCase();
            this.scheduleSubject.next([...this.mockSchedules]);

            observer.next({
              job_id: jobId,
              schedule_id: scheduleId,
              new_status: status.toUpperCase(),
              updated_at: new Date(),
              notes,
              work_order_generated: status === 'completed',
            });
          }
        }
        observer.complete();
      }, 300);
    });
  }

  /**
   * GET /api/schedule/workload-distribution
   * Analyze workload distribution across technicians
   */
  getWorkloadDistribution(): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({
          report_date: new Date(),
          total_technicians: this.mockTechnicians.length,
          total_scheduled_jobs: 6,
          distribution: this.mockTechnicians.map((tech) => ({
            tech_id: tech.tech_id,
            name: tech.name,
            current_jobs: tech.current_workload,
            utilization_percentage: (tech.current_workload / 10) * 100,
            availability: tech.availability_status,
            next_available: new Date(Date.now() + tech.current_workload * 2 * 60 * 60 * 1000),
          })),
          recommendations: [
            'Priya Sharma is at high utilization - consider reassigning some jobs',
            'Ramesh Kumar has available capacity - can take 4 more jobs',
          ],
          optimal_utilization: 75,
        });
        observer.complete();
      }, 300);
    });
  }

  /**
   * POST /api/schedule/auto-assign
   * Automatically assign jobs based on technician availability, expertise, and location
   */
  autoAssignJobs(jobIds: number[]): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        const assignments = jobIds.map((jobId, index) => ({
          job_id: jobId,
          assigned_to_tech_id: this.mockTechnicians[index % this.mockTechnicians.length].tech_id,
          assigned_to_name: this.mockTechnicians[index % this.mockTechnicians.length].name,
          status: 'ASSIGNED',
        }));

        observer.next({
          assignments,
          total_assigned: assignments.length,
          assignment_success_rate: 100,
          optimization_score: 85.5, // Based on distance, expertise, availability
        });
        observer.complete();
      }, 300);
    });
  }

  /**
   * GET /api/technicians/:techId/performance
   * Technician performance metrics
   */
  getTechnicianPerformance(techId: number): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({
          tech_id: techId,
          name: this.mockTechnicians.find((t) => t.tech_id === techId)?.name,
          period: 'Last 30 days',
          metrics: {
            jobs_completed: 24,
            jobs_on_schedule: 23,
            completion_rate: 95.8,
            average_customer_rating: 4.8,
            average_job_duration: 125, // minutes
            total_hours_worked: 192,
            efficiency_score: 94.5,
          },
          quality_metrics: {
            rework_rate: 2.1,
            customer_complaints: 1,
            safety_incidents: 0,
          },
          certifications: ['IEC 61482', 'First Aid', 'Electrical Safety'],
          skills_rating: {
            installation: 9.5,
            maintenance: 9.2,
            troubleshooting: 8.8,
            customer_service: 9.1,
          },
        });
        observer.complete();
      }, 300);
    });
  }

  /**
   * POST /api/schedule/break-request
   * Request break or time off
   */
  requestBreak(techId: number, breakType: string, startTime: string, duration: number): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next({
          request_id: `BRK-${Date.now()}`,
          tech_id: techId,
          break_type: breakType,
          start_time: startTime,
          duration_minutes: duration,
          status: 'PENDING',
          created_at: new Date(),
          will_notify_supervisor: true,
        });
        observer.complete();
      }, 300);
    });
  }

  /**
   * GET /api/schedule/travel-optimization/:scheduleId
   * Optimize route for technician's daily schedule
   */
  optimizeRoute(jobs: any[]): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        // Simple distance-based sorting
        const optimized = [...jobs].sort(
          (a, b) => Math.abs(a.distance_km - 40) - Math.abs(b.distance_km - 40)
        );

        observer.next({
          original_order: jobs.map((j) => j.site_name),
          optimized_order: optimized.map((j) => j.site_name),
          total_distance_saved_km: 5.3,
          estimated_time_saved_minutes: 15,
          optimized_route: optimized,
        });
        observer.complete();
      }, 300);
    });
  }

  /**
   * Helper method to get route order (synchronous version for template)
   */
  private getRouteOrder(jobs: any[]): string[] {
    return jobs
      .sort((a, b) => a.distance_km - b.distance_km)
      .map((j) => j.site_name);
  }
}
