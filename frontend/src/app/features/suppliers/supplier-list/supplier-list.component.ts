import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupplierService } from '../../../core/services/supplier.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { SearchService } from '../../../core/services/search.service';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [CommonModule, RouterModule, MatTableModule, MatButtonModule, MatIconModule, MatPaginatorModule],
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {
  data: any[] = [];
  displayedColumns: string[] = ['supplierCode', 'name', 'companyName', 'mobile', 'status', 'actions'];
  totalElements = 0;
  pageSize = 20;
  pageIndex = 0;

  constructor(
    private supplierService: SupplierService,
    public searchService: SearchService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  get filteredData() {
    const query = this.searchService.searchQuery().toLowerCase().trim();
    if (!query) return this.data;
    return this.data.filter(item => 
      item.name?.toLowerCase().includes(query) || 
      item.supplierCode?.toLowerCase().includes(query) || 
      item.companyName?.toLowerCase().includes(query) || 
      item.mobile?.toLowerCase().includes(query)
    );
  }

  loadData() {
    this.supplierService.getAll(this.pageIndex, this.pageSize).subscribe(res => {
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
