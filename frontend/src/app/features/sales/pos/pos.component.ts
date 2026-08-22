import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { SaleService } from '../../../core/services/sale.service';
import { CustomerService } from '../../../core/services/customer.service';
import { ToastService } from '../../../core/services/toast.service';
import { PaymentService, PaymentItem, PaymentTally } from '../../../core/services/payment.service';
import { ShopSettingsService } from '../../../core/services/shop-settings.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

@Component({
  selector: 'app-pos',
  standalone: true,
  imports: [
    CommonModule, FormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatIconModule, MatTableModule,
    MatAutocompleteModule
  ],
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit {
  searchQuery = '';
  products: any[] = [];
  cart: any[] = [];
  autocompleteSuggestions: any[] = [];
  
  // Customer variables
  customers: any[] = [];
  customerSearchQuery = '';
  selectedCustomer: any = null;
  customerSuggestions: any[] = [];

  // Quick Customer variables
  showQuickCustomerModal = false;
  quickCustomerName = '';
  quickCustomerMobile = '';
  quickCustomerEmail = '';

  showPrintInvoiceModal = false;
  completedSaleId: number | null = null;

  discount = 0;
  taxPercentage = 0;

  // Payment Modal variables
  showPaymentModal = false;
  payments: PaymentItem[] = [];
  activeMethod: 'CASH' | 'UPI' | 'CARD' = 'CASH';
  paymentTally: PaymentTally = { totalPaid: 0, remaining: 0, changeDue: 0 };
  paymentError = '';

  // Cash method inputs
  cashAmount = 0;
  cashTendered: number | null = null;
  cashChangeDue = 0;

  // UPI method inputs
  upiAmount = 0;
  upiRef = '';
  upiStatus: 'pending' | 'success' | 'failed' = 'pending';
  upiTimerId: any = null;

  // Card method inputs
  cardAmount = 0;
  cardTerminalRef = '';
  cardApprovalCode = '';
  cardLast4 = '';

  constructor(
    private productService: ProductService,
    private saleService: SaleService,
    private customerService: CustomerService,
    private toastService: ToastService,
    private paymentService: PaymentService,
    public settingsService: ShopSettingsService
  ) {}

  ngOnInit() {
    this.productService.getAllActive().subscribe(res => {
      if (res.success) this.products = res.data;
    });

    this.customerService.getAllActive().subscribe(res => {
      if (res.success) this.customers = res.data;
    });
  }

  get filteredProducts() {
    if (!this.searchQuery) return this.products;
    const q = this.searchQuery.toLowerCase();
    return this.products.filter(p => 
      p.name?.toLowerCase().includes(q) || 
      p.productCode?.toLowerCase().includes(q) || 
      p.barcode?.toLowerCase().includes(q)
    );
  }

  onSearchChange() {
    if (!this.searchQuery) {
      this.autocompleteSuggestions = [];
      return;
    }
    const q = this.searchQuery.toLowerCase();
    this.autocompleteSuggestions = this.products.filter(p => 
      p.name?.toLowerCase().includes(q) || 
      p.productCode?.toLowerCase().includes(q) || 
      p.barcode?.toLowerCase().includes(q)
    );
  }

  onProductSelected(event: any) {
    const selectedProductName = event.option.value;
    const product = this.products.find(p => p.name === selectedProductName);
    if (product) {
      this.addToCart(product);
    }
    this.searchQuery = '';
    this.autocompleteSuggestions = [];
  }

  onSearchEnter(event: any) {
    event.preventDefault();
    if (this.autocompleteSuggestions.length === 1) {
      this.addToCart(this.autocompleteSuggestions[0]);
      this.searchQuery = '';
      this.autocompleteSuggestions = [];
    }
  }

  // Customer search actions
  onCustomerSearchChange() {
    if (!this.customerSearchQuery) {
      this.customerSuggestions = [];
      return;
    }
    const q = this.customerSearchQuery.toLowerCase();
    this.customerSuggestions = this.customers.filter(c => 
      c.name?.toLowerCase().includes(q) || 
      c.mobile?.toLowerCase().includes(q) || 
      c.email?.toLowerCase().includes(q)
    );
  }

  onCustomerSelected(event: any) {
    const selectedName = event.option.value;
    const customer = this.customers.find(c => c.name === selectedName);
    if (customer) {
      this.selectedCustomer = customer;
    }
    this.customerSearchQuery = '';
    this.customerSuggestions = [];
  }

  onCustomerSearchEnter(event: any) {
    if (!this.customerSearchQuery) return;
    event.preventDefault();

    const q = this.customerSearchQuery.trim();
    const exactMatch = this.customers.find(c => c.name?.toLowerCase() === q.toLowerCase());
    if (exactMatch) {
      this.selectedCustomer = exactMatch;
      this.customerSearchQuery = '';
      this.customerSuggestions = [];
      return;
    }

    if (this.customerSuggestions.length === 1) {
      this.selectedCustomer = this.customerSuggestions[0];
      this.customerSearchQuery = '';
      this.customerSuggestions = [];
      return;
    }

    this.quickCustomerName = q;
    this.customerSearchQuery = '';
    this.customerSuggestions = [];
    this.showQuickCustomerModal = true;
  }

  removeSelectedCustomer() {
    this.selectedCustomer = null;
  }

  saveQuickCustomer() {
    if (!this.quickCustomerName) return;
    const newCust = {
      customerCode: 'CUST-' + Date.now(),
      name: this.quickCustomerName,
      mobile: this.quickCustomerMobile,
      email: this.quickCustomerEmail,
      status: 'ACTIVE'
    };
    this.customerService.create(newCust).subscribe(res => {
      if (res.success) {
        const created = res.data;
        this.customers.push(created);
        this.selectedCustomer = created;
        
        // Reset form
        this.quickCustomerName = '';
        this.quickCustomerMobile = '';
        this.quickCustomerEmail = '';
        this.showQuickCustomerModal = false;
      }
    });
  }

  addToCart(product: any) {
    const existing = this.cart.find(item => item.product.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.cart.push({ product, quantity: 1, discount: 0 });
    }
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  getSubtotal(): number {
    return this.cart.reduce((sum, item) => sum + (item.product.sellingPrice * item.quantity), 0);
  }

  getTax(): number {
    return (this.getSubtotal() - this.discount) * (this.taxPercentage / 100);
  }

  getGrandTotal(): number {
    return this.getSubtotal() - this.discount + this.getTax();
  }

  checkout() {
    this.openPaymentModal();
  }

  // Payment Collection methods
  openPaymentModal() {
    if (this.cart.length === 0) return;
    this.payments = [];
    this.showPaymentModal = true;
    this.updateTally();
    this.selectPaymentMethod('CASH');
  }

  closePaymentModal() {
    if (this.payments.length > 0) {
      if (!confirm('You have entered payments. Are you sure you want to cancel and close?')) {
        return;
      }
    }
    this.resetPaymentState();
    this.showPaymentModal = false;
  }

  resetPaymentState() {
    this.payments = [];
    if (this.upiTimerId) {
      clearTimeout(this.upiTimerId);
      this.upiTimerId = null;
    }
    this.paymentError = '';
  }

  selectPaymentMethod(method: 'CASH' | 'UPI' | 'CARD') {
    this.activeMethod = method;
    this.paymentError = '';
    const rem = this.paymentTally.remaining;

    if (method === 'CASH') {
      this.cashAmount = rem;
      this.cashTendered = rem;
      this.cashChangeDue = 0;
    } else if (method === 'UPI') {
      this.upiAmount = rem;
      this.upiRef = '';
      this.upiStatus = 'pending';
    } else if (method === 'CARD') {
      this.cardAmount = rem;
      this.cardTerminalRef = '';
      this.cardApprovalCode = '';
      this.cardLast4 = '';
    }
  }

  updateCashChange() {
    this.paymentError = '';
    const val = this.paymentService.validatePayment(
      'CASH',
      this.cashAmount,
      this.paymentTally.remaining,
      this.cashTendered !== null ? this.cashTendered : undefined
    );
    if (!val.isValid) {
      this.cashChangeDue = 0;
      this.paymentError = val.error || '';
    } else {
      this.cashChangeDue = val.changeDue || 0;
    }
  }

  markUpiAsPaid() {
    this.upiStatus = 'success';
    this.upiRef = 'UPI-TXN-' + Math.floor(100000 + Math.random() * 900000);
    this.toastService.success('UPI Payment marked as paid.');
  }

  addActivePayment() {
    this.paymentError = '';
    let amount = 0;
    let ref = '';
    let cashTendered: number | undefined;
    let changeDue: number | undefined;

    if (this.activeMethod === 'CASH') {
      amount = this.cashAmount;
      cashTendered = this.cashTendered !== null ? this.cashTendered : amount;
    } else if (this.activeMethod === 'UPI') {
      amount = this.upiAmount;
      if (this.upiStatus !== 'success') {
        this.paymentError = 'UPI Payment is not yet completed/confirmed.';
        return;
      }
      ref = this.upiRef;
    } else if (this.activeMethod === 'CARD') {
      amount = this.cardAmount;
      if (!this.cardTerminalRef || !this.cardApprovalCode || !this.cardLast4) {
        this.paymentError = 'Please fill out all card transaction details.';
        return;
      }
      if (this.cardLast4.length !== 4 || isNaN(Number(this.cardLast4))) {
        this.paymentError = 'Last 4 digits must be exactly 4 digits.';
        return;
      }
      ref = `Terminal Ref: ${this.cardTerminalRef}, Appr Code: ${this.cardApprovalCode}, Last 4: ${this.cardLast4}`;
    }

    const val = this.paymentService.validatePayment(
      this.activeMethod,
      amount,
      this.paymentTally.remaining,
      cashTendered
    );

    if (!val.isValid) {
      this.paymentError = val.error || 'Invalid payment amount.';
      return;
    }

    const appliedAmount = val.adjustedAmount || amount;
    changeDue = val.changeDue || 0;

    this.payments.push({
      paymentMethod: this.activeMethod,
      amount: appliedAmount,
      reference: ref || undefined,
      cashTendered: this.activeMethod === 'CASH' ? cashTendered : undefined,
      changeDue: this.activeMethod === 'CASH' ? changeDue : undefined
    });

    this.updateTally();

    if (this.paymentTally.remaining > 0) {
      this.selectPaymentMethod(this.activeMethod);
    } else {
      this.cashTendered = null;
      this.cashChangeDue = 0;
      this.upiRef = '';
      this.cardTerminalRef = '';
      this.cardApprovalCode = '';
      this.cardLast4 = '';
    }
  }

  removePayment(index: number) {
    this.payments.splice(index, 1);
    this.updateTally();
    this.selectPaymentMethod(this.activeMethod);
  }

  editPayment(index: number) {
    const p = this.payments[index];
    this.payments.splice(index, 1);
    this.updateTally();
    this.activeMethod = p.paymentMethod;
    
    if (p.paymentMethod === 'CASH') {
      this.cashAmount = p.amount;
      this.cashTendered = p.cashTendered !== undefined ? p.cashTendered : p.amount;
      this.cashChangeDue = p.changeDue || 0;
    } else if (p.paymentMethod === 'UPI') {
      this.upiAmount = p.amount;
      this.upiRef = p.reference || '';
      this.upiStatus = 'success';
    } else if (p.paymentMethod === 'CARD') {
      this.cardAmount = p.amount;
      const match = p.reference?.match(/Terminal Ref: (.*), Appr Code: (.*), Last 4: (.*)/);
      if (match) {
        this.cardTerminalRef = match[1];
        this.cardApprovalCode = match[2];
        this.cardLast4 = match[3];
      } else {
        this.cardTerminalRef = p.reference || '';
      }
    }
  }

  updateTally() {
    this.paymentTally = this.paymentService.calculateTally(this.getGrandTotal(), this.payments);
  }

  canConfirmPayment(): boolean {
    return this.paymentTally.remaining === 0 && this.payments.length > 0;
  }

  getUpiQrUrl(): string {
    const upiId = this.settingsService.settings()?.upiId || 'merchant@upi';
    const merchantName = this.settingsService.settings()?.upiMerchantName || this.settingsService.shopName();
    const amount = this.upiAmount;
    const invoiceRef = 'POS-' + Date.now();
    const upiLink = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(merchantName)}&am=${amount}&cu=INR&tn=${invoiceRef}`;
    return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(upiLink)}`;
  }

  confirmPayment() {
    if (!this.canConfirmPayment()) return;

    const request = {
      customerId: this.selectedCustomer ? this.selectedCustomer.id : null,
      discount: this.discount,
      notes: 'POS Sale',
      items: this.cart.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        sellingPrice: item.product.sellingPrice,
        discount: item.discount
      })),
      payments: this.payments.map(p => {
        let notesText = '';
        if (p.paymentMethod === 'CASH') {
          notesText = `Cash Tendered: ₹${p.cashTendered}, Change: ₹${p.changeDue}`;
        } else if (p.paymentMethod === 'UPI') {
          notesText = `UPI Ref: ${p.reference}`;
        } else if (p.paymentMethod === 'CARD') {
          notesText = `Card: ${p.reference}`;
        }

        return {
          paymentMethod: p.paymentMethod,
          amount: p.amount,
          notes: notesText
        };
      })
    };

    this.saleService.createSale(request).subscribe({
      next: (res) => {
        if (res.success) {
          const saleId = res.data;
          if (saleId) {
            this.completedSaleId = saleId;
            this.showPrintInvoiceModal = true;
          }
          this.cart = [];
          this.discount = 0;
          this.selectedCustomer = null;
          this.resetPaymentState();
          this.showPaymentModal = false;
        }
      },
      error: (err) => {
        console.error('Sale creation failed', err);
        this.paymentError = 'Sale completion failed: ' + (err.error?.message || 'Server error');
      }
    });
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (!this.showPaymentModal) return;

    if (event.key === 'F2') {
      event.preventDefault();
      this.selectPaymentMethod('CASH');
    } else if (event.key === 'F3') {
      event.preventDefault();
      this.selectPaymentMethod('UPI');
    } else if (event.key === 'F4') {
      event.preventDefault();
      this.selectPaymentMethod('CARD');
    } else if (event.key === 'Enter') {
      const target = event.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT')) {
        if (target.id === 'cashTenderedInput' || target.id === 'cashAmountInput' || 
            target.classList.contains('card-input')) {
          event.preventDefault();
          this.addActivePayment();
          return;
        }
      }
      if (this.canConfirmPayment()) {
        event.preventDefault();
        this.confirmPayment();
      }
    } else if (event.key === 'Escape') {
      event.preventDefault();
      this.closePaymentModal();
    }
  }

  printInvoice(saleId: number) {
    this.saleService.getInvoicePdf(saleId).subscribe({
      next: (blob) => {
        const file = new Blob([blob], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        window.open(fileURL, '_blank');
      },
      error: (err) => {
        console.error('Failed to download invoice PDF', err);
        this.toastService.error('Failed to generate invoice PDF.');
      }
    });
  }

  printCompletedInvoice() {
    if (this.completedSaleId) {
      this.printInvoice(this.completedSaleId);
    }
    this.showPrintInvoiceModal = false;
  }
}
