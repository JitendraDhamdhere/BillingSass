import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../core/services/product.service';
import { SaleService } from '../../../core/services/sale.service';
import { CustomerService } from '../../../core/services/customer.service';
import { ToastService } from '../../../core/services/toast.service';
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

  constructor(
    private productService: ProductService,
    private saleService: SaleService,
    private customerService: CustomerService,
    private toastService: ToastService
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
    if (this.cart.length === 0) return;
    
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
      payments: [{
        paymentMethod: 'CASH',
        amount: this.getGrandTotal(),
        notes: 'Full payment via POS'
      }]
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
        }
      },
      error: (err) => {
        console.error('Sale creation failed', err);
      }
    });
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
