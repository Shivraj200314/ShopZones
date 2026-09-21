import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  NO_ERRORS_SCHEMA
} from '@angular/core';

import {
  SpinnerComponent
} from './spinner.component';

import {
  LoaderService
} from '../loader.service';


describe(
  'SpinnerComponent',
  () => {

    let component:
      SpinnerComponent;

    let fixture:
      ComponentFixture<SpinnerComponent>;

    let loaderService:
      LoaderService;


    beforeEach(
      async () => {

        await TestBed
          .configureTestingModule({

            declarations: [
              SpinnerComponent
            ],

            providers: [
              LoaderService
            ],

            schemas: [
              NO_ERRORS_SCHEMA
            ]

          })
          .overrideComponent(
            SpinnerComponent,
            {
              set: {
                template: ''
              }
            }
          )
          .compileComponents();


        fixture =
          TestBed.createComponent(
            SpinnerComponent
          );


        component =
          fixture.componentInstance;


        loaderService =
          TestBed.inject(
            LoaderService
          );

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
      'should have loader service',
      () => {

        expect(
          loaderService
        ).toBeTruthy();

      }
    );

  }
);