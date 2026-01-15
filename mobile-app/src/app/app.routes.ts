// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'admin/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then(m => m.HomePage),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.routes').then(m => m.ADMIN_ROUTES),
    canActivate: [authGuard]
  },
  {
    path: 'rapido',
    loadComponent: () => import('./modules/client/rapido/cliente_rapido.page').then(m => m.ClienteRapidoPage),
    canActivate: [authGuard]
  },
  {
    path: 'pagos',
    loadComponent: () => import('./modules/admin/payments/pagos.page').then(m => m.PagosPage),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'admin/dashboard'
  }
];