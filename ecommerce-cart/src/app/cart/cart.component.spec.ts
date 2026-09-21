import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  Router
} from '@angular/router';

import {
  of,
  throwError
} from 'rxjs';

import {
  CartComponent
} from './cart.component';

import {
  CartService
} from './cart.service';

import {
  CartRevampService
} from '../service/cart-revamp.service';

import {
  CART_FALLBACK
} from './core/constants/cart-fallback.constants';


describe(
  'CartComponent',
  () => {

    let component:
      CartComponent;

    let fixture:
      ComponentFixture<CartComponent>;


    let cartServiceMock: {

      getCartItems:
        jest.Mock;

      increaseQuantity:
        jest.Mock;

      decreaseQuantity:
        jest.Mock;

      removeItem:
        jest.Mock;

    };


    let cartRevampServiceMock: {

      getRevampContent:
        jest.Mock;

    };


    let routerMock: {

      navigate:
        jest.Mock;

    };


    const cartItems = [

      {

        id: 1,

        name:
          'Laptop',

        image:
          'laptop.jpg',

        brand:
          'Brand A',

        price:
          1000,

        quantity:
          2,

        stock:
          5

      },

      {

        id: 2,

        name:
          'Phone',

        image:
          'phone.jpg',

        brand:
          'Brand B',

        price:
          500,

        quantity:
          3,

        stock:
          10

      }

    ];


    beforeEach(
      async () => {

        cartServiceMock = {

          getCartItems:
            jest.fn()
              .mockReturnValue(
                []
              ),

          increaseQuantity:
            jest.fn(),

          decreaseQuantity:
            jest.fn(),

          removeItem:
            jest.fn()

        };


        cartRevampServiceMock = {

          getRevampContent:
            jest.fn()
              .mockReturnValue(
                of(
                  CART_FALLBACK
                )
              )

        };


        routerMock = {

          navigate:
            jest.fn()

        };


        jest
          .spyOn(
            console,
            'log'
          )
          .mockImplementation(
            () => {}
          );


        jest
          .spyOn(
            console,
            'error'
          )
          .mockImplementation(
            () => {}
          );


        await TestBed
          .configureTestingModule({

            declarations: [
              CartComponent
            ],

            providers: [

              {
                provide:
                  CartService,

                useValue:
                  cartServiceMock
              },

              {
                provide:
                  CartRevampService,

                useValue:
                  cartRevampServiceMock
              },

              {
                provide:
                  Router,

                useValue:
                  routerMock
              }

            ]

          })

          // TypeScript unit testing only.
          // Prevents template dependencies
          // affecting logic coverage.
          .overrideComponent(
            CartComponent,
            {

              set: {

                template:
                  ''

              }

            }
          )

          .compileComponents();


        fixture =
          TestBed.createComponent(
            CartComponent
          );


        component =
          fixture.componentInstance;

      }
    );


    afterEach(
      () => {

        jest.restoreAllMocks();

      }
    );


    // =====================================
    // CREATE
    // =====================================

    it(
      'should create',
      () => {

        expect(
          component
        ).toBeTruthy();

      }
    );


    // =====================================
    // DEFAULTS
    // =====================================

    it(
      'should initialize default values',
      () => {

        expect(
          component.revampFallback()
        ).toEqual(
          CART_FALLBACK
        );


        expect(
          component.cartItems
        ).toEqual([]);


        expect(
          component.total
        ).toBe(0);

      }
    );


    // =====================================
    // ON INIT
    // =====================================

    it(
      'should load cart and revamp content on init',
      () => {

        const loadCartSpy =
          jest
            .spyOn(
              component,
              'loadCart'
            )
            .mockImplementation(
              () => {}
            );


        const revampSpy =
          jest
            .spyOn(
              component,
              'loadRevampContent'
            )
            .mockImplementation(
              () => {}
            );


        component.ngOnInit();


        expect(
          loadCartSpy
        ).toHaveBeenCalled();


        expect(
          revampSpy
        ).toHaveBeenCalled();

      }
    );


    // =====================================
    // REVAMP SUCCESS
    // =====================================

    it(
      'should update fallback when revamp content loads successfully',
      () => {

        const response = {

          cart: {

            title:
              'API Cart'

          }

        };


        cartRevampServiceMock
          .getRevampContent
          .mockReturnValue(
            of(
              response
            )
          );


        component
          .loadRevampContent();


        expect(
          component.revampFallback()
        ).toEqual(
          response
        );


        expect(
          console.log
        ).toHaveBeenCalledWith(
          'Cart Revamp Response:',
          response
        );

      }
    );


    // =====================================
    // REVAMP ERROR
    // =====================================

    it(
      'should use CART_FALLBACK when revamp content fails',
      () => {

        const error =
          new Error(
            'API failed'
          );


        cartRevampServiceMock
          .getRevampContent
          .mockReturnValue(
            throwError(
              () => error
            )
          );


        component
          .loadRevampContent();


        expect(
          console.error
        ).toHaveBeenCalledWith(
          'Cart Revamp Error:',
          error
        );


        expect(
          component.revampFallback()
        ).toEqual(
          CART_FALLBACK
        );

      }
    );


    // =====================================
    // LOAD CART
    // =====================================

    it(
      'should load cart items and calculate total',
      () => {

        cartServiceMock
          .getCartItems
          .mockReturnValue(
            cartItems
          );


        component
          .loadCart();


        expect(
          component.cartItems
        ).toEqual(
          cartItems
        );


        expect(
          component.total
        ).toBe(
          3500
        );


        expect(
          cartServiceMock
            .getCartItems
        ).toHaveBeenCalled();

      }
    );


    // =====================================
    // EMPTY CART TOTAL
    // =====================================

    it(
      'should calculate zero total for empty cart',
      () => {

        component.cartItems =
          [];


        component
          .calculateTotal();


        expect(
          component.total
        ).toBe(0);

      }
    );


    // =====================================
    // TOTAL
    // =====================================

    it(
      'should calculate cart total',
      () => {

        component.cartItems =
          cartItems;


        component
          .calculateTotal();


        expect(
          component.total
        ).toBe(
          3500
        );

      }
    );


    // =====================================
    // INCREASE
    // =====================================

    it(
      'should increase quantity and recalculate total',
      () => {

        const updatedItems = [

          {

            ...cartItems[0],

            quantity:
              3

          }

        ];


        cartServiceMock
          .increaseQuantity
          .mockReturnValue(
            updatedItems
          );


        component
          .increase(
            1
          );


        expect(
          cartServiceMock
            .increaseQuantity
        ).toHaveBeenCalledWith(
          1
        );


        expect(
          component.cartItems
        ).toEqual(
          updatedItems
        );


        expect(
          component.total
        ).toBe(
          3000
        );

      }
    );


    // =====================================
    // DECREASE
    // =====================================

    it(
      'should decrease quantity and recalculate total',
      () => {

        const updatedItems = [

          {

            ...cartItems[0],

            quantity:
              1

          }

        ];


        cartServiceMock
          .decreaseQuantity
          .mockReturnValue(
            updatedItems
          );


        component
          .decrease(
            1
          );


        expect(
          cartServiceMock
            .decreaseQuantity
        ).toHaveBeenCalledWith(
          1
        );


        expect(
          component.total
        ).toBe(
          1000
        );

      }
    );


    // =====================================
    // REMOVE
    // =====================================

    it(
      'should remove item and recalculate total',
      () => {

        cartServiceMock
          .removeItem
          .mockReturnValue([
            cartItems[1]
          ]);


        component
          .remove(
            1
          );


        expect(
          cartServiceMock
            .removeItem
        ).toHaveBeenCalledWith(
          1
        );


        expect(
          component.cartItems
        ).toEqual([
          cartItems[1]
        ]);


        expect(
          component.total
        ).toBe(
          1500
        );

      }
    );


    // =====================================
    // CHECKOUT
    // =====================================

    it(
      'should navigate to checkout',
      () => {

        component
          .checkout();


        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith([
          '/checkout'
        ]);

      }
    );


    // =====================================
    // CONTINUE SHOPPING
    // =====================================

    it(
      'should navigate to products',
      () => {

        component
          .continueShopping();


        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith([
          '/products'
        ]);

      }
    );

  }
);