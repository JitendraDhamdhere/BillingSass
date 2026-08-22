import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { CategoryListComponent } from './features/categories/category-list/category-list.component';
import { ProductListComponent } from './features/products/product-list/product-list.component';
import { CustomerListComponent } from './features/customers/customer-list/customer-list.component';
import { SupplierListComponent } from './features/suppliers/supplier-list/supplier-list.component';
import { PosComponent } from './features/sales/pos/pos.component';
import { PurchaseListComponent } from './features/purchases/purchase-list/purchase-list.component';
import { ReportsComponent } from './features/reports/reports/reports.component';
import { BrandListComponent } from './features/brands/brand-list/brand-list.component';
import { BrandFormComponent } from './features/brands/brand-form/brand-form.component';
import { CategoryFormComponent } from './features/categories/category-form/category-form.component';
import { ProductFormComponent } from './features/products/product-form/product-form.component';
import { CustomerFormComponent } from './features/customers/customer-form/customer-form.component';
import { SupplierFormComponent } from './features/suppliers/supplier-form/supplier-form.component';
import { PurchaseFormComponent } from './features/purchases/purchase-form/purchase-form.component';
import { ShopSettingsComponent } from './features/settings/shop-settings/shop-settings.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { 
    path: '', 
    component: MainLayoutComponent, 
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'categories', component: CategoryListComponent },
      { path: 'products', component: ProductListComponent },
      { path: 'customers', component: CustomerListComponent },
      { path: 'suppliers', component: SupplierListComponent },
      { path: 'sales', component: PosComponent },
      { path: 'inventory', component: PurchaseListComponent },
      { path: 'purchases', component: PurchaseListComponent },
      { path: 'reports', component: ReportsComponent },
      { path: 'brands', component: BrandListComponent },
      { path: 'brands/new', component: BrandFormComponent },
      { path: 'brands/:id/edit', component: BrandFormComponent },
      { path: 'categories/new', component: CategoryFormComponent },
      { path: 'categories/:id/edit', component: CategoryFormComponent },
      { path: 'products/new', component: ProductFormComponent },
      { path: 'products/:id/edit', component: ProductFormComponent },
      { path: 'customers/new', component: CustomerFormComponent },
      { path: 'customers/:id/edit', component: CustomerFormComponent },
      { path: 'suppliers/new', component: SupplierFormComponent },
      { path: 'suppliers/:id/edit', component: SupplierFormComponent },
      { path: 'inventory/new', component: PurchaseFormComponent },
      { path: 'inventory/:id/edit', component: PurchaseFormComponent },
      { path: 'purchases/new', component: PurchaseFormComponent },
      { path: 'purchases/:id/edit', component: PurchaseFormComponent },
      { path: 'settings/profile', component: ShopSettingsComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: '' }
];
