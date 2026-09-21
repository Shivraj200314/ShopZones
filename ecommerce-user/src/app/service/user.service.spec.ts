import {
  TestBed
} from '@angular/core/testing';

import {
  UserService
} from './user.service';


describe(
  'UserService',
  () => {

    let service:
      UserService;


    beforeEach(
      () => {

        TestBed.configureTestingModule({});


        service =
          TestBed.inject(
            UserService
          );


        localStorage.clear();

      }
    );


    afterEach(
      () => {

        localStorage.clear();

      }
    );


    it(
      'should be created',
      () => {

        expect(
          service
        )
          .toBeTruthy();

      }
    );


    it(
      'should login user',
      () => {

        const result =
          service.login(
            'user@gmail.com',
            '123456'
          );


        expect(
          result
        )
          .toBe(
            true
          );


        expect(
          service.isLoggedIn()
        )
          .toBe(
            true
          );

      }
    );


    it(
      'should store logged in user',
      () => {

        service.login(
          'user@gmail.com',
          '123456'
        );


        const user =
          service.getUser();


        expect(
          user
        )
          .toBeTruthy();


        expect(
          user?.email
        )
          .toBe(
            'user@gmail.com'
          );

      }
    );


    it(
      'should update user',
      () => {

        service.updateUser({

          id:
            1,

          fullName:
            'Rohit',

          email:
            'rohit@gmail.com',

          phone:
            '9876543210',

          role:
            'CUSTOMER'

        });


        const user =
          service.getUser();


        expect(
          user?.fullName
        )
          .toBe(
            'Rohit'
          );


        expect(
          user?.phone
        )
          .toBe(
            '9876543210'
          );

      }
    );


    it(
      'should logout user',
      () => {

        service.login(
          'user@gmail.com',
          '123456'
        );


        service.logout();


        expect(
          service.isLoggedIn()
        )
          .toBe(
            false
          );


        expect(
          service.getUser()
        )
          .toBeNull();

      }
    );

  }
);