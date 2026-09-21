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


describe(
  'MainLayoutComponent',
  () => {

    let component:
      MainLayoutComponent;

    let fixture:
      ComponentFixture<MainLayoutComponent>;

    let routerMock: {
      navigate: jest.Mock;
    };


    beforeEach(
      async () => {

        routerMock = {

          navigate:
            jest.fn()

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