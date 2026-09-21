import {
  TestBed
} from '@angular/core/testing';

import {
  HttpClientTestingModule
} from '@angular/common/http/testing';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  AppModule
} from './app.module';


describe(
  'AppModule',
  () => {

    beforeEach(
      async () => {

        await TestBed
          .configureTestingModule({

            imports: [

              AppModule,

              HttpClientTestingModule,

              RouterTestingModule

            ]

          })
          .compileComponents();

      }
    );


    it(
      'should load AppModule',
      () => {

        const appModule =
          TestBed.inject(
            AppModule
          );


        expect(
          appModule
        ).toBeTruthy();

      }
    );

  }
);