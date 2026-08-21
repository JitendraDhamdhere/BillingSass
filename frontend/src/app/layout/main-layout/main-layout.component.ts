import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SearchService } from '../../core/services/search.service';
import { FormsModule } from '@angular/forms';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule, RouterModule, FormsModule, MatSidenavModule, MatToolbarModule,
    MatListModule, MatIconModule, MatButtonModule, MatMenuModule
  ],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent {
  isSidebarOpen = true;
  currentUser: any;

  navItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'POS / Sales', icon: 'point_of_sale', route: '/sales' },
    { label: 'Inventory', icon: 'inventory', route: '/inventory' },
    { label: 'Products', icon: 'shopping_cart', route: '/products' },
    { label: 'Categories', icon: 'category', route: '/categories' },
    { label: 'Brands', icon: 'branding_watermark', route: '/brands' },
    { label: 'Customers', icon: 'people', route: '/customers' },
    { label: 'Suppliers', icon: 'local_shipping', route: '/suppliers' },
    { label: 'Reports', icon: 'bar_chart', route: '/reports' },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    public searchService: SearchService
  ) {
    this.authService.currentUser$.subscribe((user: any) => {
      this.currentUser = user;
    });

    // Clear search query on page navigation
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.searchService.clearQuery();
      }
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
