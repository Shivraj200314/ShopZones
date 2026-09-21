import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';

import {
  FormsModule,
  NgForm
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  LoginComponent
} from './login.component';

import {
  AuthService
} from '../../auth.service';


describe(
  'LoginComponent',
  () => {

    let component:
      LoginComponent;

    let fixture:
      ComponentFixture<LoginComponent>;


    let authServiceMock: {
      login: jest.Mock;
    };


    let routerMock: {
      navigate: jest.Mock;
    };
     const createMockLoginForm = (
      isValid: boolean = true
    ): NgForm => {

      return {
        valid: isValid,
        invalid: !isValid,
        submitted: true,
        controls: {},
        value: {},
        resetForm: jest.fn(),
        reset: jest.fn()
      } as unknown as NgForm;

    };


    beforeEach(
      async () => {

        authServiceMock = {

          login:
            jest.fn()

        };


        routerMock = {

          navigate:
            jest.fn()

        };


        await TestBed
          .configureTestingModule({

            declarations: [
              LoginComponent
            ],

            imports: [
              FormsModule
            ],

            providers: [

              {
                provide:
                  AuthService,

                useValue:
                  authServiceMock
              },

              {
                provide:
                  Router,

                useValue:
                  routerMock
              }

            ]

          })
          .compileComponents();


        fixture =
          TestBed.createComponent(
            LoginComponent
          );


        component =
          fixture.componentInstance;


        fixture.detectChanges();

      }
    );


    afterEach(
      () => {

        jest.clearAllMocks();

      }
    );


    // =====================================
    // CREATE
    // =====================================

    it(
      'should create',
      () => {

        expect(
          component
        ).toBeTruthy();

      }
    );


    // =====================================
    // DEFAULT VALUES
    // =====================================

    it(
      'should initialize default values',
      () => {

        expect(
          component.email
        ).toBe('');


        expect(
          component.password
        ).toBe('');


        expect(
          component.errorMessage
        ).toBe('');


        expect(
          component.isLoading
        ).toBe(false);

      }
    );


    // =====================================
    // EMPTY EMAIL
    // =====================================

    it(
      'should show error when email is empty',
      () => {

        component.email =
          '';

        component.password =
          '123456';


     component.login(
  createMockLoginForm(true)
);


        expect(
          component.errorMessage
        ).toBe(
          'Please enter email and password.'
        );


        expect(
          authServiceMock.login
        ).not.toHaveBeenCalled();

      }
    );


    // =====================================
    // EMAIL ONLY SPACES
    // =====================================

    it(
      'should show error when email contains only spaces',
      () => {

        component.email =
          '   ';

        component.password =
          '123456';


      component.login(
  createMockLoginForm(true)
);


        expect(
          component.errorMessage
        ).toBe(
          'Please enter email and password.'
        );

      }
    );


    // =====================================
    // EMPTY PASSWORD
    // =====================================

    it(
      'should show error when password is empty',
      () => {

        component.email =
          'test@gmail.com';

        component.password =
          '';


       component.login(
  createMockLoginForm(true)
);


        expect(
          component.errorMessage
        ).toBe(
          'Please enter email and password.'
        );


        expect(
          authServiceMock.login
        ).not.toHaveBeenCalled();

      }
    );


    // =====================================
    // PASSWORD ONLY SPACES
    // =====================================

    it(
      'should show error when password contains only spaces',
      () => {

        component.email =
          'test@gmail.com';

        component.password =
          '   ';


       component.login(
  createMockLoginForm(true)
);


        expect(
          component.errorMessage
        ).toBe(
          'Please enter email and password.'
        );

      }
    );


    // =====================================
    // SUCCESS LOGIN
    // =====================================

    it(
      'should login and navigate home when credentials are valid',
      fakeAsync(
        () => {

          authServiceMock
            .login
            .mockReturnValue(
              true
            );


          component.email =
            'test@gmail.com';

          component.password =
            '123456';


        component.login(
  createMockLoginForm(true)
);

          // Spinner starts immediately
          expect(
            component.isLoading
          ).toBe(true);


          // Service should not execute
          // before the timeout
          expect(
            authServiceMock.login
          ).not.toHaveBeenCalled();


          tick(1000);


          expect(
            authServiceMock.login
          ).toHaveBeenCalledWith(
            'test@gmail.com',
            '123456'
          );


          expect(
            routerMock.navigate
          ).toHaveBeenCalledWith([
            '/home'
          ]);

        }
      )
    );


    // =====================================
    // INVALID LOGIN
    // =====================================

    it(
      'should show error when login fails',
      fakeAsync(
        () => {

          authServiceMock
            .login
            .mockReturnValue(
              false
            );


          component.email =
            'wrong@gmail.com';

          component.password =
            'wrong';


       component.login(
  createMockLoginForm(true)
);


          expect(
            component.isLoading
          ).toBe(true);


          tick(1000);


          expect(
            authServiceMock.login
          ).toHaveBeenCalledWith(
            'wrong@gmail.com',
            'wrong'
          );


          expect(
            component.errorMessage
          ).toBe(
            'Invalid email or password.'
          );


          expect(
            component.isLoading
          ).toBe(false);


          expect(
            routerMock.navigate
          ).not.toHaveBeenCalledWith([
            '/home'
          ]);

        }
      )
    );


    // =====================================
    // CLEAR OLD ERROR
    // =====================================

    it(
      'should clear previous error before login',
      fakeAsync(
        () => {

          authServiceMock
            .login
            .mockReturnValue(
              false
            );


          component.errorMessage =
            'Old error';


          component.email =
            'test@gmail.com';

          component.password =
            '123456';


      component.login(
  createMockLoginForm(true)
);


          expect(
            component.errorMessage
          ).toBe('');


          tick(1000);

        }
      )
    );


    // =====================================
    // SIGNUP
    // =====================================

    it(
      'should navigate to signup',
      () => {

        component
          .goToSignup();


        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith([
          '/signup'
        ]);

      }
    );

  }
);