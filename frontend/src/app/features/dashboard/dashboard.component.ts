import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { SearchService } from '../../core/services/search.service';

import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule, MatIconModule, MatButtonModule, MatTableModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  metrics: any = null;
  displayedColumns: string[] = ['saleNumber', 'date', 'customer', 'grandTotal', 'status', 'actions'];
  showReceiptModal = false;
  selectedSale: any = null;
  loading = false;
  private refreshIntervalId: any;

  constructor(
    private http: HttpClient,
    public searchService: SearchService
  ) { }

  ngOnInit() {
    this.loadMetrics();
    // Auto-refresh every 15 seconds for real-time data representation
    this.refreshIntervalId = setInterval(() => {
      this.loadMetrics(true);
    }, 15000);
  }

  ngOnDestroy() {
    if (this.refreshIntervalId) {
      clearInterval(this.refreshIntervalId);
    }
  }

  get filteredRecentSales() {
    if (!this.metrics?.recentSales) return [];
    const query = this.searchService.searchQuery().toLowerCase().trim();
    if (!query) return this.metrics.recentSales;
    return this.metrics.recentSales.filter((item: any) => 
      item.saleNumber?.toLowerCase().includes(query) || 
      item.customerName?.toLowerCase().includes(query)
    );
  }

  loadMetrics(silent = false) {
    if (!silent) {
      this.loading = true;
    }
    this.http.get<any>(`${environment.apiUrl}/dashboard/metrics`).subscribe({
      next: (res) => {
        this.metrics = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  refreshMetrics() {
    this.loadMetrics();
  }

  printReceipt(sale: any) {
    this.selectedSale = sale;
    this.showReceiptModal = true;
  }

  closeReceiptModal() {
    this.showReceiptModal = false;
    this.selectedSale = null;
  }

  printCurrentReceipt() {
    const printContent = document.getElementById('print-section');
    if (!printContent) return;

    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (doc) {
      doc.write(`
        <html>
          <head>
            <title>Receipt</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; color: #333; }
              .receipt-header { text-align: center; margin-bottom: 20px; }
              .receipt-header h2 { margin: 0; font-size: 20px; }
              .receipt-header p { margin: 5px 0 0 0; font-size: 14px; color: #666; }
              .receipt-details { margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
              .receipt-details p { margin: 6px 0; font-size: 14px; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              th, td { text-align: left; padding: 8px; border-bottom: 1px solid #eee; font-size: 14px; }
              .text-right { text-align: right; }
              .font-bold { font-weight: bold; }
              .status-badge { 
                padding: 3px 8px; 
                border-radius: 12px; 
                font-size: 11px; 
                font-weight: 600; 
                color: #047857;
                background: rgba(16, 185, 129, 0.15);
              }
              .receipt-footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      doc.close();

      setTimeout(() => {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
        document.body.removeChild(iframe);
      }, 500);
    }
  }

  formatDate(dateVal: any): string {
    if (!dateVal) return '';
    if (Array.isArray(dateVal)) {
      const [year, month, day, hour = 0, minute = 0, second = 0] = dateVal;
      return new Date(year, month - 1, day, hour, minute, second).toLocaleString();
    }
    const d = new Date(dateVal);
    return isNaN(d.getTime()) ? String(dateVal) : d.toLocaleString();
  }
}
