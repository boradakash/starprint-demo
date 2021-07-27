import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StarIoExtManagerPageRoutingModule } from './star-io-ext-manager-routing.module';

import { StarIoExtManagerPage } from './star-io-ext-manager.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StarIoExtManagerPageRoutingModule
  ],
  declarations: [StarIoExtManagerPage]
})
export class StarIoExtManagerPageModule {}
