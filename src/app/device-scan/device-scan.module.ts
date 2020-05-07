import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeviceScanPageRoutingModule } from './device-scan-routing.module';

import { DeviceScanPage } from './device-scan.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeviceScanPageRoutingModule
  ],
  declarations: [DeviceScanPage]
})
export class DeviceScanPageModule {}
