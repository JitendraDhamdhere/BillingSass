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
import { SaleService } from '../../core/services/sale.service';

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
    public searchService: SearchService,
    private saleService: SaleService
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
    this.saleService.getSaleDetails(sale.id).subscribe({
      next: (res) => {
        if (res.success) {
          this.selectedSale = res.data;
          this.showReceiptModal = true;
        }
      },
      error: (err) => {
        console.error('Failed to load sale details', err);
      }
    });
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
              body { font-family: 'Courier New', Courier, monospace; padding: 10px; color: #000; width: 80mm; margin: 0 auto; }
              .receipt-header { text-align: center; margin-bottom: 15px; }
              .receipt-header h2 { margin: 0; font-size: 18px; font-weight: bold; }
              .receipt-header p { margin: 3px 0 0 0; font-size: 12px; color: #333; }
              .receipt-details { margin-bottom: 15px; border-bottom: 1px dashed #000; padding-bottom: 10px; font-size: 12px; line-height: 1.4; display: grid; grid-template-columns: 1fr; gap: 4px; }
              table { width: 100%; border-collapse: collapse; margin-top: 5px; font-size: 12px; }
              th { text-align: left; padding: 4px 0; border-bottom: 1px solid #000; font-weight: bold; }
              td { padding: 6px 0; border-bottom: 1px solid #eee; }
              .receipt-summary-block { border-top: 1px dashed #000; padding-top: 8px; margin-top: 8px; font-size: 12px; }
              .receipt-summary-block div { display: flex; justify-content: space-between; margin-bottom: 3px; }
              .payments-details-block { border-top: 1px solid #000; padding-top: 8px; margin-top: 8px; font-size: 11px; }
              .payments-details-block div { display: flex; justify-content: space-between; margin-bottom: 3px; }
              .receipt-footer { text-align: center; margin-top: 20px; font-size: 11px; border-top: 1px dashed #000; padding-top: 8px; }
              .status-badge { font-weight: bold; }
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

  printInvoicePdf(saleId: number) {
    this.saleService.getInvoicePdf(saleId).subscribe({
      next: (blob) => {
        const file = new Blob([blob], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
      },
      error: (err) => {
        console.error('Failed to generate invoice PDF', err);
      }
    });
  }
}
