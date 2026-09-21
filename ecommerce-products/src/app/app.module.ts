import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { CartComponent } from './cart/cart.component';
import { ProductService } from './products/product.service';

@NgModule({
  declarations: [
    AppComponent,
    CartComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],

  providers: [ProductService],

  bootstrap: [
    AppComponent
  ]
})
export class AppModule {}