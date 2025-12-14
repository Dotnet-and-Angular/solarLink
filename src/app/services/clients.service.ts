import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Client & Sites API Service
 * Handles client list and site details
 * Available to: Installer, Admin
 */
@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private clientsSubject = new BehaviorSubject<any[]>([]);
  public clients$ = this.clientsSubject.asObservable();

  private mockClients: any[] = [
    {
      client_id: 1,
      name: 'Raju Farms',
      location: 'Piler',
      system_capacity: 5.5,
      contact_person: 'Rajesh Kumar',
      phone: '+91 98765 43210',
      email: 'rajesh@rajufarms.com',
      contract_status: 'ACTIVE',
      warranty_expiry: new Date('2028-01-15'),
      systems_count: 2,
      totalGeneration: 45.2,
    },
    {
      client_id: 2,
      name: 'TechPark Building',
      location: 'Bangalore',
      system_capacity: 25,
      contact_person: 'Priya Singh',
      phone: '+91 98765 12345',
      email: 'priya@techpark.com',
      contract_status: 'ACTIVE',
      warranty_expiry: new Date('2027-06-20'),
      systems_count: 1,
      totalGeneration: 180.5,
    },
  ];

  constructor() {
    this.clientsSubject.next(this.mockClients);
  }

  /**
   * GET /api/clients
   * Fetch all clients with quick filter/search capability
   */
  getClients(filters?: { name?: string; location?: string; status?: string }): Observable<any[]> {
    return new Observable((observer) => {
      setTimeout(() => {
        let filtered = [...this.mockClients];

        if (filters?.name) {
          filtered = filtered.filter((c) => c.name.toLowerCase().includes(filters.name!.toLowerCase()));
        }
        if (filters?.location) {
          filtered = filtered.filter((c) => c.location.toLowerCase().includes(filters.location!.toLowerCase()));
        }
        if (filters?.status) {
          filtered = filtered.filter((c) => c.contract_status === filters.status);
        }

        observer.next(filtered);
        observer.complete();
      }, 300);
    });
  }

  /**
   * GET /api/clients/:clientId
   * Fetch individual client details with sites
   */
  getClientDetail(clientId: number): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        const client = this.mockClients.find((c) => c.client_id === clientId);
        if (client) {
          observer.next({
            ...client,
            sites: [
              {
                site_id: 1,
                name: 'Site 1 - Piler',
                address: 'Plot No 123, Piler',
                coordinates: { lat: 13.1939, lng: 79.1363 },
                system_capacity: 5.5,
                status: 'ONLINE',
              },
            ],
            financial_summary: {
              investment: 275000,
              roi_percentage: 18.5,
              payback_period: '5.4 years',
            },
          });
        }
        observer.complete();
      }, 300);
    });
  }

  /**
   * POST /api/clients
   * Create new client (admin only)
   */
  createClient(clientData: any): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        const newClient = {
          ...clientData,
          client_id: Math.max(...this.mockClients.map((c) => c.client_id)) + 1,
        };
        this.mockClients.push(newClient);
        this.clientsSubject.next([...this.mockClients]);
        observer.next(newClient);
        observer.complete();
      }, 300);
    });
  }

  /**
   * PUT /api/clients/:clientId
   * Update client information
   */
  updateClient(clientId: number, updates: any): Observable<any> {
    return new Observable((observer) => {
      setTimeout(() => {
        const clientIndex = this.mockClients.findIndex((c) => c.client_id === clientId);
        if (clientIndex !== -1) {
          this.mockClients[clientIndex] = { ...this.mockClients[clientIndex], ...updates };
          this.clientsSubject.next([...this.mockClients]);
          observer.next(this.mockClients[clientIndex]);
        }
        observer.complete();
      }, 300);
    });
  }
}
