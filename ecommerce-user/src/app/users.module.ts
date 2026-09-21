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
  ProfileComponent
} from './profile/profile.component';

import {
  LoginComponent
} from './login/login.component';

import {
  UsersRoutingModule
} from './users-routing.module';


@NgModule({

  declarations: [

    ProfileComponent,

    // LoginComponent uses [(ngModel)]
    LoginComponent

  ],

  imports: [

    CommonModule,

    // Required for [(ngModel)]
    FormsModule,

    ReactiveFormsModule,

    UsersRoutingModule

  ]

})
export class UsersModule {}