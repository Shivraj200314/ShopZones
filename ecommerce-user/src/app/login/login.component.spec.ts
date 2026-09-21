import {
  of,
  throwError
} from 'rxjs';

import {
  LoginComponent
} from './login.component';

import {
  USER_FALLBACK
} from '../users/core/constants/user-fallback.constants';


describe(
  'LoginComponent',
  () => {

    let component:
      LoginComponent;

    let routerMock: {
      navigate: jest.Mock;
    };

    let userRevampServiceMock: {
      getRevampContent: jest.Mock;
    };

    let consoleLogSpy:
      jest.SpyInstance;

    let consoleErrorSpy:
      jest.SpyInstance;


    // =========================================
    // BEFORE EACH
    // =========================================

    beforeEach(
      () => {

        localStorage.clear();


        routerMock = {

          navigate:
            jest.fn()

        };


        userRevampServiceMock = {

          getRevampContent:
            jest.fn()
              .mockReturnValue(
                of(
                  USER_FALLBACK
                )
              )

        };


        consoleLogSpy =
          jest
            .spyOn(
              console,
              'log'
            )
            .mockImplementation();


        consoleErrorSpy =
          jest
            .spyOn(
              console,
              'error'
            )
            .mockImplementation();


        component =
          new LoginComponent(

            routerMock as any,

            userRevampServiceMock as any

          );

      }
    );


    // =========================================
    // AFTER EACH
    // =========================================

    afterEach(
      () => {

        localStorage.clear();

        jest.restoreAllMocks();

      }
    );


    // =========================================
    // CREATE
    // =========================================

    it(
      'should create',
      () => {

        expect(
          component
        ).toBeTruthy();

      }
    );


    // =========================================
    // DEFAULT FALLBACK
    // =========================================

    it(
      'should initialize revampFallback with USER_FALLBACK',
      () => {

        expect(
          component.revampFallback()
        ).toEqual(
          USER_FALLBACK
        );

      }
    );


    // =========================================
    // NG ON INIT
    // =========================================

    it(
      'should call loadRevampContent on ngOnInit',
      () => {

        const spy =
          jest.spyOn(
            component,
            'loadRevampContent'
          );


        component.ngOnInit();


        expect(
          spy
        ).toHaveBeenCalledTimes(
          1
        );

      }
    );


    // =========================================
    // REVAMP SUCCESS
    // =========================================

    it(
      'should load revamp content successfully',
      () => {

        const apiResponse = {

          login: {

            'logo-title':
              'API SHOP',

            title:
              'API Login',

            description:
              'Login from API',

            'error-message':
              'API error'

          }

        };


        userRevampServiceMock
          .getRevampContent
          .mockReturnValue(
            of(
              apiResponse
            )
          );


        component
          .loadRevampContent();


        expect(
          userRevampServiceMock
            .getRevampContent
        ).toHaveBeenCalled();


        expect(
          component.revampFallback()
        ).toEqual(
          apiResponse
        );


        expect(
          consoleLogSpy
        ).toHaveBeenCalledWith(
          'User Revamp Response:',
          apiResponse
        );

      }
    );


    // =========================================
    // REVAMP ERROR
    // =========================================

    it(
      'should use USER_FALLBACK when revamp API fails',
      () => {

        const apiError =
          new Error(
            'API failed'
          );


        userRevampServiceMock
          .getRevampContent
          .mockReturnValue(

            throwError(
              () =>
                apiError
            )

          );


        component
          .revampFallback
          .set(
            {}
          );


        component
          .loadRevampContent();


        expect(
          component.revampFallback()
        ).toEqual(
          USER_FALLBACK
        );


        expect(
          consoleErrorSpy
        ).toHaveBeenCalledWith(
          'User Revamp Error:',
          apiError
        );

      }
    );


    // =========================================
    // LOGIN - EMAIL EMPTY
    // =========================================

    it(
      'should show error when email is empty',
      () => {

        component
          .revampFallback
          .set({

            login: {

              'error-message':
                'Email and password required'

            }

          });


        component.email =
          '';

        component.password =
          '123456';


        component.login();


        expect(
          component.errorMessage
        ).toBe(
          'Email and password required'
        );


        expect(
          component.isLoading
        ).toBe(
          false
        );


        expect(
          routerMock.navigate
        ).not
          .toHaveBeenCalled();

      }
    );


    // =========================================
    // LOGIN - PASSWORD EMPTY
    // =========================================

    it(
      'should show error when password is empty',
      () => {

        component
          .revampFallback
          .set({

            login: {

              'error-message':
                'Email and password required'

            }

          });


        component.email =
          'rohit@gmail.com';

        component.password =
          '';


        component.login();


        expect(
          component.errorMessage
        ).toBe(
          'Email and password required'
        );


        expect(
          routerMock.navigate
        ).not
          .toHaveBeenCalled();

      }
    );


    // =========================================
    // LOGIN - BOTH EMPTY
    // =========================================

    it(
      'should show error when email and password are empty',
      () => {

        component
          .revampFallback
          .set({

            login: {

              'error-message':
                'Required fields'

            }

          });


        component.email =
          '';

        component.password =
          '';


        component.login();


        expect(
          component.errorMessage
        ).toBe(
          'Required fields'
        );

      }
    );


    // =========================================
    // LOGIN SUCCESS
    // =========================================

    it(
      'should login successfully and navigate to home',
      () => {

        component.errorMessage =
          'Old error';


        component.email =
          'rohit@gmail.com';

        component.password =
          '123456';


        component.login();


        // Old error must be cleared
        expect(
          component.errorMessage
        ).toBe(
          ''
        );


        // Token must be stored
        expect(
          localStorage.getItem(
            'access_token'
          )
        ).toBe(
          'demo-token'
        );


        // User must be stored
        const storedUser =
          JSON.parse(

            localStorage.getItem(
              'user'
            ) as string

          );


        expect(
          storedUser
        ).toEqual({

          name:
            'rohit',

          email:
            'rohit@gmail.com'

        });


        // Loading must finally stop
        expect(
          component.isLoading
        ).toBe(
          false
        );


        // Navigate to home
        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith([
          '/home'
        ]);

      }
    );


    // =========================================
    // USER NAME FROM EMAIL
    // =========================================

    it(
      'should create username from email before @ symbol',
      () => {

        component.email =
          'vijaynand123@example.com';

        component.password =
          'password';


        component.login();


        const storedUser =
          JSON.parse(

            localStorage.getItem(
              'user'
            ) as string

          );


        expect(
          storedUser.name
        ).toBe(
          'vijaynand123'
        );

      }
    );

  }
);