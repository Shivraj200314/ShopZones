import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  HttpClientModule
} from '@angular/common/http';

import {
  CartComponent
} from './cart.component';

import {
  CartRoutingModule
} from './cart-routing.module';

import {
  CartRevampService
} from '../service/cart-revamp.service';


@NgModule({

  declarations: [

    CartComponent

  ],

  imports: [

    CommonModule,

    HttpClientModule,

    CartRoutingModule

  ],

  providers: [

    CartRevampService

  ]

})
export class CartModule { }