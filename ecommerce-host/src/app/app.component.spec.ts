import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  NO_ERRORS_SCHEMA
} from '@angular/core';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  AppComponent
} from './app.component';


describe(
  'AppComponent',
  () => {

    let component:
      AppComponent;

    let fixture:
      ComponentFixture<AppComponent>;


    beforeEach(
      async () => {

        await TestBed
          .configureTestingModule({

            declarations: [
              AppComponent
            ],

            imports: [
              RouterTestingModule
            ],

            schemas: [
              NO_ERRORS_SCHEMA
            ]

          })
          .compileComponents();


        fixture =
          TestBed.createComponent(
            AppComponent
          );


        component =
          fixture.componentInstance;

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
      'should initialize mobileMenuOpen as false',
      () => {

        expect(
          component.mobileMenuOpen
        ).toBe(false);

      }
    );


    it(
      'should initialize cartCount as zero',
      () => {

        expect(
          component.cartCount
        ).toBe(0);

      }
    );


    it(
      'should open mobile menu',
      () => {

        component
          .toggleMobileMenu();


        expect(
          component.mobileMenuOpen
        ).toBe(true);

      }
    );


    it(
      'should close mobile menu when toggle is called twice',
      () => {

        component
          .toggleMobileMenu();

        component
          .toggleMobileMenu();


        expect(
          component.mobileMenuOpen
        ).toBe(false);

      }
    );


    it(
      'should close mobile menu',
      () => {

        component.mobileMenuOpen =
          true;


        component
          .closeMobileMenu();


        expect(
          component.mobileMenuOpen
        ).toBe(false);

      }
    );

  }
);