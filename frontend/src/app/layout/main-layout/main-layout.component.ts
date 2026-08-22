import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { SearchService } from '../../core/services/search.service';
import { ShopSettingsService } from '../../core/services/shop-settings.service';
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
export class MainLayoutComponent implements OnInit {
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
    { label: 'Shop Settings', icon: 'settings', route: '/settings/profile' }
  ];

  get filteredNavItems() {
    return this.navItems.filter(item => {
      if (item.route === '/settings/profile') {
        return this.currentUser?.roles?.includes('ADMIN');
      }
      return true;
    });
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    public searchService: SearchService,
    public settingsService: ShopSettingsService
  ) {
    this.authService.currentUser$.subscribe((user: any) => {
      this.currentUser = user;
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.searchService.clearQuery();
      }
    });
  }

  ngOnInit(): void {
    this.settingsService.loadSettings().subscribe({
      error: (err) => console.error('Error loading shop settings in layout', err)
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
