import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminLoginPageRoutingModule } from './admin-login-routing.module';

import { AdminLoginPage } from './admin-login.page';
import { MaterialModule } from '../material/material.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    MaterialModule,
    AdminLoginPageRoutingModule
  ],
  declarations: [AdminLoginPage]
})
export class AdminLoginPageModule {}
