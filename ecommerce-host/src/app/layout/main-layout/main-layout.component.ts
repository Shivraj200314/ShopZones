import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  Router
} from '@angular/router';
import {
  SHELL_FALLBACK
} from '../../core/constants/shell-fallback.constants';
import { mergeData } from 'src/app/units/merge';
import { ShellRevampService } from 'src/app/services/shell-revamp.service';


interface LoggedInUser {

  id?: number;

  firstName?: string;

  lastName?: string;

  name?: string;

  email: string;

}


@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent
  implements OnInit {


  // =========================================
  // REVAMP FALLBACK
  // =========================================

  revampFallback =
    signal<any>(
      SHELL_FALLBACK
    );


  // =========================================
  // USER
  // =========================================

  currentUser:
    LoggedInUser | null =
      null;


  userName: string =
    'User';


  userInitial: string =
    'U';
isLoggedIn: boolean =
  false;

  constructor(
    private router:
      Router,
       private shellRevampService:
    ShellRevampService
  ) { }


  // =========================================
  // INIT
  // =========================================

  ngOnInit(): void {
this.loadRevampData();
    this.loadUser();

  }

  goToLogin(): void {

  this.router.navigate([
    '/login'
  ]);

}

  loadRevampData(): void {

  this.shellRevampService
    .getRevampContent()
    .subscribe({

      next: (response: any) => {

        const apiData =
          response?.data
            ? response.data
            : response;

        const finalData =
          mergeData(
            SHELL_FALLBACK,
            apiData
          );

        this.revampFallback.set(
          finalData
        );

      },

      error: (error: any) => {

        console.error(
          'Shell Revamp API Error:',
          error
        );

        this.revampFallback.set(
          SHELL_FALLBACK
        );

      }

    });

}

goToProfile(): void {

  this.router.navigate([
    '/users/profile'
  ]);

}
  // =========================================
  // LOAD USER FROM LOCAL STORAGE
  // =========================================

loadUser(): void {

  const accessToken =
    localStorage.getItem(
      'access_token'
    );


  const storedUser =
    localStorage.getItem(
      'shopzone_user'
    );


  // =====================================
  // USER NOT LOGGED IN
  // =====================================

  if (
    !accessToken ||
    !storedUser
  ) {

    this.isLoggedIn =
      false;

    this.currentUser =
      null;

    this.userName =
      'User';

    this.userInitial =
      'U';

    return;

  }


  try {

    this.currentUser =
      JSON.parse(
        storedUser
      );


    this.isLoggedIn =
      true;


    // =====================================
    // GET USER NAME
    // =====================================

    if (
      this.currentUser?.firstName
    ) {

      this.userName =
        [
          this.currentUser.firstName,
          this.currentUser.lastName
        ]
          .filter(Boolean)
          .join(' ');

    }

    else if (
      this.currentUser?.name
    ) {

      this.userName =
        this.currentUser.name;

    }

    else if (
      this.currentUser?.email
    ) {

      this.userName =
        this.currentUser.email
          .split('@')[0];

    }

    else {

      this.userName =
        'User';

    }


    // =====================================
    // AVATAR INITIAL
    // =====================================

    this.userInitial =
      this.userName
        .charAt(0)
        .toUpperCase();

  }

  catch (
    error
  ) {

    console.error(
      'Unable to read user:',
      error
    );


    this.isLoggedIn =
      false;

    this.currentUser =
      null;

    this.userName =
      'User';

    this.userInitial =
      'U';

  }

}

  // =========================================
  // LOGOUT
  // =========================================
logout(): void {

  localStorage.removeItem(
    'access_token'
  );


  localStorage.removeItem(
    'shopzone_user'
  );


  this.isLoggedIn =
    false;


  this.currentUser =
    null;


  this.userName =
    'User';


  this.userInitial =
    'U';


  this.router.navigate([
    '/login'
  ]);

}
  

}