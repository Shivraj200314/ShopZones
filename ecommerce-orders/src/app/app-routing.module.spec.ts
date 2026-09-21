import {
  TestBed
} from '@angular/core/testing';

import {
  Router
} from '@angular/router';

import {
  RouterTestingModule
} from '@angular/router/testing';


describe(
  'AppRoutingModule',
  () => {

    let router:
      Router;


    beforeEach(
      () => {

        TestBed.configureTestingModule({

          imports: [

            RouterTestingModule

          ]

        });


        router =
          TestBed.inject(
            Router
          );

      }
    );


    it(
      'should create router',
      () => {

        expect(
          router
        ).toBeTruthy();

      }
    );

  }
);