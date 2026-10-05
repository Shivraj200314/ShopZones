import {
  TestBed
} from '@angular/core/testing';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  HttpClientTestingModule
} from '@angular/common/http/testing';

import {
  AuthService
} from './auth.service';


describe(
  'AuthService',
  () => {

    let service:
      AuthService;


    beforeEach(
      () => {

        TestBed.configureTestingModule({

          imports: [
            RouterTestingModule,
            HttpClientTestingModule
          ],

          providers: [
            AuthService
          ]

        });


        service =
          TestBed.inject(
            AuthService
          );


        localStorage.clear();

      }
    );


    afterEach(
      () => {

        localStorage.clear();

        jest.clearAllMocks();

      }
    );


    // =========================================
    // SERVICE CREATION
    // =========================================

    it(
      'should be created',
      () => {

        expect(
          service
        ).toBeTruthy();

      }
    );


    // =========================================
    // IS LOGGED IN
    // =========================================

    it(
      'should return true when access token exists',
      () => {

        localStorage.setItem(
          'access_token',
          'test-token'
        );


        expect(
          service.isLoggedIn()
        ).toBe(true);

      }
    );


    it(
      'should return false when access token does not exist',
      () => {

        localStorage.removeItem(
          'access_token'
        );


        expect(
          service.isLoggedIn()
        ).toBe(false);

      }
    );


    it(
      'should save the selected role for a first login',
      () => {

        expect(
          service.login(
            'seller@example.com',
            'password',
            'seller'
          )
        ).toBe(true);


        expect(
          service.getUserRole()
        ).toBe('SELLER');

      }
    );


    it(
      'should create a new demo profile for a different email',
      () => {

        localStorage.setItem(
          'shopzone_profile',
          JSON.stringify({
            email: 'previous@example.com',
            role: 'CUSTOMER'
          })
        );


        expect(
          service.login(
            'seller@example.com',
            'password',
            'SELLER'
          )
        ).toBe(true);


        expect(
          service.getCurrentUser()
        ).toEqual(
          expect.objectContaining({
            email: 'seller@example.com',
            role: 'SELLER'
          })
        );

      }
    );


    it(
      'should apply the selected role to an existing profile',
      () => {

        localStorage.setItem(
          'shopzone_profile',
          JSON.stringify({
            email: 'owner@example.com',
            role: 'SELLER'
          })
        );


        expect(
          service.login(
            'owner@example.com',
            'password',
            'OWNER'
          )
        ).toBe(true);


        expect(
          service.getUserRole()
        ).toBe('OWNER');


        expect(
          JSON.parse(
            localStorage.getItem('shopzone_profile') || '{}'
          ).role
        ).toBe('OWNER');

      }
    );

  }
);