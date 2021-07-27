import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./tabs/tabs.module').then((m) => m.TabsPageModule),
  },
  {
    path: 'printer-list',
    loadChildren: () =>
      import('./printer-list/printer-list.module').then(
        (m) => m.PrinterListPageModule
      ),
  },
  {
    path: 'ext-manager',
    loadChildren: () =>
      import('./star-io-ext-manager/star-io-ext-manager.module').then(
        (m) => m.StarIoExtManagerPageModule
      ),
  },
  {
    path: 'status',
    loadChildren: () =>
      import('./status/status.module').then((m) => m.StatusPageModule),
  },
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
