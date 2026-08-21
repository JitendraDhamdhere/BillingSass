import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { ProductService } from '../../../core/services/product.service';
import { CategoryService } from '../../../core/services/category.service';
import { BrandService } from '../../../core/services/brand.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  itemId: number | null = null;
  categories: any[] = [];
  brands: any[] = [];

  constructor(
    private fb: FormBuilder,
    private service: ProductService,
    private categoryService: CategoryService,
    private brandService: BrandService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      'productCode': [{ value: '', disabled: true }],
      'name': ['', Validators.required],
      'categoryId': ['', Validators.required],
      'brandId': ['', Validators.required],
      'unit': ['', Validators.required],
      'purchasePrice': ['', Validators.required],
      'sellingPrice': ['', Validators.required],
      'taxPercentage': ['', Validators.required],
      'minimumStock': ['', Validators.required],
      'image': ['']
    });
  }

  ngOnInit() {
    this.categoryService.getAllActive().subscribe(res => { if (res.success) this.categories = res.data; });
    this.brandService.getAllActive().subscribe(res => { if (res.success) this.brands = res.data; });

    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.itemId = +id;
      this.service.getById(this.itemId).subscribe(res => {
        if(res.success) this.form.patchValue(res.data);
      });
    } else {
      this.form.patchValue({ productCode: 'PROD-AUTO' });
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
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

  onSubmit() {
    if (this.form.invalid) return;
    const val = this.form.getRawValue();
    const req = this.isEditMode ? this.service.update(this.itemId!, val) : this.service.create(val);
      
    req.subscribe({
      next: (res) => { if (res.success) this.router.navigate(['/products']); },
      error: (err) => console.error('Operation failed', err)
    });
  }
}
