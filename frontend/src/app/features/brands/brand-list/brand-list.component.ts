import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrandService } from '../../../core/services/brand.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SearchService } from '../../../core/services/search.service';

@Component({
  selector: 'app-brand-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <div class="page-header" style="display:flex; justify-content:space-between; margin-bottom:20px;">
      <h2>Brands</h2>
      <button mat-flat-button color="primary" routerLink="new"><mat-icon>add</mat-icon> Add Brand</button>
    </div>
    <div class="glass-card table-container">
      <div class="table-scroll">
        <table mat-table [dataSource]="filteredData" style="width:100%; background:transparent;">
          <ng-container matColumnDef="name"><th mat-header-cell *matHeaderCellDef> Name </th><td mat-cell *matCellDef="let e"> {{e.name}} </td></ng-container>
          <ng-container matColumnDef="desc"><th mat-header-cell *matHeaderCellDef> Description </th><td mat-cell *matCellDef="let e"> {{e.description}} </td></ng-container>
          <ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let e">
              <button mat-icon-button color="primary" [routerLink]="[e.id, 'edit']"><mat-icon>edit</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="['name', 'desc', 'actions']; sticky: true"></tr>
          <tr mat-row *matRowDef="let row; columns: ['name', 'desc', 'actions'];"></tr>
        </table>
      </div>
    </div>
  `,
  styles: [`
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
      max-height: 50vh;
    }
    ::ng-deep .mat-mdc-header-cell {
      background: var(--surface) !important;
      z-index: 100 !important;
    }
  `]
})
export class BrandListComponent implements OnInit {
  data: any[] = [];
  constructor(
    private srv: BrandService,
    public searchService: SearchService
  ) {}
  
  ngOnInit() { this.srv.getAll().subscribe(res => { if(res.success) this.data = res.data; }); }

  get filteredData() {
    const query = this.searchService.searchQuery().toLowerCase().trim();
    if (!query) return this.data;
    return this.data.filter(item => 
      item.name?.toLowerCase().includes(query) || 
      item.description?.toLowerCase().includes(query)
    );
  }
}
