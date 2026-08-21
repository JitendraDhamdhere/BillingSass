import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatIconModule, MatButtonModule, MatTableModule, MatSelectModule],
  template: `
    <div class="reports-container">
      
      <!-- Left Navigation Pane -->
      <aside class="reports-sidebar glass-panel">
        <h3 class="sidebar-title"><mat-icon>analytics</mat-icon> Report Menu</h3>
        
        <div class="report-menu-section" *ngFor="let sec of reportSections">
          <h4 class="section-title">{{sec.title}}</h4>
          <ul class="section-list">
            <li *ngFor="let item of sec.items" 
                [class.active]="selectedReport === item.code"
                (click)="selectReport(item.code)">
              <mat-icon class="menu-icon">{{item.icon}}</mat-icon>
              <span>{{item.label}}</span>
            </li>
          </ul>
        </div>
      </aside>

      <!-- Right Content View -->
      <main class="reports-main-content">
        
        <!-- Filters Bar Card -->
        <mat-card class="glass-card filters-card">
          <mat-card-content class="filters-layout">
            <div class="date-pickers">
              <div class="date-group">
                <label>Start Date</label>
                <input type="date" [(ngModel)]="startDate" class="date-input" />
              </div>
              <div class="date-group">
                <label>End Date</label>
                <input type="date" [(ngModel)]="endDate" class="date-input" />
              </div>
            </div>
            
            <div class="date-presets">
              <button mat-button class="preset-btn" (click)="setPreset('today')">Today</button>
              <button mat-button class="preset-btn" (click)="setPreset('yesterday')">Yesterday</button>
              <button mat-button class="preset-btn" (click)="setPreset('this_month')">This Month</button>
              <button mat-button class="preset-btn" (click)="setPreset('last_month')">Last Month</button>
              <button mat-button class="preset-btn" (click)="setPreset('last_30')">Last 30 Days</button>
            </div>
            
            <div class="action-buttons">
              <button mat-flat-button color="primary" (click)="fetchReport()">
                <mat-icon>refresh</mat-icon> Fetch Report
              </button>
              <button mat-flat-button color="accent" (click)="exportToCSV()" [disabled]="reportData.length === 0">
                <mat-icon>download</mat-icon> CSV
              </button>
              <button mat-stroked-button (click)="printReport()" [disabled]="reportData.length === 0">
                <mat-icon>print</mat-icon> Print
              </button>
            </div>
          </mat-card-content>
        </mat-card>

        <!-- Dynamic Report Display Panel -->
        <div class="glass-panel report-result-panel" *ngIf="reportTitle">
          <div class="report-result-header">
            <div>
              <h2>{{reportTitle}}</h2>
              <span class="report-subtitle">Duration: {{startDate | date}} to {{endDate | date}}</span>
            </div>
            <div class="live-indicator">
              <span class="pulse-dot"></span>
              <span>IST Report Server</span>
            </div>
          </div>

          <!-- Aggregates summary boxes -->
          <div class="summary-kpi-grid" *ngIf="kpis.length > 0">
            <div class="kpi-mini-card" *ngFor="let kpi of kpis">
              <span class="kpi-label">{{kpi.label}}</span>
              <span class="kpi-val">{{kpi.val}}</span>
            </div>
          </div>

          <!-- Dynamic Columns Table -->
          <div class="table-scroll-container" *ngIf="reportData.length > 0">
            <table mat-table [dataSource]="reportData" class="custom-table" style="width: 100%;">
              <ng-container *ngFor="let col of columns" [matColumnDef]="col">
                <th mat-header-cell *matHeaderCellDef> {{ getColumnHeader(col) }} </th>
                <td mat-cell *matCellDef="let element"> 
                  <ng-container [ngSwitch]="col">
                    <span *ngSwitchCase="'paymentStatus'" class="status-badge" [class.status-paid]="element[col] === 'PAID'" [class.status-active]="element[col] === 'ACTIVE'" [class.status-inactive]="element[col] === 'INACTIVE'">
                      {{element[col]}}
                    </span>
                    <span *ngSwitchCase="'status'" class="status-badge" [class.status-active]="element[col] === 'ACTIVE'" [class.status-inactive]="element[col] === 'INACTIVE'">
                      {{element[col]}}
                    </span>
                    <span *ngSwitchCase="'type'" class="status-badge" [class.status-active]="element[col] === 'IN' || element[col] === 'ADJUSTMENT'">
                      {{element[col]}}
                    </span>
                    <span *ngSwitchDefault>
                      {{ formatValue(col, element[col]) }}
                    </span>
                  </ng-container>
                </td>
              </ng-container>
              
              <tr mat-header-row *matHeaderRowDef="columns; sticky: true"></tr>
              <tr mat-row *matRowDef="let row; columns: columns;"></tr>
            </table>
          </div>

          <!-- Empty State -->
          <div class="report-empty-state" *ngIf="reportData.length === 0">
            <mat-icon>leaderboard</mat-icon>
            <p>No records found for the selected parameters. Choose filters and click <strong>Fetch Report</strong>.</p>
          </div>

        </div>

      </main>
    </div>
  `,
  styles: [`
    .reports-container { display: flex; gap: 24px; min-height: calc(100vh - 120px); }
    
    /* Sidebar list styling */
    .reports-sidebar { flex: 0 0 280px; padding: 20px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); }
    .sidebar-title { display: flex; align-items: center; gap: 8px; font-size: 16px; font-weight: 600; margin: 0 0 20px 0; color: var(--text-primary); }
    .report-menu-section { margin-bottom: 24px; }
    .section-title { font-size: 11px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; }
    .section-list { list-style: none; padding: 0; margin: 0; }
    .section-list li { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: var(--radius-sm); cursor: pointer; color: var(--text-secondary); font-size: 13px; font-weight: 500; transition: background 0.2s, color 0.2s; margin-bottom: 4px; }
    .section-list li:hover { background: rgba(79, 70, 229, 0.05); color: var(--primary); }
    .section-list li.active { background: rgba(79, 70, 229, 0.08); color: var(--primary); font-weight: 600; border-left: 3px solid var(--primary); }
    .menu-icon { font-size: 18px; width: 18px; height: 18px; }
    
    /* Main View Area */
    .reports-main-content { flex: 1; display: flex; flex-direction: column; gap: 20px; }
    .filters-card { padding: 16px 20px; }
    .filters-layout { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 20px; }
    .date-pickers { display: flex; gap: 16px; }
    .date-group { display: flex; flex-direction: column; gap: 6px; }
    .date-group label { font-size: 12px; font-weight: 600; color: var(--text-secondary); }
    .date-input { background: var(--surface); border: 1px solid var(--border); color: var(--text-primary); padding: 8px 12px; border-radius: var(--radius-sm); font-size: 13px; outline: none; }
    .date-presets { display: flex; gap: 8px; flex-wrap: wrap; }
    .preset-btn { font-size: 12px !important; color: var(--text-secondary) !important; padding: 4px 8px !important; line-height: 24px !important; }
    .preset-btn:hover { background: rgba(79, 70, 229, 0.05) !important; color: var(--primary) !important; }
    .action-buttons { display: flex; gap: 10px; }
    
    /* Report result page */
    .report-result-panel { padding: 24px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius-lg); }
    .report-result-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; border-bottom: 1px solid var(--border); padding-bottom: 16px; }
    .report-result-header h2 { margin: 0; font-size: 20px; font-weight: 700; color: var(--text-primary); }
    .report-subtitle { font-size: 12px; color: var(--text-muted); margin-top: 4px; display: inline-block; }
    .live-indicator { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 600; color: #2ed573; background: rgba(46,213,115,0.1); padding: 4px 8px; border-radius: var(--radius-xl); }
    .pulse-dot { width: 6px; height: 6px; background: #2ed573; border-radius: 50%; animation: pulse 1.5s infinite; }
    
    /* Aggregates row styling */
    .summary-kpi-grid { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
    .kpi-mini-card { flex: 1; min-width: 140px; padding: 12px 16px; background: rgba(255,255,255,0.03); border: 1px solid var(--border); border-radius: var(--radius-md); display: flex; flex-direction: column; gap: 4px; }
    .kpi-label { font-size: 11px; font-weight: 600; color: var(--text-secondary); text-transform: uppercase; }
    .kpi-val { font-size: 18px; font-weight: 700; color: var(--primary); }
    
    .table-scroll-container { overflow: auto; max-height: 55vh; }
    .report-empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 20px; color: var(--text-muted); text-align: center; }
    .report-empty-state mat-icon { font-size: 64px; width: 64px; height: 64px; opacity: 0.3; margin-bottom: 16px; }
    .report-empty-state p { max-width: 400px; margin: 0; font-size: 14px; line-height: 1.6; }
    
    @keyframes pulse {
      0% { transform: scale(0.9); opacity: 0.5; }
      50% { transform: scale(1.2); opacity: 1; }
      100% { transform: scale(0.9); opacity: 0.5; }
    }
  `]
})
export class ReportsComponent implements OnInit {
  startDate = '';
  endDate = '';
  selectedReport = 'DAILY_SALES';
  reportTitle = 'Daily Sales';
  reportData: any[] = [];
  columns: string[] = [];
  kpis: any[] = [];

  reportSections = [
    {
      title: 'Sales Reports',
      items: [
        { code: 'DAILY_SALES', label: 'Daily Sales Report', icon: 'today' },
        { code: 'SALES_SUMMARY', label: 'Sales Summary Report', icon: 'pie_chart' },
        { code: 'SALES_REGISTER', label: 'Invoice/Sales Register', icon: 'receipt_long' },
        { code: 'PRODUCT_SALES', label: 'Product-wise Sales', icon: 'shopping_bag' },
        { code: 'CUSTOMER_SALES', label: 'Customer-wise Sales', icon: 'people_outline' },
        { code: 'SALES_RETURN', label: 'Sales Return Report', icon: 'keyboard_return' }
      ]
    },
    {
      title: 'Purchase & Inventory',
      items: [
        { code: 'PURCHASE_REPORT', label: 'Purchase Report', icon: 'local_shipping' },
        { code: 'PURCHASE_RETURN', label: 'Purchase Return Report', icon: 'assignment_return' },
        { code: 'STOCK_REPORT', label: 'Stock Report', icon: 'inventory_2' },
        { code: 'STOCK_MOVEMENT', label: 'Stock Movement Report', icon: 'swap_horiz' },
        { code: 'LOW_STOCK', label: 'Low Stock Report', icon: 'warning_amber' },
        { code: 'STOCK_VALUATION', label: 'Stock Valuation Report', icon: 'monetization_on' }
      ]
    },
    {
      title: 'Payment & Finance',
      items: [
        { code: 'PAYMENT_COLLECTION', label: 'Payment Collection', icon: 'account_balance_wallet' },
        { code: 'CUSTOMER_OUTSTANDING', label: 'Customer Outstanding', icon: 'supervised_user_circle' },
        { code: 'SUPPLIER_OUTSTANDING', label: 'Supplier Outstanding', icon: 'storefront' },
        { code: 'PROFIT_LOSS', label: 'Profit & Loss Report', icon: 'query_stats' }
      ]
    },
    {
      title: 'Customer & Business',
      items: [
        { code: 'CUSTOMER_ACTIVITY', label: 'Customer List & Activity', icon: 'insights' },
        { code: 'TOP_PRODUCTS', label: 'Top Selling Products', icon: 'trending_up' },
        { code: 'TOP_CUSTOMERS', label: 'Top Customers', icon: 'workspace_premium' }
      ]
    }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.setPreset('last_30');
    this.fetchReport();
  }

  selectReport(code: string) {
    this.selectedReport = code;
    
    // Find label
    for(let sec of this.reportSections) {
      const match = sec.items.find(i => i.code === code);
      if(match) {
        this.reportTitle = match.label;
        break;
      }
    }
    
    this.reportData = [];
    this.kpis = [];
    this.fetchReport();
  }

  setPreset(preset: string) {
    const today = new Date();
    let start = new Date();
    
    switch(preset) {
      case 'today':
        start = today;
        break;
      case 'yesterday':
        start = new Date();
        start.setDate(today.getDate() - 1);
        today.setDate(today.getDate() - 1);
        break;
      case 'this_month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        break;
      case 'last_month':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        today.setDate(0); // last day of previous month
        break;
      case 'last_30':
      default:
        start.setDate(today.getDate() - 30);
        break;
    }

    this.startDate = start.toISOString().substring(0, 10);
    this.endDate = today.toISOString().substring(0, 10);
  }

  fetchReport() {
    this.columns = this.getColumns();
    const url = `${environment.apiUrl}/reports?type=${this.selectedReport}&startDate=${this.startDate}&endDate=${this.endDate}`;
    
    this.http.get<any>(url).subscribe({
      next: (res) => {
        if (res.success) {
          // Check if data is list or object
          if (this.selectedReport === 'SALES_SUMMARY') {
            this.reportData = [
              { metric: 'Total Sales Revenue', value: res.data.totalSales },
              { metric: 'Total Discount Given', value: res.data.totalDiscount },
              { metric: 'Total Tax Collected', value: res.data.totalTax },
              { metric: 'Net Sales (Excl. Tax)', value: res.data.netSales },
              { metric: 'Invoices Count', value: res.data.invoiceCount }
            ];
            this.generateKPIs(res.data);
          } else if (this.selectedReport === 'PROFIT_LOSS') {
            this.reportData = [
              { metric: 'Total Sales Revenue', value: res.data.totalRevenue },
              { metric: 'Cost of Goods Sold (Purchases)', value: res.data.costOfGoods },
              { metric: 'Gross Profit', value: res.data.grossProfit },
              { metric: 'Gross Profit Margin (%)', value: res.data.profitMarginPercentage }
            ];
            this.generateKPIs(res.data);
          } else {
            this.reportData = res.data || [];
            this.generateKPIs(null);
          }
        }
      },
      error: (err) => {
        console.error('Failed to load report', err);
      }
    });
  }

  getColumns(): string[] {
    switch(this.selectedReport) {
      case 'DAILY_SALES': return ['date', 'invoiceCount', 'totalSales'];
      case 'SALES_SUMMARY': return ['metric', 'value'];
      case 'SALES_REGISTER': return ['saleNumber', 'date', 'customerName', 'grandTotal', 'paymentStatus', 'cashier'];
      case 'PRODUCT_SALES': return ['productCode', 'name', 'quantitySold', 'totalRevenue'];
      case 'CUSTOMER_SALES': return ['customerName', 'invoiceCount', 'totalSales'];
      case 'SALES_RETURN': return ['returnNumber', 'saleNumber', 'date', 'refundAmount', 'reason'];
      case 'PURCHASE_REPORT': return ['purchaseNumber', 'supplierName', 'date', 'grandTotal', 'paymentStatus'];
      case 'PURCHASE_RETURN': return ['returnNumber', 'purchaseNumber', 'date', 'refundAmount', 'reason'];
      case 'STOCK_REPORT': return ['productCode', 'name', 'category', 'brand', 'currentStock', 'status'];
      case 'STOCK_MOVEMENT': return ['date', 'productName', 'type', 'quantity', 'reason'];
      case 'LOW_STOCK': return ['productCode', 'name', 'currentStock', 'minimumStock', 'requiredReplenish'];
      case 'STOCK_VALUATION': return ['productCode', 'name', 'currentStock', 'purchasePrice', 'sellingPrice', 'totalPurchaseValue', 'totalSellingValue'];
      case 'PAYMENT_COLLECTION': return ['paymentMethod', 'totalAmount'];
      case 'CUSTOMER_OUTSTANDING': return ['customerCode', 'name', 'mobile', 'email', 'outstanding'];
      case 'SUPPLIER_OUTSTANDING': return ['supplierCode', 'companyName', 'name', 'mobile', 'outstanding'];
      case 'PROFIT_LOSS': return ['metric', 'value'];
      case 'CUSTOMER_ACTIVITY': return ['customerCode', 'name', 'invoiceCount', 'totalSpend'];
      case 'TOP_PRODUCTS': return ['productCode', 'name', 'quantitySold', 'totalRevenue'];
      case 'TOP_CUSTOMERS': return ['customerName', 'invoiceCount', 'totalSales'];
      default: return [];
    }
  }

  getColumnHeader(col: string): string {
    const headers: any = {
      date: 'Date',
      invoiceCount: 'Invoice Count',
      totalSales: 'Total Sales',
      saleNumber: 'Invoice #',
      customerName: 'Customer Name',
      grandTotal: 'Grand Total',
      paymentStatus: 'Payment Status',
      cashier: 'Cashier',
      productCode: 'Product Code',
      name: 'Product Name',
      quantitySold: 'Quantity Sold',
      totalRevenue: 'Total Revenue',
      returnNumber: 'Return Number',
      refundAmount: 'Refund Amount',
      reason: 'Reason',
      purchaseNumber: 'Purchase Number',
      supplierName: 'Supplier Name',
      category: 'Category',
      brand: 'Brand',
      currentStock: 'Current Stock',
      status: 'Status',
      productName: 'Product Name',
      type: 'Type',
      quantity: 'Quantity',
      minimumStock: 'Min Stock',
      requiredReplenish: 'Required Replenish',
      purchasePrice: 'Purchase Price',
      sellingPrice: 'Selling Price',
      totalPurchaseValue: 'Valuation (Purchase)',
      totalSellingValue: 'Valuation (Selling)',
      paymentMethod: 'Payment Method',
      totalAmount: 'Total Amount',
      customerCode: 'Customer Code',
      mobile: 'Mobile',
      email: 'Email',
      outstanding: 'Outstanding Dues',
      supplierCode: 'Supplier Code',
      companyName: 'Company Name',
      totalSpend: 'Total Spend',
      metric: 'Metric',
      value: 'Value'
    };
    return headers[col] || col;
  }

  formatValue(col: string, val: any): any {
    if (val === null || val === undefined) return 'N/A';
    
    // Check if the value is a number and matches money columns
    const moneyColumns = [
      'totalSales', 'grandTotal', 'totalRevenue', 'refundAmount', 'purchasePrice', 
      'sellingPrice', 'totalPurchaseValue', 'totalSellingValue', 'totalAmount', 
      'outstanding', 'totalSpend'
    ];
    
    if (moneyColumns.includes(col) && typeof val === 'number') {
      return '₹' + val.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }
    
    // Format date values
    if (col === 'date' && typeof val === 'string' && val.includes('T')) {
      return new Date(val).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
    }

    return val;
  }

  generateKPIs(customData: any) {
    this.kpis = [];
    
    if (customData) {
      if (this.selectedReport === 'SALES_SUMMARY') {
        this.kpis = [
          { label: 'Gross Sales', val: '₹' + customData.totalSales.toLocaleString('en-IN') },
          { label: 'Total Tax', val: '₹' + customData.totalTax.toLocaleString('en-IN') },
          { label: 'Net Profit Base', val: '₹' + customData.netSales.toLocaleString('en-IN') }
        ];
      } else if (this.selectedReport === 'PROFIT_LOSS') {
        this.kpis = [
          { label: 'Gross Profit', val: '₹' + customData.grossProfit.toLocaleString('en-IN') },
          { label: 'Margin', val: customData.profitMarginPercentage.toFixed(2) + '%' }
        ];
      }
      return;
    }

    // Default lists KPIs
    if (this.reportData.length === 0) return;

    if (this.selectedReport === 'DAILY_SALES') {
      const sum = this.reportData.reduce((acc, row) => acc + (row.totalSales || 0), 0);
      this.kpis = [
        { label: 'Total Revenue', val: '₹' + sum.toLocaleString('en-IN') },
        { label: 'Operating Days', val: this.reportData.length }
      ];
    } else if (this.selectedReport === 'STOCK_VALUATION') {
      const sumVal = this.reportData.reduce((acc, row) => acc + (row.totalPurchaseValue || 0), 0);
      const totalUnits = this.reportData.reduce((acc, row) => acc + (row.currentStock || 0), 0);
      this.kpis = [
        { label: 'Total Stock Cost', val: '₹' + sumVal.toLocaleString('en-IN') },
        { label: 'Total Units', val: totalUnits }
      ];
    } else if (this.selectedReport === 'LOW_STOCK') {
      this.kpis = [
        { label: 'Critical Items', val: this.reportData.length }
      ];
    } else if (this.selectedReport === 'CUSTOMER_OUTSTANDING' || this.selectedReport === 'SUPPLIER_OUTSTANDING') {
      const total = this.reportData.reduce((acc, row) => acc + (row.outstanding || 0), 0);
      this.kpis = [
        { label: 'Total Outstanding', val: '₹' + total.toLocaleString('en-IN') },
        { label: 'Debtors Count', val: this.reportData.length }
      ];
    }
  }

  exportToCSV() {
    if (this.reportData.length === 0) return;
    
    const cols = this.getColumns();
    let csvContent = '\uFEFF'; // Add BOM for excel support

    // Headers
    csvContent += cols.map(c => `"${this.getColumnHeader(c)}"`).join(',') + '\n';
    
    // Rows
    this.reportData.forEach(row => {
      csvContent += cols.map(c => {
        let val = row[c];
        if (val === null || val === undefined) return '""';
        return `"${val.toString().replace(/"/g, '""')}"`;
      }).join(',') + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `${this.selectedReport.toLowerCase()}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  printReport() {
    window.print();
  }
}
