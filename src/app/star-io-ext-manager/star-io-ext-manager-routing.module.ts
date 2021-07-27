import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { StarIoExtManagerPage } from './star-io-ext-manager.page';

const routes: Routes = [
  {
    path: '',
    component: StarIoExtManagerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StarIoExtManagerPageRoutingModule {}
