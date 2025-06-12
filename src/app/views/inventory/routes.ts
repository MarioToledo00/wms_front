import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Inventory'
    },
    children: [
      {
        path: '',
        redirectTo: 'inventory',
        pathMatch: 'full'
      },
      {
        path: 'warehouse_count',
        loadComponent: () => import('./warehouse-inventory/warehouse-inventory.component').then(m => m.WarehouseInventoryComponent),
        data: {
          title: 'Warehouse Count'
        }
      },
      {
        path: 'products_count',
        loadComponent: () => import('./products-inventory/products-inventory.component').then(m => m.ProductsInventoryComponent),
        data: {
          title: 'Products Count'
        }
      }
    ]
  }
];
