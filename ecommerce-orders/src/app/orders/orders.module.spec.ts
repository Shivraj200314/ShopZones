import {
  TestBed
} from '@angular/core/testing';

import {
  HttpClientTestingModule
} from '@angular/common/http/testing';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  OrdersModule
} from './orders.module';


describe(
  'OrdersModule',
  () => {

    beforeEach(
      async () => {

        await TestBed
          .configureTestingModule({

            imports: [

              OrdersModule,

              HttpClientTestingModule,

              FormsModule,

              ReactiveFormsModule

            ]

          })
          .compileComponents();

      }
    );


    it(
      'should load OrdersModule',
      () => {

        const module =
          TestBed.inject(
            OrdersModule
          );


        expect(
          module
        ).toBeTruthy();

      }
    );

  }
);