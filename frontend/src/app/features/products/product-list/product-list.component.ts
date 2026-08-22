import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
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
import { ToastService } from '../../../core/services/toast.service';

function priceValidator(g: FormGroup) {
  const purchase = g.get('purchasePrice')?.value;
  const selling = g.get('sellingPrice')?.value;
  if (purchase === null || purchase === undefined || purchase === '' ||
      selling === null || selling === undefined || selling === '') {
    return null;
  }
  return parseFloat(selling) < parseFloat(purchase) ? { priceError: true } : null;
}

@Component({
  selector: 'app-product-list',
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
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  data: any[] = [];
  displayedColumns: string[] = ['image', 'productCode', 'name', 'sellingPrice', 'currentStock', 'status', 'actions'];
  totalElements = 0;
  pageSize = 20;
  pageIndex = 0;

  // Modal & Form State
  showModal = false;
  isEditMode = false;
  editProductId: number | null = null;
  form: FormGroup;
  isSaving = false;

  // Dropdown options
  categories: any[] = [];
  brands: any[] = [];

  // Delete State
  showDeleteConfirm = false;
  deleteItemId: number | null = null;

  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    public searchService: SearchService,
    private fb: FormBuilder,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      productCode: [{ value: 'Auto Generated', disabled: true }],
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      brandId: ['', Validators.required],
      unit: ['', Validators.required],
      purchasePrice: ['', [Validators.required, Validators.min(0)]],
      sellingPrice: ['', [Validators.required, Validators.min(0)]],
      taxPercentage: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      minimumStock: ['', [Validators.required, Validators.min(0)]],
      image: [''],
      status: ['ACTIVE', Validators.required]
    }, { validators: priceValidator });
  }

  ngOnInit(): void {
    this.loadData();
    this.loadSelectors();
  }

  loadSelectors() {
    this.categoryService.getAllActive().subscribe(res => { if (res.success) this.categories = res.data; });
    this.brandService.getAllActive().subscribe(res => { if (res.success) this.brands = res.data; });
  }

  get filteredData() {
    const query = this.searchService.searchQuery().toLowerCase().trim();
    if (!query) return this.data;
    return this.data.filter(item => 
      item.name?.toLowerCase().includes(query) || 
      item.productCode?.toLowerCase().includes(query) || 
      item.barcode?.toLowerCase().includes(query)
    );
  }

  loadData() {
    this.productService.getAll(this.pageIndex, this.pageSize).subscribe(res => {
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

  // File Upload Handlers
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        this.toastService.error('File size exceeds the 2MB limit.');
        return;
      }
      if (!file.type.startsWith('image/')) {
        this.toastService.error('Please upload a valid image file.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.form.patchValue({ image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  clearImage() {
    this.form.patchValue({ image: '' });
  }

  // Modal Handlers
  openAddModal() {
    this.isEditMode = false;
    this.editProductId = null;
    this.form.reset({
      productCode: 'Auto Generated',
      name: '',
      categoryId: '',
      brandId: '',
      unit: '',
      purchasePrice: '',
      sellingPrice: '',
      taxPercentage: '',
      minimumStock: '',
      image: '',
      status: 'ACTIVE'
    });
    this.showModal = true;
  }

  openEditModal(product: any) {
    this.isEditMode = true;
    this.editProductId = product.id;
    this.form.patchValue({
      productCode: product.productCode,
      name: product.name,
      categoryId: product.categoryId,
      brandId: product.brandId,
      unit: product.unit,
      purchasePrice: product.purchasePrice,
      sellingPrice: product.sellingPrice,
      taxPercentage: product.taxPercentage,
      minimumStock: product.minimumStock,
      image: product.image || '',
      status: product.status || 'ACTIVE'
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
    this.editProductId = null;
  }

  saveProduct() {
    if (this.form.invalid || this.isSaving) return;
    this.isSaving = true;

    // getRawValue to include productCode
    const val = this.form.getRawValue();
    const req = this.isEditMode && this.editProductId !== null 
      ? this.productService.update(this.editProductId, val) 
      : this.productService.create(val);

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
        console.error('Save product failed', err);
      }
    });
  }

  // Delete Action Handlers
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
    this.productService.delete(this.deleteItemId).subscribe({
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
