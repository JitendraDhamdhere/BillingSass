import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
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
  selector: 'app-customer-list',
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
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {
  data: any[] = [];
  displayedColumns: string[] = ['customerCode', 'name', 'mobile', 'status', 'actions'];
  totalElements = 0;
  pageSize = 20;
  pageIndex = 0;

  // Modal & Form State
  showModal = false;
  isEditMode = false;
  editCustomerId: number | null = null;
  form: FormGroup;
  isSaving = false;

  // Delete State
  showDeleteConfirm = false;
  deleteItemId: number | null = null;

  constructor(
    private customerService: CustomerService,
    public searchService: SearchService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      customerCode: [{ value: 'Auto Generated', disabled: true }],
      name: ['', Validators.required],
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
      item.customerCode?.toLowerCase().includes(query) || 
      item.mobile?.toLowerCase().includes(query) || 
      item.email?.toLowerCase().includes(query)
    );
  }

  loadData() {
    this.customerService.getAll(this.pageIndex, this.pageSize).subscribe(res => {
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
    this.editCustomerId = null;
    this.form.reset({
      customerCode: 'Auto Generated',
      name: '',
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

  openEditModal(customer: any) {
    this.isEditMode = true;
    this.editCustomerId = customer.id;
    this.form.patchValue({
      customerCode: customer.customerCode,
      name: customer.name,
      mobile: customer.mobile || '',
      email: customer.email || '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
      pincode: customer.pincode || '',
      gstNumber: customer.gstNumber || '',
      status: customer.status || 'ACTIVE'
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
    this.editCustomerId = null;
  }

  saveCustomer() {
    if (this.form.invalid || this.isSaving) return;
    this.isSaving = true;

    // getRawValue to include customerCode in payload
    const val = this.form.getRawValue();
    const req = this.isEditMode && this.editCustomerId !== null 
      ? this.customerService.update(this.editCustomerId, val) 
      : this.customerService.create(val);

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
        console.error('Save customer failed', err);
      }
    });
  }

  // Delete Handlers
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
    this.customerService.delete(this.deleteItemId).subscribe({
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
