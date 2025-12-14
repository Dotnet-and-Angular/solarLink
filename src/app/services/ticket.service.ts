import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ticket {
    id?: number;
    siteId: number;
    title: string;
    description: string;
    status?: 'OPEN' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    assignedTo?: string;
    createdAt?: string;
    updatedAt?: string;
}

@Injectable({
    providedIn: 'root',
})
export class TicketService {
    private apiUrl = 'http://localhost:5011/api/tickets';

    constructor(private http: HttpClient) { }

    /**
     * Get all tickets
     */
    getAllTickets(): Observable<Ticket[]> {
        return this.http.get<Ticket[]>(this.apiUrl);
    }

    /**
     * Get specific ticket
     */
    getTicketDetails(id: number): Observable<Ticket> {
        return this.http.get<Ticket>(`${this.apiUrl}/${id}`);
    }

    /**
     * Create new ticket
     */
    createTicket(ticket: Ticket): Observable<Ticket> {
        return this.http.post<Ticket>(this.apiUrl, ticket);
    }

    /**
     * Update ticket
     */
    updateTicket(id: number, ticket: Partial<Ticket>): Observable<Ticket> {
        return this.http.put<Ticket>(`${this.apiUrl}/${id}`, ticket);
    }

    /**
     * Delete ticket
     */
    deleteTicket(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }

    /**
     * Assign ticket to technician
     */
    assignTicket(id: number, assignedTo: string): Observable<Ticket> {
        return this.updateTicket(id, { assignedTo, status: 'ASSIGNED' });
    }

    /**
     * Update ticket status
     */
    updateTicketStatus(id: number, status: string): Observable<Ticket> {
        return this.updateTicket(id, { status: status as any });
    }
}
