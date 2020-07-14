import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'admin-login',
    pathMatch: 'full'
  },
  {
    path: 'admin-dashboard',
    loadChildren: () => import('./admin-dashboard/admin-dashboard.module').then( m => m.AdminDashboardPageModule),
    canActivate: [AuthGuard],
    data:{role:['admin']}
  },

  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'admin-login',
    loadChildren: () => import('./admin-login/admin-login.module').then( m => m.AdminLoginPageModule),
  },
  {
    path: 'device-scan',
    loadChildren: () => import('./device-scan/device-scan.module').then( m => m.DeviceScanPageModule),
    canActivate: [AuthGuard],
    data:{role:['user']}
  },  {
    path: 'add-ble-mac',
    loadChildren: () => import('./add-ble-mac/add-ble-mac.module').then( m => m.AddBleMacPageModule),
    canActivate: [AuthGuard],
    data:{role:['admin']}
  },
  {
    path: 'scan-ble-mac',
    loadChildren: () => import('./scan-ble-mac/scan-ble-mac.module').then( m => m.ScanBleMacPageModule),
    canActivate: [AuthGuard],
    data:{role:['admin']}
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
