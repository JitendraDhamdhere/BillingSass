import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

export interface ShopSettings {
  id: number;
  adminName: string;
  adminMobile: string;
  adminEmail: string;
  adminUsername: string;
  profileImage: string;
  shopName: string;
  ownerName: string;
  gstNumber: string;
  panNumber: string;
  registrationNumber: string;
  businessType: string;
  shopLogo: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  upiId: string;
  upiMerchantName: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  invoicePrefix: string;
  receiptPrefix: string;
  footerMessage: string;
  termsConditions: string;
  thankYouMessage: string;
  showLogo: boolean;
  showQr: boolean;
  showGst: boolean;
  showAddress: boolean;
  showMobile: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ShopSettingsService {
  private apiUrl = `${environment.apiUrl}/shop-settings`;
  
  private settingsSignal = signal<ShopSettings | null>(null);
  settings = this.settingsSignal.asReadonly();
  
  shopName = computed(() => this.settingsSignal()?.shopName || 'ShopBilling');
  shopLogo = computed(() => this.settingsSignal()?.shopLogo || '');

  constructor(private http: HttpClient) {}

  loadSettings(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.settingsSignal.set(res.data);
        }
      })
    );
  }

  updateSettings(data: any): Observable<any> {
    return this.http.put<any>(this.apiUrl, data).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.settingsSignal.set(res.data);
        }
      })
    );
  }

  uploadLogo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/upload-logo`, formData).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.settingsSignal.update(s => s ? { ...s, shopLogo: res.data } : null);
        }
      })
    );
  }

  uploadProfileImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.apiUrl}/upload-profile-image`, formData).pipe(
      tap(res => {
        if (res.success && res.data) {
          this.settingsSignal.update(s => s ? { ...s, profileImage: res.data } : null);
        }
      })
    );
  }

  changePassword(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/change-password`, data);
  }
}
