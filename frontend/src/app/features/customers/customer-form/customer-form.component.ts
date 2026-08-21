import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CustomerService } from '../../../core/services/customer.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-customer-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  itemId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: CustomerService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      'customerCode': [{ value: '', disabled: true }, []], 'name': [{ value: '', disabled: false }, Validators.required], 'mobile': [{ value: '', disabled: false }, []], 'email': [{ value: '', disabled: false }, []], 'address': [{ value: '', disabled: false }, []], 'city': [{ value: '', disabled: false }, []], 'state': [{ value: '', disabled: false }, []], 'pincode': [{ value: '', disabled: false }, []], 'gstNumber': [{ value: '', disabled: false }, []]
    });
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.itemId = +id;
      this.service.getById(this.itemId).subscribe(res => {
        if(res.success) this.form.patchValue(res.data);
      });
    } else {
      this.form.patchValue({ customerCode: 'CUST-AUTO' });
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    
    // getRawValue gets disabled fields as well if needed, but backend auto-generates it anyway.
    const val = this.form.getRawValue();
    
    const req = this.isEditMode 
      ? this.service.update(this.itemId!, val)
      : this.service.create(val);
      
    req.subscribe({
      next: (res) => {
        if (res.success) this.router.navigate(['/customers']);
      },
      error: (err) => {
        console.error('Operation failed', err);
      }
    });
  }
}
