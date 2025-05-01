import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Empresas'
    },
    children: [
      {
        path: '',
        redirectTo: 'empresas',
        pathMatch: 'full'
      },
      {
        path: 'empresas',
        loadComponent: () => import('./empresas/empresas.component').then(m => m.EmpresasComponent),
        data: {
          title: 'Empresas'
        }
      },
      {
        path: 'plazas',
        loadComponent: () => import('./plazas/plazas.component').then(m => m.PlazasComponent),
        data: {
          title: 'Plazas'
        }
      }
    ]
  }
];
