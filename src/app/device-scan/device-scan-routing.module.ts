import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DeviceScanPage } from './device-scan.page';

const routes: Routes = [
  {
    path: '',
    component: DeviceScanPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceScanPageRoutingModule {}
