import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { CategoryService } from '../../../core/services/category.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  itemId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: CategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      'name': ['', Validators.required], 'description': ['', []]
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
    }
  }

  onSubmit() {
    if (this.form.invalid) return;
    
    // Clean up numeric fields if necessary
    const val = this.form.value;
    
    const req = this.isEditMode 
      ? this.service.update(this.itemId!, val)
      : this.service.create(val);
      
    req.subscribe({
      next: (res) => {
        if (res.success) this.router.navigate(['/categories']);
      },
      error: (err) => {
        console.error('Operation failed', err);
      }
    });
  }
}
