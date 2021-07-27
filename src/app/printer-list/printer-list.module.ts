import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PrinterListPageRoutingModule } from './printer-list-routing.module';

import { PrinterListPage } from './printer-list.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrinterListPageRoutingModule
  ],
  declarations: [PrinterListPage]
})
export class PrinterListPageModule {}
