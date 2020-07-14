import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddBleMacPageRoutingModule } from './add-ble-mac-routing.module';

import { AddBleMacPage } from './add-ble-mac.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddBleMacPageRoutingModule
  ],
  declarations: [AddBleMacPage]
})
export class AddBleMacPageModule {}
