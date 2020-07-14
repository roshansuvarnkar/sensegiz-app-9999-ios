import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddBleMacPage } from './add-ble-mac.page';

const routes: Routes = [
  {
    path: '',
    component: AddBleMacPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddBleMacPageRoutingModule {}
