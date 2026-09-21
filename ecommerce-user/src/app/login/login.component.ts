import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  UserService
} from '../service/user.service';

import {
  UserRevampService
} from '../service/user-revamp.service';

import {
  USER_FALLBACK
} from '../core/constants/user-fallback.constants';


@Component({
  selector:
    'app-login',

  templateUrl:
    './login.component.html',

  styleUrls: [
    './login.component.css'
  ]
})
export class LoginComponent
  implements OnInit {


  // ==========================================
  // REVAMP
  // ==========================================

  revampFallback =
    signal<any>(
      USER_FALLBACK
    );


  email =
    '';


  password =
    '';


  errorMessage =
    '';


  isLoading =
    false;


  constructor(

    private userService:
      UserService,

    private userRevampService:
      UserRevampService,

    private router:
      Router

  ) {}


 ngOnInit(): void {

  this.loadRevampContent();


  // ========================================
  // GET EMAIL CHANGED FROM PROFILE
  // ========================================

  const changedEmail =
    localStorage.getItem(
      'shopzone_login_email'
    );


  if (
    changedEmail
  ) {

    this.email =
      changedEmail;

  }

}


  // ==========================================
  // LOAD REVAMP
  // ==========================================

  loadRevampContent(): void {

    this.userRevampService
      .getRevampContent()
      .subscribe({

        next: (
          response: any
        ) => {

          this.revampFallback
            .set(
              response
            );

        },

        error: (
          error
        ) => {

          console.error(
            'Login Revamp Error:',
            error
          );


          this.revampFallback
            .set(
              USER_FALLBACK
            );

        }

      });

  }


  // ==========================================
  // LOGIN
  // ==========================================

  login(): void {

    this.errorMessage =
      '';


    if (
      !this.email.trim() ||
      !this.password.trim()
    ) {

      this.errorMessage =

        this.revampFallback()
          ['login']
          ['required-error'];


      return;

    }


    const emailPattern =
        /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@(gmail\.com|yahoo\.com|yahoo\.in|outlook\.com|hotmail\.com|rediffmail\.com|icloud\.com|protonmail\.com)$/;


    if (
      !emailPattern.test(
        this.email.trim()
      )
    ) {

      this.errorMessage =

        this.revampFallback()
          ['login']
          ['invalid-email-error'];


      return;

    }


    this.isLoading =
      true;


    setTimeout(
      () => {

        const success =
          this.userService
            .login(
              this.email,
              this.password
            );


        if (
          success
        ) {

          this.isLoading =
            false;


          this.router.navigate([
            '/home'
          ]);

        }

        else {

          this.errorMessage =

            this.revampFallback()
              ['login']
              ['invalid-error'];


          this.isLoading =
            false;

        }

      },

      500

    );

  }


  // ==========================================
  // SIGNUP
  // ==========================================

  goToSignup(): void {

    this.router.navigate([
      '/signup'
    ]);

  }

}