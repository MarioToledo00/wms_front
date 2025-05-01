import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Productos'
    },
    children: [
      {
        path: '',
        redirectTo: 'productos',
        pathMatch: 'full'
      },
      {
        path: 'productos',
        loadComponent: () => import('./lista-productos/lista-productos.component').then(m => m.ListaProductosComponent),
        data: {
          title: 'Users'
        }
      }
    ]
  }
];
