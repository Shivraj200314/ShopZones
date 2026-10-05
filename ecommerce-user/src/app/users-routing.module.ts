import {
  NgModule
} from '@angular/core';

import {
  RouterModule,
  Routes
} from '@angular/router';

import {
  ProfileComponent
} from './profile/profile.component';

import {
  LoginComponent
} from './login/login.component';


const routes:
  Routes = [

    // =========================================
    // /users
    // =========================================

    {
      path: '',

      redirectTo:
        'profile',

      pathMatch:
        'full'
    },


    // =========================================
    // /users/profile
    // =========================================

    {
      path:
        'profile',

      title:
        'My Profile',

      component:
        ProfileComponent
    },

    {
      path:
        'home',

      redirectTo:
        'profile',

      pathMatch:
        'full'
    },

    {
      path:
        'login',

      title:
        'Login',

      component:
        LoginComponent
    },

    {
      path:
        'signup',

      redirectTo:
        'login',

      pathMatch:
        'full'
    }

  ];


@NgModule({

  imports: [

    RouterModule.forChild(
      routes
    )

  ],

  exports: [

    RouterModule

  ]

})
export class UsersRoutingModule {}