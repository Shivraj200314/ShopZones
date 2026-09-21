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