import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ScanBleMacPageRoutingModule } from './scan-ble-mac-routing.module';

import { ScanBleMacPage } from './scan-ble-mac.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ScanBleMacPageRoutingModule
  ],
  declarations: [ScanBleMacPage]
})
export class ScanBleMacPageModule {}
