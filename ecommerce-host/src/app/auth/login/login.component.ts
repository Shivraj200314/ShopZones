import {
  Component,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';

import {
  NgForm
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  Subject,
  takeUntil
} from 'rxjs';

import {
  MatSnackBar
} from '@angular/material/snack-bar';

import {
  AuthService
} from '../../auth.service';

import {
  LoginRevampService
} from '../../services/login-revamp.service';

import {
  LOGIN_FALLBACK
} from '../../core/constants/login-fallback.constants';


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
  implements OnInit, OnDestroy {


  // ==========================================
  // REVAMP FALLBACK
  // ==========================================

  revampFallback =
    signal<any>(
      LOGIN_FALLBACK
    );


  // ==========================================
  // EMAIL
  // ==========================================

  email =
    '';


  // ==========================================
  // PASSWORD
  // ==========================================

  password =
    '';


  // ==========================================
  // FORM SUBMITTED
  // ==========================================

  isSubmitted =
    false;


  // ==========================================
  // ERROR
  // ==========================================

  errorMessage =
    '';


  // ==========================================
  // LOADING
  // ==========================================

  isLoading =
    false;


  // ==========================================
  // EMAIL VALIDATION
  // ==========================================

  readonly emailPattern =

    '^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\\.[A-Za-z0-9-]+)*\\.(com|in|org|net|edu|gov|co\\.in)$';


  // ==========================================
  // DESTROY
  // ==========================================

  private destroy$ =
    new Subject<void>();


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(

    private authService:
      AuthService,

    private router:
      Router,

    private loginRevampService:
      LoginRevampService,

    private snackBar:
      MatSnackBar

  ) {}


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.loadRevampContent();


    // ========================================
    // PREFILL UPDATED EMAIL FROM PROFILE
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
  // LOAD REVAMP CONTENT
  // ==========================================

  loadRevampContent(): void {

    this.loginRevampService
      .getRevampContent()

      .pipe(

        takeUntil(
          this.destroy$
        )

      )

      .subscribe({

        next: (
          content
        ) => {

          console.log(
            'Login revamp content:',
            content
          );


          this.revampFallback
            .set(
              content
            );

        },


        error: (
          error
        ) => {

          console.error(
            'Login revamp error:',
            error
          );


          this.revampFallback
            .set(
              LOGIN_FALLBACK
            );

        }

      });

  }


  // ==========================================
  // LOGIN
  // ==========================================

  login(
    loginForm:
      NgForm
  ): void {

    // ========================================
    // SUBMITTED
    // ========================================

    this.isSubmitted =
      true;


    this.errorMessage =
      '';


    // ========================================
    // INVALID FORM
    // ========================================

    if (
      loginForm.invalid
    ) {

      loginForm.control
        .markAllAsTouched();


      return;

    }


    // ========================================
    // START LOADING
    // ========================================

    this.isLoading =
      true;


    // ========================================
    // LOGIN DELAY
    // ========================================

    setTimeout(
      () => {

        const success =

          this.authService
            .login(

              this.email
                .trim()
                .toLowerCase(),

              this.password

            );


        // ====================================
        // LOGIN SUCCESS
        // ====================================

        if (
          success
        ) {

          this.isLoading =
            false;


          // ==================================
          // CLEAR TEMP UPDATED EMAIL
          // ==================================

          localStorage.removeItem(
            'shopzone_login_email'
          );


          // ==================================
          // SUCCESS SNACKBAR
          // ==================================

      this.snackBar.open(
  '✓ Login successful! Welcome to ShopZones.',
  'Close',
  {
    duration: 3000,

    horizontalPosition:
      'end',

    verticalPosition:
      'top',

    panelClass: [
      'success-snackbar'
    ]
  }
);


          // ==================================
          // NAVIGATE HOME
          // ==================================

          setTimeout(
            () => {

              this.router.navigate([
                '/home'
              ]);

            },

            300

          );

        }


        // ====================================
        // LOGIN FAILED
        // ====================================

        else {

          this.errorMessage =

            this.revampFallback()
              ['login']
              ['invalid-error'];


          this.isLoading =
            false;

        }

      },

      1000

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


  // ==========================================
  // DESTROY
  // ==========================================

  ngOnDestroy(): void {

    this.destroy$
      .next();


    this.destroy$
      .complete();

  }

}