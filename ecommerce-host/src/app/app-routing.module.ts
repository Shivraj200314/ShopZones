import {
  NgModule
} from '@angular/core';

import {
  RouterModule,
  Routes
} from '@angular/router';

import {
  loadRemoteModule
} from '@angular-architects/module-federation';

import {
  LoginComponent
} from './auth/login/login.component';

import {
  SignupComponent
} from './auth/signup/signup.component';

import {
  MainLayoutComponent
} from './layout/main-layout/main-layout.component';

import {
  HomeComponent
} from './home/home.component';


const routes: Routes = [

  // =========================================
  // DEFAULT
  // =========================================

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    title: "Login Form",
    component: LoginComponent
  },
  {
    path: 'signup',
    title: "SignUp Form",
    component: SignupComponent
  },

  {
    path: '',
    component: MainLayoutComponent,

    children: [

      {
        path: 'home',
        title: "Home Dashboard",
        component: HomeComponent
      },

      {
        path: 'products',
        title: "Products Dashboard",
        loadChildren: () =>
          loadRemoteModule({

            type: 'module',

            remoteEntry:
              'http://localhost:4201/remoteEntry.js',

            exposedModule:
              './ProductsModule'

          })
            .then(
              m => m.ProductsModule
            )
      },

      {
        path: 'cart',
        title: 'Cart Dashboard',

        loadChildren: () =>
          loadRemoteModule({

            type: 'module',

            remoteEntry:
              'http://localhost:4202/remoteEntry.js',

            exposedModule:
              './CartModule'

          })
            .then(
              m => m.CartModule
            )
      },

      {
        path: 'checkout',
        title: "Checkout Dashboard",
        loadChildren: () =>
          loadRemoteModule({

            type: 'module',

            remoteEntry:
              'http://localhost:4203/remoteEntry.js',

            exposedModule:
              './CheckoutModule'

          })
            .then(
              m => m.CheckoutModule
            )
      },

      {
        path: 'orders',
        title: "Orders Dashboard",
        loadChildren: () =>
          loadRemoteModule({

            type: 'module',

            remoteEntry:
              'http://localhost:4204/remoteEntry.js',

            exposedModule:
              './OrdersModule'

          })
            .then(
              m => m.OrdersModule
            )
      },



    ]
  },
 {
  path: 'users',
  title: 'User Dashboard',

  loadChildren: () =>
    loadRemoteModule({

      type: 'module',

      remoteEntry:
        'http://localhost:4205/remoteEntry.js',

      exposedModule:
        './UsersModule'

    })
      .then(
        m => m.UsersModule
      )
},

  {
    path: '**',
    redirectTo: 'login'
  }

];

@NgModule({

  imports: [
    RouterModule.forRoot(
      routes
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }