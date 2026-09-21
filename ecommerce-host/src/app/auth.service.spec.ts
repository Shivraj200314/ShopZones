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

  }
);