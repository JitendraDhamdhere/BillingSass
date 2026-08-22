import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
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
  selector: 'app-category-list',
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
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {
  data: any[] = [];
  displayedColumns: string[] = ['name', 'description', 'status', 'actions'];
  totalElements = 0;
  pageSize = 20;
  pageIndex = 0;

  // Modal & Form State
  showModal = false;
  isEditMode = false;
  editCategoryId: number | null = null;
  form: FormGroup;
  isSaving = false;

  // Delete State
  showDeleteConfirm = false;
  deleteItemId: number | null = null;

  constructor(
    private categoryService: CategoryService,
    public searchService: SearchService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
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
      item.description?.toLowerCase().includes(query)
    );
  }

  loadData() {
    this.categoryService.getAll(this.pageIndex, this.pageSize).subscribe(res => {
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

  // Modal triggers
  openAddModal() {
    this.isEditMode = false;
    this.editCategoryId = null;
    this.form.reset({
      name: '',
      description: '',
      status: 'ACTIVE'
    });
    this.showModal = true;
  }

  openEditModal(category: any) {
    this.isEditMode = true;
    this.editCategoryId = category.id;
    this.form.patchValue({
      name: category.name,
      description: category.description || '',
      status: category.status || 'ACTIVE'
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
    this.editCategoryId = null;
  }

  saveCategory() {
    if (this.form.invalid || this.isSaving) return;
    this.isSaving = true;

    const val = this.form.value;
    const req = this.isEditMode && this.editCategoryId !== null 
      ? this.categoryService.update(this.editCategoryId, val) 
      : this.categoryService.create(val);

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
        console.error('Save failed', err);
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
    this.categoryService.delete(this.deleteItemId).subscribe({
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
