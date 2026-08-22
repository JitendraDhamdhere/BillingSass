import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchaseService } from '../../../core/services/purchase.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SearchService } from '../../../core/services/search.service';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule, MatPaginatorModule],
  template: `
    <div class="page-header">
      <h2>Purchase Orders (Inventory)</h2>
      <button mat-flat-button color="primary" routerLink="new"><mat-icon>add</mat-icon> New Purchase</button>
    </div>
    <div class="glass-card table-container">
      <div class="table-scroll">
        <table mat-table [dataSource]="filteredData" class="custom-table" style="width:100%; background:transparent;">
          <ng-container matColumnDef="poNumber">
            <th mat-header-cell *matHeaderCellDef> PO Number </th>
            <td mat-cell *matCellDef="let element"> {{element.purchaseNumber}} </td>
          </ng-container>
          <ng-container matColumnDef="supplier">
            <th mat-header-cell *matHeaderCellDef> Supplier </th>
            <td mat-cell *matCellDef="let element"> {{element.supplierName}} </td>
          </ng-container>
          <ng-container matColumnDef="date">
            <th mat-header-cell *matHeaderCellDef> Date </th>
            <td mat-cell *matCellDef="let element"> {{element.purchaseDate | date}} </td>
          </ng-container>
          <ng-container matColumnDef="grandTotal">
            <th mat-header-cell *matHeaderCellDef> Grand Total </th>
            <td mat-cell *matCellDef="let element"> ₹{{element.grandTotal | number:'1.2-2'}} </td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Payment Status </th>
            <td mat-cell *matCellDef="let element">
              <span class="status-badge" [class.success]="element.paymentStatus === 'PAID'">
                {{element.paymentStatus}}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let element">
              <button mat-icon-button color="primary" [routerLink]="[element.id, 'edit']"><mat-icon>edit</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="['poNumber', 'supplier', 'date', 'grandTotal', 'status', 'actions']; sticky: true"></tr>
          <tr mat-row *matRowDef="let row; columns: ['poNumber', 'supplier', 'date', 'grandTotal', 'status', 'actions'];"></tr>
        </table>
      </div>
      
      <mat-paginator 
        [length]="totalElements"
        [pageSize]="pageSize"
        [pageSizeOptions]="[10, 20, 50]"
        (page)="onPageChange($event)">
      </mat-paginator>
    </div>
  `,
  styles: [`
    .page-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
    .page-header h2 { margin: 0; font-size: 24px; }
    .table-container { 
      background: var(--surface);
      border-radius: var(--radius-lg);
      box-shadow: var(--shadow-sm);
      border: 1px solid var(--border);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .table-scroll {
      overflow: auto;
      max-height: calc(100vh - 260px);
    }
    .custom-table { width: 100%; background: transparent; }
    ::ng-deep .mat-mdc-header-cell { 
      color: var(--text-muted); 
      background: var(--surface) !important;
      z-index: 100 !important;
    }
    ::ng-deep .mat-mdc-cell { color: var(--text-light); }
    .status-badge { padding: 4px 8px; border-radius: 4px; font-size: 12px; background: rgba(255,255,255,0.1); }
    .status-badge.success { background: rgba(46, 213, 115, 0.2); color: #2ed573; }
  `]
})
export class PurchaseListComponent implements OnInit {
  data: any[] = [];
  totalElements = 0;
  pageSize = 20;
  pageIndex = 0;

  constructor(
    private purchaseService: PurchaseService,
    public searchService: SearchService
  ) {}
  
  ngOnInit() { this.loadData(); }

  get filteredData() {
    const query = this.searchService.searchQuery().toLowerCase().trim();
    if (!query) return this.data;
    return this.data.filter(item => 
      item.purchaseNumber?.toLowerCase().includes(query) || 
      item.supplierName?.toLowerCase().includes(query)
    );
  }

  loadData() {
    this.purchaseService.getAll(this.pageIndex, this.pageSize).subscribe(res => {
      if(res.success) {
        this.data = res.data;
        this.totalElements = res.totalElements;
      }
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadData();
  }
}
