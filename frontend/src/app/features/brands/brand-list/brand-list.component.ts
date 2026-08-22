import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrandService } from '../../../core/services/brand.service';
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
  selector: 'app-brand-list',
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
  template: `
    <div class="page-header" style="display:flex; justify-content:space-between; margin-bottom:20px;">
      <div>
        <h2 style="margin:0;">Brands</h2>
        <p style="color: var(--text-muted); font-size: 13px; margin: 2px 0 0 0;">Manage your product brands, status, and descriptions.</p>
      </div>
      <button mat-flat-button color="primary" (click)="openAddModal()"><mat-icon>add</mat-icon> Add Brand</button>
    </div>
    
    <div class="glass-card table-container">
      <div class="table-scroll">
        <table mat-table [dataSource]="filteredData" style="width:100%; background:transparent;">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef> Name </th>
            <td mat-cell *matCellDef="let e"> {{e.name}} </td>
          </ng-container>
          <ng-container matColumnDef="desc">
            <th mat-header-cell *matHeaderCellDef> Description </th>
            <td mat-cell *matCellDef="let e"> {{e.description}} </td>
          </ng-container>
          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef> Status </th>
            <td mat-cell *matCellDef="let e">
              <span class="status-badge" [class.success]="e.status === 'ACTIVE'">
                {{e.status || 'ACTIVE'}}
              </span>
            </td>
          </ng-container>
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef> Actions </th>
            <td mat-cell *matCellDef="let e">
              <button mat-icon-button color="primary" (click)="openEditModal(e)"><mat-icon>edit</mat-icon></button>
              <button mat-icon-button color="warn" (click)="openDeleteConfirm(e.id)"><mat-icon>delete</mat-icon></button>
            </td>
          </ng-container>
          <tr mat-header-row *matHeaderRowDef="['name', 'desc', 'status', 'actions']; sticky: true"></tr>
          <tr mat-row *matRowDef="let row; columns: ['name', 'desc', 'status', 'actions'];"></tr>
        </table>
      </div>
      <mat-paginator 
        [length]="totalElements"
        [pageSize]="pageSize"
        [pageSizeOptions]="[10, 20, 50]"
        (page)="onPageChange($event)">
      </mat-paginator>
    </div>

    <!-- Add/Edit Brand Modal -->
    <div class="modal-backdrop" *ngIf="showModal" (click)="closeModal()">
      <div class="glass-modal modal-content" (click)="$event.stopPropagation()" style="max-width: 400px;">
        <div class="modal-header">
          <div>
            <h2 style="margin: 0;">{{ isEditMode ? 'Edit Brand' : 'Add Brand' }}</h2>
            <p style="color: var(--text-muted); font-size: 11px; margin: 2px 0 0 0;">Enter brand name, description, and status.</p>
          </div>
          <button mat-icon-button (click)="closeModal()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        
        <form [formGroup]="form" (ngSubmit)="saveBrand()">
          <div class="modal-body" style="background: transparent; border: none; box-shadow: none; padding: 12px 0; overflow-y: visible;">
            <mat-form-field appearance="outline" class="full-width" style="margin-bottom: 12px; width: 100%;" subscriptSizing="dynamic">
              <mat-label>Brand Name *</mat-label>
              <input matInput formControlName="name" placeholder="Enter brand name" required />
            </mat-form-field>
            <div *ngIf="form.get('name')?.touched && form.get('name')?.invalid" style="color: var(--warning); font-size: 11px; margin: -8px 0 8px 4px;">
              Brand Name is required.
            </div>

            <mat-form-field appearance="outline" class="full-width" style="margin-bottom: 12px; width: 100%;" subscriptSizing="dynamic">
              <mat-label>Description</mat-label>
              <textarea matInput formControlName="description" placeholder="Enter description" rows="3"></textarea>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width" style="margin-bottom: 12px; width: 100%;" subscriptSizing="dynamic">
              <mat-label>Status *</mat-label>
              <mat-select formControlName="status" required>
                <mat-option value="ACTIVE">ACTIVE</mat-option>
                <mat-option value="INACTIVE">INACTIVE</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
          
          <div class="modal-actions" style="margin-top: 12px; border-top: 1px solid var(--border); padding-top: 12px; gap: 8px;">
            <button type="button" mat-button (click)="closeModal()">Cancel</button>
            <button type="submit" mat-flat-button color="primary" [disabled]="form.invalid || isSaving">
              <span *ngIf="!isSaving">Save Brand</span>
              <span *ngIf="isSaving">Saving...</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div class="modal-backdrop" *ngIf="showDeleteConfirm" (click)="closeDeleteConfirm()">
      <div class="glass-modal modal-content" (click)="$event.stopPropagation()" style="max-width: 400px; text-align: center;">
        <div class="modal-header" style="border-bottom: none; padding-bottom: 0;">
          <h2 style="color: var(--danger); font-size: 18px; width: 100%; text-align: center; margin: 0;">Confirm Delete</h2>
        </div>
        <div class="modal-body" style="padding: 16px 24px; text-align: center; color: var(--text-secondary); background: transparent; border: none; box-shadow: none;">
          <p style="margin: 0; font-size: 14px;">Are you sure you want to delete this brand?</p>
          <p style="font-size: 12px; margin: 8px 0 0 0; color: var(--text-muted);">
            If it is in use by products, it will be disabled (set to INACTIVE) instead to preserve database integrity.
          </p>
        </div>
        <div class="modal-actions" style="border-top: none; justify-content: center; padding-top: 0; gap: 12px; margin-top: 8px;">
          <button mat-button (click)="closeDeleteConfirm()">Cancel</button>
          <button mat-flat-button color="warn" (click)="confirmDelete()">Delete</button>
        </div>
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
      max-height: calc(100vh - 260px);
    }
    ::ng-deep .mat-mdc-header-cell {
      background: var(--surface) !important;
      z-index: 100 !important;
    }
    ::ng-deep .mat-mdc-paginator {
      background: transparent;
      border-top: 1px solid var(--border);
    }
  `]
})
export class BrandListComponent implements OnInit {
  data: any[] = [];
  totalElements = 0;
  pageSize = 20;
  pageIndex = 0;

  // Modal & Form State
  showModal = false;
  isEditMode = false;
  editBrandId: number | null = null;
  form: FormGroup;
  isSaving = false;

  // Delete State
  showDeleteConfirm = false;
  deleteItemId: number | null = null;

  constructor(
    private srv: BrandService,
    public searchService: SearchService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      status: ['ACTIVE', Validators.required]
    });
  }
  
  ngOnInit() { this.loadData(); }

  loadData() {
    this.srv.getAll(this.pageIndex, this.pageSize).subscribe(res => {
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

  get filteredData() {
    const query = this.searchService.searchQuery().toLowerCase().trim();
    if (!query) return this.data;
    return this.data.filter(item => 
      item.name?.toLowerCase().includes(query) || 
      item.description?.toLowerCase().includes(query)
    );
  }

  // Modal Handlers
  openAddModal() {
    this.isEditMode = false;
    this.editBrandId = null;
    this.form.reset({
      name: '',
      description: '',
      status: 'ACTIVE'
    });
    this.showModal = true;
  }

  openEditModal(brand: any) {
    this.isEditMode = true;
    this.editBrandId = brand.id;
    this.form.patchValue({
      name: brand.name,
      description: brand.description || '',
      status: brand.status || 'ACTIVE'
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
    this.editBrandId = null;
  }

  saveBrand() {
    if (this.form.invalid || this.isSaving) return;
    this.isSaving = true;

    const val = this.form.value;
    const req = this.isEditMode && this.editBrandId !== null 
      ? this.srv.update(this.editBrandId, val) 
      : this.srv.create(val);

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
        console.error('Save brand failed', err);
      }
    });
  }

  // Delete Action
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
    this.srv.delete(this.deleteItemId).subscribe({
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
