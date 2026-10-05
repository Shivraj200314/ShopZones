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

import {
  CartItem
} from './cart-item';


describe(
  'CartComponent',
  () => {

    let component:
      CartComponent;

    let fixture:
      ComponentFixture<CartComponent>;


    // =========================================
    // MOCK SERVICES
    // =========================================

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


    // =========================================
    // TEST CART DATA
    // =========================================

    const cartItems:
      CartItem[] = [

        {

          id:
            1,

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

          id:
            2,

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


    // =========================================
    // BEFORE EACH
    // =========================================

    beforeEach(
      async () => {

        // Clear localStorage before each test
        localStorage.clear();


        // =====================================
        // CART SERVICE MOCK
        // =====================================

        cartServiceMock = {

          getCartItems:
            jest
              .fn()
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


        // =====================================
        // REVAMP SERVICE MOCK
        // =====================================

        cartRevampServiceMock = {

          getRevampContent:
            jest
              .fn()
              .mockReturnValue(
                of(
                  CART_FALLBACK
                )
              )

        };


        // =====================================
        // ROUTER MOCK
        // =====================================

        routerMock = {

          navigate:
            jest.fn()

        };


        // =====================================
        // CONSOLE MOCKS
        // =====================================

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


        // =====================================
        // TESTBED
        // =====================================

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


          // ===================================
          // TEMPLATE NOT REQUIRED
          // ===================================

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


        // =====================================
        // CREATE COMPONENT
        // =====================================

        fixture =
          TestBed.createComponent(
            CartComponent
          );


        component =
          fixture.componentInstance;

      }
    );


    // =========================================
    // AFTER EACH
    // =========================================

    afterEach(
      () => {

        localStorage.clear();

        jest.restoreAllMocks();

      }
    );


    // =========================================
    // CREATE
    // =========================================

    it(
      'should create',
      () => {

        expect(
          component
        ).toBeTruthy();

      }
    );


    // =========================================
    // DEFAULT VALUES
    // =========================================

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
        ).toEqual(
          []
        );


        expect(
          component.total
        ).toBe(
          0
        );

      }
    );


    // =========================================
    // NG ON INIT
    // =========================================

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


        component
          .ngOnInit();


        expect(
          loadCartSpy
        ).toHaveBeenCalledTimes(
          1
        );


        expect(
          revampSpy
        ).toHaveBeenCalledTimes(
          1
        );

      }
    );


    // =========================================
    // REVAMP SUCCESS
    // =========================================

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
          cartRevampServiceMock
            .getRevampContent
        ).toHaveBeenCalledTimes(
          1
        );


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


    // =========================================
    // REVAMP ERROR
    // =========================================

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


    // =========================================
    // LOAD CART
    // =========================================

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
          cartServiceMock
            .getCartItems
        ).toHaveBeenCalledTimes(
          1
        );


        expect(
          component.cartItems
        ).toEqual(
          cartItems
        );


        // Laptop:
        // 1000 * 2 = 2000
        //
        // Phone:
        // 500 * 3 = 1500
        //
        // Total = 3500

        expect(
          component.total
        ).toBe(
          3500
        );


        expect(
          console.log
        ).toHaveBeenCalledWith(
          'Cart MFE items:',
          cartItems
        );

      }
    );


    // =========================================
    // LOAD EMPTY CART
    // =========================================

    it(
      'should load empty cart',
      () => {

        cartServiceMock
          .getCartItems
          .mockReturnValue(
            []
          );


        component
          .loadCart();


        expect(
          component.cartItems
        ).toEqual(
          []
        );


        expect(
          component.total
        ).toBe(
          0
        );

      }
    );


    // =========================================
    // CALCULATE EMPTY TOTAL
    // =========================================

    it(
      'should calculate zero total for empty cart',
      () => {

        component.cartItems =
          [];


        component
          .calculateTotal();


        expect(
          component.total
        ).toBe(
          0
        );

      }
    );


    // =========================================
    // CALCULATE TOTAL
    // =========================================

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


    // =========================================
    // INCREASE
    // =========================================

    it(
      'should increase quantity and recalculate total',
      () => {

        const updatedItems:
          CartItem[] = [

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


    // =========================================
    // DECREASE
    // =========================================

    it(
      'should decrease quantity and recalculate total',
      () => {

        const updatedItems:
          CartItem[] = [

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
          component.cartItems
        ).toEqual(
          updatedItems
        );


        expect(
          component.total
        ).toBe(
          1000
        );

      }
    );


    // =========================================
    // REMOVE
    // =========================================

    it(
      'should remove item and recalculate total',
      () => {

        const remainingItems:
          CartItem[] = [

            cartItems[1]

          ];


        cartServiceMock
          .removeItem
          .mockReturnValue(
            remainingItems
          );


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
        ).toEqual(
          remainingItems
        );


        expect(
          component.total
        ).toBe(
          1500
        );

      }
    );


    // =========================================
    // CHECKOUT - EMPTY CART
    // =========================================

    it(
      'should not navigate to checkout when cart is empty',
      () => {

        component.cartItems =
          [];


        component
          .proceedToCheckout();


        expect(
          routerMock.navigate
        ).not.toHaveBeenCalled();


        expect(
          localStorage.getItem(
            'checkout_cart'
          )
        ).toBeNull();

      }
    );


    // =========================================
    // CHECKOUT - NULL CART
    // =========================================

    it(
      'should not navigate to checkout when cart items are unavailable',
      () => {

        component.cartItems =
          null as any;


        component
          .proceedToCheckout();


        expect(
          routerMock.navigate
        ).not.toHaveBeenCalled();

      }
    );


    // =========================================
    // CHECKOUT SUCCESS
    // =========================================

    it(
      'should save checkout data and navigate to checkout',
      () => {

        component.cartItems =
          cartItems;


        component
          .proceedToCheckout();


        // =====================================
        // ROUTER
        // =====================================

        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith([
          '/checkout'
        ]);


        // =====================================
        // LOCAL STORAGE
        // =====================================

        const storedCheckout =
          localStorage.getItem(
            'checkout_cart'
          );


        expect(
          storedCheckout
        ).not.toBeNull();


        const parsedCheckout =
          JSON.parse(
            storedCheckout as string
          );


        expect(
          parsedCheckout.items
        ).toEqual(
          cartItems
        );


        // Quantity:
        // 2 + 3 = 5

        expect(
          parsedCheckout.totalItems
        ).toBe(
          5
        );


        // Total:
        // 1000 * 2
        // +
        // 500 * 3
        // =
        // 3500

        expect(
          parsedCheckout.totalAmount
        ).toBe(
          3500
        );


        expect(
          parsedCheckout.createdAt
        ).toEqual(
          expect.any(
            String
          )
        );


        expect(
          console.log
        ).toHaveBeenCalledWith(
          'Checkout saved cart:',
          expect.objectContaining({

            items:
              cartItems,

            totalItems:
              5,

            totalAmount:
              3500,

            createdAt:
              expect.any(
                String
              )

          })
        );

      }
    );


    // =========================================
    // CHECKOUT DEFAULT QUANTITY
    // =========================================

    it(
      'should use quantity 1 when checkout item quantity is missing',
      () => {

        const itemsWithoutQuantity:
          any[] = [

            {

              id:
                1,

              name:
                'Laptop',

              image:
                'laptop.jpg',

              brand:
                'Brand A',

              price:
                1000,

              stock:
                5

            }

          ];


        component.cartItems =
          itemsWithoutQuantity as any;


        component
          .proceedToCheckout();


        const storedCheckout =
          localStorage.getItem(
            'checkout_cart'
          );


        const parsedCheckout =
          JSON.parse(
            storedCheckout as string
          );


        expect(
          parsedCheckout.totalItems
        ).toBe(
          1
        );


        expect(
          parsedCheckout.totalAmount
        ).toBe(
          1000
        );

      }
    );


    // =========================================
    // CHECKOUT DEFAULT PRICE
    // =========================================

    it(
      'should use zero when checkout item price is missing',
      () => {

        const itemWithoutPrice:
          any[] = [

            {

              id:
                1,

              name:
                'Laptop',

              image:
                'laptop.jpg',

              brand:
                'Brand A',

              quantity:
                2,

              stock:
                5

            }

          ];


        component.cartItems =
          itemWithoutPrice as any;


        component
          .proceedToCheckout();


        const storedCheckout =
          localStorage.getItem(
            'checkout_cart'
          );


        const parsedCheckout =
          JSON.parse(
            storedCheckout as string
          );


        expect(
          parsedCheckout.totalItems
        ).toBe(
          2
        );


        expect(
          parsedCheckout.totalAmount
        ).toBe(
          0
        );

      }
    );


    // =========================================
    // CONTINUE SHOPPING
    // =========================================

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