import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private apiUrl = `${environment.apiUrl}/sales`;

  constructor(private http: HttpClient) {}

  createSale(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }

  getInvoicePdf(saleId: number): Observable<Blob> {
    return this.http.get(`${environment.apiUrl}/invoices/${saleId}/pdf`, { responseType: 'blob' });
  }

  getSaleDetails(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
