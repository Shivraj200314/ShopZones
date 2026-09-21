import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { HomeComponent } from './home/home.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {
  MatSnackBarModule
} from '@angular/material/snack-bar';
import {
  HttpClientModule
} from '@angular/common/http';
@NgModule({

  declarations: [

    AppComponent,

    LoginComponent,

    SignupComponent,

    MainLayoutComponent,

    HomeComponent,

    CheckoutComponent

  ],

  imports: [

    BrowserModule,
  FormsModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  MatSnackBarModule,
  HttpClientModule
  ],

  providers: [],

  bootstrap: [

    AppComponent

  ]

})
export class AppModule {}