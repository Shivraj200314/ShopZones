import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  Router
} from '@angular/router';

import {
  HomeComponent
} from './home.component';

import {
  SHELL_FALLBACK
} from '../core/constants/shell-fallback.constants';


describe(
  'HomeComponent',
  () => {

    let component:
      HomeComponent;

    let fixture:
      ComponentFixture<HomeComponent>;


    let routerMock: {
      navigate: jest.Mock;
    };


    beforeEach(
      async () => {

        routerMock = {

          navigate:
            jest.fn()

        };


        await TestBed
          .configureTestingModule({

            declarations: [
              HomeComponent
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
          .overrideComponent(
            HomeComponent,
            {

              set: {
                template: ''
              }

            }
          )
          .compileComponents();


        fixture =
          TestBed.createComponent(
            HomeComponent
          );


        component =
          fixture.componentInstance;

      }
    );


    afterEach(
      () => {

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
      'should initialize fallback content',
      () => {

        expect(
          component.revampFallback()
        ).toEqual(
          SHELL_FALLBACK
        );

      }
    );


    it(
      'should navigate to products',
      () => {

        component
          .goToProducts();


        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith([
          '/products'
        ]);

      }
    );


    it(
      'should navigate to selected category',
      () => {

        component
          .goToCategory(
            'electronics'
          );


        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith(

          [
            '/products'
          ],

          {

            queryParams: {

              category:
                'electronics'

            }

          }

        );

      }
    );


    it(
      'should navigate to cart',
      () => {

        component
          .goToCart();


        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith([
          '/cart'
        ]);

      }
    );


    it(
      'should navigate to orders',
      () => {

        component
          .goToOrders();


        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith([
          '/orders'
        ]);

      }
    );

  }
);