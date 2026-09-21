import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  HttpClientModule
} from '@angular/common/http';

import {
  CheckoutRoutingModule
} from './checkout-routing.module';

import {
  CheckoutComponent
} from './checkout.component';

import {
  CheckoutRevampService
} from '../service/checkout-revamp.service';


@NgModule({

  declarations: [

    CheckoutComponent

  ],

  imports: [

    CommonModule,

    ReactiveFormsModule,

    HttpClientModule,

    CheckoutRoutingModule,
    FormsModule,
    

  ],

  providers: [

    CheckoutRevampService

  ]

})

export class CheckoutModule {}