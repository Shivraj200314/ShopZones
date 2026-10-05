import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  Router
} from '@angular/router';

import {
  NO_ERRORS_SCHEMA
} from '@angular/core';

import {
  MainLayoutComponent
} from './main-layout.component';

import {
  ShellRevampService
} from '../../services/shell-revamp.service';

import {
  LanguageService
} from '../../services/language.service';

import {
  of
} from 'rxjs';


describe(
  'MainLayoutComponent',
  () => {

    let component:
      MainLayoutComponent;

    let fixture:
      ComponentFixture<MainLayoutComponent>;

    let routerMock: {
      navigate: jest.Mock;
      url: string;
    };


    beforeEach(
      async () => {

        routerMock = {

          navigate:
            jest.fn(),

          url:
            '/home'

        };


        await TestBed
          .configureTestingModule({

            declarations: [
              MainLayoutComponent
            ],

            providers: [

              {
                provide:
                  Router,

                useValue:
                  routerMock
              },

              {
                provide:
                  ShellRevampService,

                useValue: {
                  getRevampContent: () => of({})
                }
              },

              {
                provide:
                  LanguageService,

                useValue: {
                  getLanguage: () => 'en',
                  setLanguage: jest.fn()
                }
              }

            ],

            schemas: [
              NO_ERRORS_SCHEMA
            ]

          })
          .compileComponents();


        fixture =
          TestBed.createComponent(
            MainLayoutComponent
          );


        component =
          fixture.componentInstance;


        localStorage.clear();

      }
    );


    afterEach(
      () => {

        localStorage.clear();

        jest.restoreAllMocks();

      }
    );


    // ============================================
    // CREATE
    // ============================================

    it(
      'should create',
      () => {

        expect(
          component
        ).toBeTruthy();

      }
    );


    // ============================================
    // DEFAULT USER
    // ============================================

    it(
      'should use default user when no user exists',
      () => {

        component.ngOnInit();

        expect(
          component.userName
        ).toBe(
          'User'
        );


        expect(
          component.userInitial
        ).toBe(
          'U'
        );

      }
    );


    it(
      'should allow sellers to access Home and redirect restricted routes',
      () => {

        routerMock.url =
          '/orders';

        localStorage.setItem(
          'access_token',
          'test-token'
        );

        localStorage.setItem(
          'shopzone_user',
          JSON.stringify({
            email: 'seller@example.com',
            role: 'SELLER'
          })
        );


        component.ngOnInit();


        expect(
          component.isOwner
        ).toBe(false);

        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith([
          '/products'
        ]);


        routerMock.navigate.mockClear();
        routerMock.url =
          '/home';

        component.ngOnInit();

        component.goToDefaultPage();

        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith([
          '/home'
        ]);

      }
    );


    it(
      'should identify an owner for full navigation',
      () => {

        localStorage.setItem(
          'access_token',
          'test-token'
        );

        localStorage.setItem(
          'shopzone_user',
          JSON.stringify({
            email: 'owner@example.com',
            role: 'OWNER'
          })
        );


        component.loadUser();


        expect(
          component.isOwner
        ).toBe(true);

      }
    );


    it(
      'should allow customers to open orders and show shopping navigation',
      () => {

        routerMock.url =
          '/orders';

        localStorage.setItem(
          'access_token',
          'test-token'
        );

        localStorage.setItem(
          'shopzone_user',
          JSON.stringify({
            email: 'customer@example.com',
            role: 'CUSTOMER'
          })
        );


        component.ngOnInit();


        expect(
          component.isCustomer
        ).toBe(true);

        expect(
          routerMock.navigate
        ).not.toHaveBeenCalled();

        component.goToDefaultPage();

        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith([
          '/home'
        ]);

      }
    );


    // ============================================
    // FIRST NAME
    // ============================================

    it(
      'should use firstName when available',
      () => {

        localStorage.setItem(

          'shopzone_user',

          JSON.stringify({

            firstName:
              'Rohit',

            email:
              'rohit@gmail.com'

          })

        );


        component.ngOnInit();


        expect(
          component.userName
        ).toBe(
          'Rohit'
        );


        expect(
          component.userInitial
        ).toBe(
          'R'
        );

      }
    );


    // ============================================
    // NAME
    // ============================================

    it(
      'should use name when firstName is unavailable',
      () => {

        localStorage.setItem(

          'shopzone_user',

          JSON.stringify({

            name:
              'Vijay',

            email:
              'vijay@gmail.com'

          })

        );


        component.ngOnInit();


        expect(
          component.userName
        ).toBe(
          'Vijay'
        );


        expect(
          component.userInitial
        ).toBe(
          'V'
        );

      }
    );


    // ============================================
    // EMAIL FALLBACK
    // ============================================

    it(
      'should create username from email when name is unavailable',
      () => {

        localStorage.setItem(

          'shopzone_user',

          JSON.stringify({

            email:
              'rohit.yewale@gmail.com'

          })

        );


        component.ngOnInit();


        expect(
          component.userName
        ).toBe(
          'rohit.yewale'
        );


        expect(
          component.userInitial
        ).toBe(
          'R'
        );

      }
    );


    // ============================================
    // INVALID JSON
    // ============================================

    it(
      'should use default user when stored JSON is invalid',
      () => {

        localStorage.setItem(
          'shopzone_user',
          'invalid-json'
        );


        const consoleSpy =
          jest
            .spyOn(
              console,
              'error'
            )
            .mockImplementation(
              () => {}
            );


        component.ngOnInit();


        expect(
          component.userName
        ).toBe(
          'User'
        );


        expect(
          component.userInitial
        ).toBe(
          'U'
        );


        expect(
          consoleSpy
        ).toHaveBeenCalled();

      }
    );


    // ============================================
    // PROFILE NAVIGATION
    // ============================================

    it(
      'should navigate to profile',
      () => {

        component.goToProfile();


        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith([
          '/users/profile'
        ]);

      }
    );


    // ============================================
    // LOGOUT
    // ============================================

    it(
      'should remove access token and user during logout',
      () => {

        localStorage.setItem(
          'access_token',
          'test-token'
        );


        localStorage.setItem(

          'shopzone_user',

          JSON.stringify({

            email:
              'test@gmail.com'

          })

        );


        component.logout();


        expect(
          localStorage.getItem(
            'access_token'
          )
        ).toBeNull();


        expect(
          localStorage.getItem(
            'shopzone_user'
          )
        ).toBeNull();

      }
    );

  }
);