import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

export interface StockItem {
  id?: number;
  itemName: string;
  description?: string;
  stock: number;
  reorderLevel: number;
  unit?: string;
  lastUpdated?: string;
}

/**
 * Inventory Management API Service
 * Tracks stock levels, reorder points, and vendor management
 * Available to: Installer (managed), Admin (all)
 */
@Injectable({
  providedIn: 'root',
})
export class InventoryService {
  private apiUrl = 'http://localhost:5011/api/inventory';
  private inventorySubject = new BehaviorSubject<any[]>([]);
  public inventory$ = this.inventorySubject.asObservable();

  constructor(private http: HttpClient) { }



  /**
   * Get all stock items
   */
  getAllStock(): Observable<StockItem[]> {
    return this.http.get<StockItem[]>(`${this.apiUrl}/stock`).pipe(
      tap((items) => this.inventorySubject.next(items))
    );
  }

  /**
   * Get stock for dashboard - alias for getAllStock
   */
  getInventory(filters?: { category?: string; status?: 'low_stock' | 'adequate' | 'overstock' }): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/stock`);
  }

  /**
   * Get specific stock item
   */
  getStockItem(id: number): Observable<StockItem> {
    return this.http.get<StockItem>(`${this.apiUrl}/stock/${id}`);
  }

  /**
   * Alias for backward compatibility
   */
  getItemDetail(itemId: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stock/${itemId}`);
  }

  /**
   * Update stock level
   */
  updateStock(id: number, stock: number, reorderLevel: number): Observable<StockItem> {
    return this.http.put<StockItem>(`${this.apiUrl}/stock/${id}`, { stock, reorderLevel });
  }

  /**
   * Create new stock item
   */
  createStockItem(item: StockItem): Observable<StockItem> {
    return this.http.post<StockItem>(`${this.apiUrl}/stock`, item);
  }

  /**
   * Delete stock item
   */
  deleteStockItem(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/stock/${id}`);
  }

  /**
   * Backward compatibility - Update inventory
   */
  updateInventory(itemId: number, updates: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/stock/${itemId}`, updates);
  }

  /**
   * Get stock status report
   */
  getStockStatusReport(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/report`);
  }

  /**
   * Adjust stock (manual adjustment)
   */
  adjustStock(itemId: number, adjustment: number, reason: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/stock/${itemId}/adjust`, { adjustment, reason });
  }
}
