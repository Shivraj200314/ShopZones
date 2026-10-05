import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProductListComponent } from './products/product-list/product-list.component';
import { ProductDetailsComponent } from './products/product-details/product-details.component';
import { CartComponent } from './cart/cart.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'products',
    pathMatch: 'full'
  },

  {
    path: 'products',
    component: ProductListComponent
  },

  {
    path: 'products/:id',
    component: ProductDetailsComponent
  },

  {
    path: 'cart',
    component: CartComponent
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
export class AppRoutingModule { }