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
import { Language, LanguageService } from 'src/app/services/language.service';

interface LoggedInUser {
  id?: number;
  fullName?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  email: string;
  role?: string;
}

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.css']
})
export class MainLayoutComponent
  implements OnInit {

    selectedLanguage: Language = 'en';

  revampFallback =
    signal<any>(
      SHELL_FALLBACK
    );

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
    ShellRevampService,
    private languageService: LanguageService
  ) { }

  ngOnInit(): void {
this.loadRevampData();
    this.loadUser();
  this.redirectNonOwnersFromRestrictedRoutes();
       this.selectedLanguage =
      this.languageService.getLanguage();

  }

   onLanguageChange(event: Event): void {

    const select =
      event.target as HTMLSelectElement;

    const language =
      select.value as Language;

    this.languageService.setLanguage(language);

    this.selectedLanguage = language;
  }

  goToLogin(): void {

  this.router.navigate([
    '/login'
  ]);

}

  get isOwner(): boolean {

    return this.isLoggedIn &&
      this.currentUser?.role
        ?.trim()
        .toUpperCase() === 'OWNER';

  }

  get isCustomer(): boolean {

    return this.isLoggedIn &&
      this.currentUser?.role
        ?.trim()
        .toUpperCase() === 'CUSTOMER';

  }

  goToDefaultPage(): void {

    this.router.navigate([
      this.isLoggedIn
        ? '/home'
        : '/login'
    ]);

  }

  private redirectNonOwnersFromRestrictedRoutes(): void {

    if (
      !this.isLoggedIn ||
      this.isOwner
    ) {

      return;

    }


    const currentPath =
      (this.router.url || '')
        .split('?')[0];

    const restrictedPaths: string[] = [];


    if (
      this.currentUser?.role
        ?.trim()
        .toUpperCase() === 'SELLER'
    ) {

      restrictedPaths.push(
        '/cart',
        '/checkout',
        '/orders'
      );

    }


    if (
      restrictedPaths.some(
        path =>
          currentPath === path ||
          currentPath.startsWith(`${path}/`)
      )
    ) {

      this.router.navigate([
        '/products'
      ]);

    }

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

loadUser(): void {

  const accessToken =
    localStorage.getItem(
      'access_token'
    );

  const storedUser =
    localStorage.getItem(
      'shopzone_user'
    );

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

    if (
      this.currentUser?.fullName
    ) {

      this.userName =
        this.currentUser.fullName
          .trim();

    }

    else if (
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

    else {

      this.userName =
        'User';

    }

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