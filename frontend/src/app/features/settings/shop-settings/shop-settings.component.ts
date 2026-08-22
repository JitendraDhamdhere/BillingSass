import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ShopSettingsService, ShopSettings } from '../../../core/services/shop-settings.service';
import { ToastService } from '../../../core/services/toast.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-shop-settings',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule
  ],
  templateUrl: './shop-settings.component.html',
  styleUrls: ['./shop-settings.component.css']
})
export class ShopSettingsComponent implements OnInit {
  form: FormGroup;
  passwordForm: FormGroup;
  activeTab = 'profile';
  isLoading = false;
  isSaving = false;
  showPasswordModal = false;

  qrCodeUrl = '';

  constructor(
    private fb: FormBuilder,
    public settingsService: ShopSettingsService,
    private toastService: ToastService
  ) {
    this.form = this.fb.group({
      adminName: ['', Validators.required],
      adminMobile: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      adminEmail: ['', [Validators.required, Validators.email]],
      adminUsername: ['', Validators.required],
      
      shopName: ['', Validators.required],
      ownerName: [''],
      gstNumber: ['', [Validators.pattern('^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$')]],
      panNumber: ['', [Validators.pattern('^[A-Z]{5}[0-9]{4}[A-Z]{1}$')]],
      registrationNumber: [''],
      businessType: ['Retail'],

      addressLine1: [''],
      addressLine2: [''],
      city: [''],
      state: [''],
      country: ['India'],
      pincode: ['', [Validators.pattern('^[0-9]{6}$')]],

      upiId: [''],
      upiMerchantName: [''],
      bankName: [''],
      accountHolderName: [''],
      accountNumber: [''],
      ifscCode: [''],

      invoicePrefix: ['INV-'],
      receiptPrefix: ['REC-'],
      footerMessage: [''],
      termsConditions: [''],
      thankYouMessage: ['Thank you for shopping with us!'],

      showLogo: [true],
      showQr: [true],
      showGst: [true],
      showAddress: [true],
      showMobile: [true]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    this.form.get('upiId')?.valueChanges.subscribe(() => this.updateQrCode());
    this.form.get('upiMerchantName')?.valueChanges.subscribe(() => this.updateQrCode());
  }

  passwordMatchValidator(g: FormGroup) {
    const newPwd = g.get('newPassword')?.value;
    const confirmPwd = g.get('confirmPassword')?.value;
    return newPwd === confirmPwd ? null : { passwordMismatch: true };
  }

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings() {
    this.isLoading = true;
    this.settingsService.loadSettings().subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.success && res.data) {
          const settings: ShopSettings = res.data;
          this.form.patchValue(settings);
          this.updateQrCode();
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Failed to load settings', err);
      }
    });
  }

  updateQrCode() {
    const upiId = this.form.get('upiId')?.value;
    const merchantName = this.form.get('upiMerchantName')?.value || 'ShopBilling';
    if (upiId) {
      const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}`;
      this.qrCodeUrl = `https://chart.googleapis.com/chart?chs=220x220&cht=qr&chl=${encodeURIComponent(upiUrl)}`;
    } else {
      this.qrCodeUrl = '';
    }
  }

  onLogoSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.uploadLogoFile(file);
    }
  }

  onLogoDropped(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      this.uploadLogoFile(file);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  uploadLogoFile(file: File) {
    if (file.size > 2 * 1024 * 1024) {
      this.toastService.error('Logo size must not exceed 2MB.');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      this.toastService.error('Only JPG, PNG and WEBP formats are supported.');
      return;
    }

    this.settingsService.uploadLogo(file).subscribe({
      error: (err) => console.error('Logo upload failed', err)
    });
  }

  removeLogo() {
    if (confirm('Are you sure you want to remove the logo?')) {
      this.settingsService.uploadLogo({} as File).subscribe({
        error: () => {
          // If empty payload fails in upload API, we update logo manually via service
          this.settingsService.updateSettings({ ...this.form.value, shopLogo: '' }).subscribe({
            next: () => {
              this.toastService.success('Logo removed.');
              this.loadSettings();
            }
          });
        }
      });
    }
  }

  onProfileImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        this.toastService.error('Profile picture size must not exceed 2MB.');
        return;
      }
      this.settingsService.uploadProfileImage(file).subscribe({
        error: (err) => console.error('Profile image upload failed', err)
      });
    }
  }

  removeProfileImage() {
    if (confirm('Are you sure you want to remove your profile picture?')) {
      this.settingsService.updateSettings({ ...this.form.value, profileImage: '' }).subscribe({
        next: () => {
          this.toastService.success('Profile picture removed.');
          this.loadSettings();
        }
      });
    }
  }

  saveSettings() {
    if (this.form.invalid || this.isSaving) return;
    this.isSaving = true;

    this.settingsService.updateSettings(this.form.value).subscribe({
      next: (res) => {
        this.isSaving = false;
        if (res.success) {
          this.form.markAsPristine();
        }
      },
      error: (err) => {
        this.isSaving = false;
        console.error('Update settings failed', err);
      }
    });
  }

  resetForm() {
    if (confirm('Are you sure you want to discard your changes?')) {
      this.loadSettings();
    }
  }

  openPasswordModal() {
    this.passwordForm.reset();
    this.showPasswordModal = true;
  }

  closePasswordModal() {
    this.showPasswordModal = false;
  }

  changePassword() {
    if (this.passwordForm.invalid) return;

    this.settingsService.changePassword(this.passwordForm.value).subscribe({
      next: (res) => {
        if (res.success) {
          this.closePasswordModal();
        }
      },
      error: (err) => {
        console.error('Change password failed', err);
      }
    });
  }
}
