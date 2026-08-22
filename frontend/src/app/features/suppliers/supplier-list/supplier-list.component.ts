import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SupplierService } from '../../../core/services/supplier.service';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { SearchService } from '../../../core/services/search.service';

@Component({
  selector: 'app-supplier-list',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    MatTableModule, 
    MatButtonModule, 
    MatIconModule, 
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule
  ],
  templateUrl: './supplier-list.component.html',
  styleUrls: ['./supplier-list.component.css']
})
export class SupplierListComponent implements OnInit {
  data: any[] = [];
  displayedColumns: string[] = ['supplierCode', 'name', 'companyName', 'mobile', 'status', 'actions'];
  totalElements = 0;
  pageSize = 20;
  pageIndex = 0;

  // Modal & Form State
  showModal = false;
  isEditMode = false;
  editSupplierId: number | null = null;
  form: FormGroup;
  isSaving = false;

  // Delete State
  showDeleteConfirm = false;
  deleteItemId: number | null = null;

  constructor(
    private supplierService: SupplierService,
    public searchService: SearchService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      supplierCode: [{ value: 'Auto Generated', disabled: true }],
      name: ['', Validators.required],
      companyName: [''],
      mobile: ['', [Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.email]],
      address: [''],
      city: [''],
      state: [''],
      pincode: ['', [Validators.pattern('^[0-9]{6}$')]],
      gstNumber: ['', [Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]],
      status: ['ACTIVE', Validators.required]
    });
  }

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

  // Modal Handlers
  openAddModal() {
    this.isEditMode = false;
    this.editSupplierId = null;
    this.form.reset({
      supplierCode: 'Auto Generated',
      name: '',
      companyName: '',
      mobile: '',
      email: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      gstNumber: '',
      status: 'ACTIVE'
    });
    this.showModal = true;
  }

  openEditModal(supplier: any) {
    this.isEditMode = true;
    this.editSupplierId = supplier.id;
    this.form.patchValue({
      supplierCode: supplier.supplierCode,
      name: supplier.name,
      companyName: supplier.companyName || '',
      mobile: supplier.mobile || '',
      email: supplier.email || '',
      address: supplier.address || '',
      city: supplier.city || '',
      state: supplier.state || '',
      pincode: supplier.pincode || '',
      gstNumber: supplier.gstNumber || '',
      status: supplier.status || 'ACTIVE'
    });
    this.showModal = true;
  }

  closeModal() {
    if (this.form.dirty) {
      if (!confirm('You have unsaved changes. Are you sure you want to close?')) {
        return;
      }
    }
    this.showModal = false;
    this.editSupplierId = null;
  }

  saveSupplier() {
    if (this.form.invalid || this.isSaving) return;
    this.isSaving = true;

    // getRawValue to get supplierCode
    const val = this.form.getRawValue();
    const req = this.isEditMode && this.editSupplierId !== null 
      ? this.supplierService.update(this.editSupplierId, val) 
      : this.supplierService.create(val);

    req.subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.showModal = false;
          this.form.markAsPristine();
          this.loadData();
        }
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Save supplier failed', err);
      }
    });
  }

  // Delete Actions
  openDeleteConfirm(id: number) {
    this.deleteItemId = id;
    this.showDeleteConfirm = true;
  }

  closeDeleteConfirm() {
    this.deleteItemId = null;
    this.showDeleteConfirm = false;
  }

  confirmDelete() {
    if (this.deleteItemId === null) return;
    this.supplierService.delete(this.deleteItemId).subscribe({
      next: (res) => {
        this.closeDeleteConfirm();
        this.loadData();
      },
      error: (err) => {
        this.closeDeleteConfirm();
        console.error('Delete failed', err);
      }
    });
  }
}
