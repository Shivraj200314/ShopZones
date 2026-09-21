import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { CheckoutRoutingModule }
  from './checkout-routing.module';
import { CheckoutComponent } from 'src/app/checkout/checkout.component';

@NgModule({

  declarations: [
    CheckoutComponent
  ],

  imports: [
    CommonModule,
    FormsModule,
    CheckoutRoutingModule
  ]

})
export class CheckoutModule {}