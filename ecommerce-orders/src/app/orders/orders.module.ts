import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ReactiveFormsModule
} from '@angular/forms';

import {
  OrdersComponent
} from './orders/orders.component';

import {
  OrderDetailComponent
} from '../order-detail/order-detail.component';

import {
  OrdersRoutingModule
} from './orders-routing.module';


@NgModule({

  declarations: [

    OrdersComponent,

    OrderDetailComponent

  ],

  imports: [

    CommonModule,

    ReactiveFormsModule,

    OrdersRoutingModule

  ]

})
export class OrdersModule {}