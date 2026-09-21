import { NgModule } from '@angular/core';
import {
  RouterModule,
  Routes
} from '@angular/router';

import {
  loadRemoteModule
} from '@angular-architects/module-federation';


const routes: Routes = [

  {
    path: 'orders',

    loadChildren: () =>
      loadRemoteModule({

        type: 'module',

        remoteEntry:
          'http://localhost:4204/remoteEntry.js',

        exposedModule:
          './OrdersModule'

      })
      .then(
        m => m.OrdersModule
      )
  }

];


@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],

  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}