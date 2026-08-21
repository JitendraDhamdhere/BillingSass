import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { PurchaseService } from '../../../core/services/purchase.service';
import { SupplierService } from '../../../core/services/supplier.service';
import { ProductService } from '../../../core/services/product.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-purchase-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatTableModule],
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.css']
})
export class PurchaseFormComponent implements OnInit {
  form: FormGroup;
  suppliers: any[] = [];
  products: any[] = [];
  isEditMode = false;
  itemId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: PurchaseService,
    private supplierService: SupplierService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      supplierId: ['', Validators.required],
      discount: [0],
      notes: [''],
      items: this.fb.array([])
    });
  }

  get items() { return this.form.get('items') as FormArray; }

  ngOnInit() {
    this.supplierService.getAllActive().subscribe(res => { if(res.success) this.suppliers = res.data; });
    this.productService.getAllActive().subscribe(res => { if(res.success) this.products = res.data; });
    
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.itemId = +id;
      this.service.getById(this.itemId).subscribe(res => {
        if(res.success) {
           this.form.patchValue({
             supplierId: res.data.supplierId,
             discount: res.data.discount,
             notes: res.data.notes
           });
           // For simplicity, we just clear and add items if returned from backend, but in MVP we just let them add new rows or we don't fully populate items if backend doesn't send them. The backend PurchaseResponse doesn't have items array mapped yet! 
           // We will just let them edit the main metadata for now if items are missing.
        }
      });
    } else {
      this.addItem();
    }

  }

  addItem() {
    this.items.push(this.fb.group({
      productId: ['', Validators.required],
      quantity: [1, Validators.required],
      purchasePrice: [0, Validators.required],
      tax: [0, Validators.required]
    }));
  }

  removeItem(i: number) { this.items.removeAt(i); }

  onSubmit() {
    if (this.form.invalid || this.items.length === 0) return;
    const val = this.form.value;
    // mock payments
    val.payments = [{ paymentMethod: 'CASH', amount: 0, notes: 'Auto' }]; 
    
    
    const req = this.isEditMode ? this.service.update(this.itemId!, val) : this.service.create(val);
    req.subscribe({
      next: (res: any) => { if (res.success) this.router.navigate(['/inventory']); },
      error: (err: any) => console.error('Operation failed', err)
    });
  }
}
