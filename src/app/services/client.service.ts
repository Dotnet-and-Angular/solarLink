import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Client {
    id?: number;
    name: string;
    location: string;
    systemCapacity: number;
    contactPhone: string;
    contactEmail: string;
    createdAt?: string;
    updatedAt?: string;
}

@Injectable({
    providedIn: 'root',
})
export class ClientService {
    private apiUrl = 'http://localhost:5011/api/clients';

    constructor(private http: HttpClient) { }

    /**
     * Get all clients
     */
    getAllClients(): Observable<Client[]> {
        return this.http.get<Client[]>(this.apiUrl);
    }

    /**
     * Get specific client details
     */
    getClientDetails(id: number): Observable<Client> {
        return this.http.get<Client>(`${this.apiUrl}/${id}`);
    }

    /**
     * Create new client
     */
    createClient(client: Client): Observable<Client> {
        return this.http.post<Client>(this.apiUrl, client);
    }

    /**
     * Update client
     */
    updateClient(id: number, client: Client): Observable<Client> {
        return this.http.put<Client>(`${this.apiUrl}/${id}`, client);
    }

    /**
     * Delete client
     */
    deleteClient(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
