import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick
} from '@angular/core/testing';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  SignupComponent
} from './signup.component';


describe(
  'SignupComponent',
  () => {

    let component:
      SignupComponent;

    let fixture:
      ComponentFixture<SignupComponent>;


    let routerMock: {
      navigate: jest.Mock;
    };


    let alertSpy:
      jest.SpyInstance;


    beforeEach(
      async () => {

        routerMock = {

          navigate:
            jest.fn()

        };


        alertSpy =
          jest.spyOn(
            window,
            'alert'
          )
          .mockImplementation(
            () => {}
          );


        await TestBed
          .configureTestingModule({

            declarations: [
              SignupComponent
            ],

            imports: [
              FormsModule
            ],

            providers: [

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
            SignupComponent
          );


        component =
          fixture.componentInstance;


        fixture.detectChanges();

      }
    );


    afterEach(
      () => {

        alertSpy.mockRestore();

        jest.clearAllMocks();

      }
    );


    it(
      'should create',
      () => {

        expect(
          component
        ).toBeTruthy();

      }
    );


    it(
      'should initialize default values',
      () => {

        expect(
          component.name
        ).toBe('');

        expect(
          component.email
        ).toBe('');

        expect(
          component.password
        ).toBe('');

        expect(
          component.confirmPassword
        ).toBe('');

        expect(
          component.isLoading
        ).toBe(false);

      }
    );


    // -------------------------------------
    // Required fields
    // These tests are intentionally separate
    // for branch coverage of the || chain.
    // -------------------------------------

    it(
      'should show error when name is missing',
      () => {

        component.name =
          '';

        component.email =
          'test@gmail.com';

        component.password =
          '123456';

        component.confirmPassword =
          '123456';


        component.signup();


        expect(
          alertSpy
        ).toHaveBeenCalledWith(
          'Please fill all fields'
        );

      }
    );


    it(
      'should show error when email is missing',
      () => {

        component.name =
          'Rohit';

        component.email =
          '';

        component.password =
          '123456';

        component.confirmPassword =
          '123456';


        component.signup();


        expect(
          alertSpy
        ).toHaveBeenCalledWith(
          'Please fill all fields'
        );

      }
    );


    it(
      'should show error when password is missing',
      () => {

        component.name =
          'Rohit';

        component.email =
          'test@gmail.com';

        component.password =
          '';

        component.confirmPassword =
          '123456';


        component.signup();


        expect(
          alertSpy
        ).toHaveBeenCalledWith(
          'Please fill all fields'
        );

      }
    );


    it(
      'should show error when confirm password is missing',
      () => {

        component.name =
          'Rohit';

        component.email =
          'test@gmail.com';

        component.password =
          '123456';

        component.confirmPassword =
          '';


        component.signup();


        expect(
          alertSpy
        ).toHaveBeenCalledWith(
          'Please fill all fields'
        );

      }
    );


    // =====================================
    // PASSWORD MISMATCH
    // =====================================

    it(
      'should show error when passwords do not match',
      () => {

        component.name =
          'Rohit';

        component.email =
          'test@gmail.com';

        component.password =
          '123456';

        component.confirmPassword =
          '654321';


        component.signup();


        expect(
          alertSpy
        ).toHaveBeenCalledWith(
          'Passwords do not match'
        );


        expect(
          component.isLoading
        ).toBe(false);

      }
    );


    // =====================================
    // SUCCESS
    // =====================================

    it(
      'should complete signup successfully',
      fakeAsync(
        () => {

          component.name =
            'Rohit';

          component.email =
            'test@gmail.com';

          component.password =
            '123456';

          component.confirmPassword =
            '123456';


          component.signup();


          expect(
            component.isLoading
          ).toBe(true);


          tick(1500);


          expect(
            component.isLoading
          ).toBe(false);


          expect(
            alertSpy
          ).toHaveBeenCalledWith(
            'Account created successfully!'
          );


          expect(
            routerMock.navigate
          ).toHaveBeenCalledWith([
            '/login'
          ]);

        }
      )
    );

  }
);