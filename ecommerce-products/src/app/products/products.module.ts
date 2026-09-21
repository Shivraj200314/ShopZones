import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  HttpClientModule,
  HTTP_INTERCEPTORS
} from '@angular/common/http';

import {
  ProductsRoutingModule
} from './products-routing.module';

import {
  ProductListComponent
} from './product-list/product-list.component';

import {
  ProductDetailsComponent
} from './product-details/product-details.component';

import {
  SpinnerComponent
} from './spinner/spinner.component';

import {
  LoaderInterceptor
} from './interceptors/loader.interceptor';
import { ProductService } from './product.service';
import { ProductRevampService } from './services/product-revamp.service';


@NgModule({

  declarations: [
    ProductListComponent,
    ProductDetailsComponent,
    SpinnerComponent
  ],

  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ProductsRoutingModule,
    ReactiveFormsModule
  ],

  providers: [
    ProductService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    },
    ProductRevampService

  ]

})
export class ProductsModule {}