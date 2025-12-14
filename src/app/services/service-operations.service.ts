import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ServiceTicket, TicketStatus, TicketPriority } from '../models/solar-system.model';

/**
 * Service Operations API Service (CRM & Ticketing)
 * Handles service tickets, client management, and maintenance
 * Available to: Technician, Installer, Admin
 */
@Injectable({
  providedIn: 'root',
})
export class ServiceOperationsService {
  private ticketsSubject = new BehaviorSubject<ServiceTicket[]>([]);
  public tickets$ = this.ticketsSubject.asObservable();

  private mockTickets: ServiceTicket[] = [
    {
      id: '1',
      ticketNumber: '#TKT001',
      customerId: 'C001',
      systemId: 'S001',
      title: 'Inverter malfunction',
      description: 'Inverter not responding to grid',
      priority: 'critical',
      status: 'new',
      category: 'malfunction',
      createdDate: new Date('2025-12-13T10:00:00'),
      createdBy: 'Support Team',
      assignedTo: undefined,
      estimatedResolutionTime: 4,
      slaStatus: 'on-track',
    },
    {
      id: '2',
      ticketNumber: '#TKT002',
      customerId: 'C002',
      systemId: 'S002',
      title: 'Panel cleaning required',
      description: 'Panels need cleaning for optimal performance',
      priority: 'medium',
      status: 'assigned',
      category: 'maintenance',
      createdDate: new Date('2025-12-12T14:00:00'),
      createdBy: 'Support Team',
      assignedTo: 'Arjun',
      estimatedResolutionTime: 2,
      slaStatus: 'on-track',
    },
  ];

  constructor() {
    this.ticketsSubject.next(this.mockTickets);
  }

  /**
   * GET /api/tickets
   * Fetch all service tickets (admin/technician)
   */
  getTickets(): Observable<ServiceTicket[]> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next(this.mockTickets);
        observer.complete();
      }, 300);
    });
  }

  /**
   * GET /api/tickets?customerId=X
   * Fetch customer's own tickets
   */
  getCustomerTickets(customerId: string): Observable<ServiceTicket[]> {
    return new Observable((observer) => {
      setTimeout(() => {
        const customerTickets = this.mockTickets.filter((t) => t.customerId === customerId);
        observer.next(customerTickets);
        observer.complete();
      }, 300);
    });
  }

  /**
   * POST /api/tickets
   * Create a new service ticket
   */
  createTicket(ticket: Omit<ServiceTicket, 'id' | 'ticketNumber' | 'createdDate' | 'createdBy'>): Observable<ServiceTicket> {
    return new Observable((observer) => {
      setTimeout(() => {
        const newTicket: ServiceTicket = {
          ...ticket,
          id: `ticket-${Math.random().toString(36).substr(2, 9)}`,
          ticketNumber: `#TKT${String(this.mockTickets.length + 1).padStart(3, '0')}`,
          createdDate: new Date(),
          createdBy: 'Current User',
        };
        this.mockTickets.push(newTicket);
        this.ticketsSubject.next([...this.mockTickets]);
        observer.next(newTicket);
        observer.complete();
      }, 300);
    });
  }

  /**
   * PUT /api/tickets/:ticketId
   * Update ticket status or assignment
   */
  updateTicket(ticketId: string, updates: Partial<ServiceTicket>): Observable<ServiceTicket> {
    return new Observable((observer) => {
      setTimeout(() => {
        const ticketIndex = this.mockTickets.findIndex((t) => t.id === ticketId);
        if (ticketIndex !== -1) {
          this.mockTickets[ticketIndex] = { ...this.mockTickets[ticketIndex], ...updates };
          this.ticketsSubject.next([...this.mockTickets]);
          observer.next(this.mockTickets[ticketIndex]);
        }
        observer.complete();
      }, 300);
    });
  }

  /**
   * GET /api/tickets/:ticketId
   * Get ticket detail
   */
  getTicketDetail(ticketId: string): Observable<ServiceTicket | undefined> {
    return new Observable((observer) => {
      setTimeout(() => {
        observer.next(this.mockTickets.find((t) => t.id === ticketId));
        observer.complete();
      }, 300);
    });
  }
}
