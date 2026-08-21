import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { BrandService } from '../../../core/services/brand.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './brand-form.component.html',
  styleUrls: ['./brand-form.component.css']
})
export class BrandFormComponent implements OnInit {
  form: FormGroup;
  isEditMode = false;
  itemId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private service: BrandService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      'name': ['', Validators.required],
      'description': ['']
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
    const req = this.isEditMode ? this.service.update(this.itemId!, this.form.value) : this.service.create(this.form.value);
    req.subscribe({
      next: (res) => { if (res.success) this.router.navigate(['/brands']); },
      error: (err) => console.error('Operation failed', err)
    });
  }
}
