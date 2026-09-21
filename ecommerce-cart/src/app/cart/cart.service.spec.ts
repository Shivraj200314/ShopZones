import {
  TestBed
} from '@angular/core/testing';

import {
  CartService
} from './cart.service';


describe(
  'CartService',
  () => {

    let service:
      CartService;


    const productOne = {

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
        1,

      stock:
        5

    };


    const productTwo = {

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
        2,

      stock:
        3

    };


    beforeEach(
      () => {

        TestBed.configureTestingModule({});

        service =
          TestBed.inject(
            CartService
          );

        localStorage.clear();

      }
    );


    afterEach(
      () => {

        localStorage.clear();

        jest.restoreAllMocks();

      }
    );


    // =====================================
    // CREATE
    // =====================================

    it(
      'should be created',
      () => {

        expect(
          service
        ).toBeTruthy();

      }
    );


    // =====================================
    // GET CART - EMPTY
    // =====================================

    it(
      'should return empty array when cart does not exist',
      () => {

        expect(
          service.getCartItems()
        ).toEqual([]);

      }
    );


    // =====================================
    // GET CART - VALID
    // =====================================

    it(
      'should return stored cart items',
      () => {

        localStorage.setItem(
          'shopzone_cart',
          JSON.stringify([
            productOne
          ])
        );


        expect(
          service.getCartItems()
        ).toEqual([
          productOne
        ]);

      }
    );


    // =====================================
    // INVALID JSON
    // =====================================

    it(
      'should return empty array when stored cart JSON is invalid',
      () => {

        const errorSpy =
          jest
            .spyOn(
              console,
              'error'
            )
            .mockImplementation(
              () => {}
            );


        localStorage.setItem(
          'shopzone_cart',
          '{invalid-json'
        );


        const result =
          service.getCartItems();


        expect(
          result
        ).toEqual([]);


        expect(
          errorSpy
        ).toHaveBeenCalled();

      }
    );


    // =====================================
    // INCREASE
    // item exists + below stock
    // =====================================

    it(
      'should increase quantity when product exists and stock is available',
      () => {

        localStorage.setItem(
          'shopzone_cart',
          JSON.stringify([
            productOne
          ])
        );


        const result =
          service.increaseQuantity(
            1
          );


        expect(
          result[0].quantity
        ).toBe(2);


        const saved =
          JSON.parse(
            localStorage.getItem(
              'shopzone_cart'
            )!
          );


        expect(
          saved[0].quantity
        ).toBe(2);

      }
    );


    // =====================================
    // INCREASE
    // item exists but already at stock
    // =====================================

    it(
      'should not increase quantity above stock',
      () => {

        const itemAtStock = {

          ...productOne,

          quantity: 5,

          stock: 5

        };


        localStorage.setItem(
          'shopzone_cart',
          JSON.stringify([
            itemAtStock
          ])
        );


        const result =
          service.increaseQuantity(
            1
          );


        expect(
          result[0].quantity
        ).toBe(5);

      }
    );


    // =====================================
    // INCREASE
    // product does not exist
    // =====================================

    it(
      'should not modify cart when increasing unknown product',
      () => {

        localStorage.setItem(
          'shopzone_cart',
          JSON.stringify([
            productOne
          ])
        );


        const result =
          service.increaseQuantity(
            999
          );


        expect(
          result
        ).toEqual([
          productOne
        ]);

      }
    );


    // =====================================
    // DECREASE
    // item exists and quantity > 1
    // =====================================

    it(
      'should decrease quantity when quantity is greater than one',
      () => {

        const item = {

          ...productOne,

          quantity: 3

        };


        localStorage.setItem(
          'shopzone_cart',
          JSON.stringify([
            item
          ])
        );


        const result =
          service.decreaseQuantity(
            1
          );


        expect(
          result[0].quantity
        ).toBe(2);

      }
    );


    // =====================================
    // DECREASE
    // quantity exactly one
    // =====================================

    it(
      'should not decrease quantity below one',
      () => {

        localStorage.setItem(
          'shopzone_cart',
          JSON.stringify([
            productOne
          ])
        );


        const result =
          service.decreaseQuantity(
            1
          );


        expect(
          result[0].quantity
        ).toBe(1);

      }
    );


    // =====================================
    // DECREASE
    // unknown product
    // =====================================

    it(
      'should not modify cart when decreasing unknown product',
      () => {

        localStorage.setItem(
          'shopzone_cart',
          JSON.stringify([
            productOne
          ])
        );


        const result =
          service.decreaseQuantity(
            999
          );


        expect(
          result
        ).toEqual([
          productOne
        ]);

      }
    );


    // =====================================
    // REMOVE PRODUCT
    // =====================================

    it(
      'should remove product from cart',
      () => {

        localStorage.setItem(
          'shopzone_cart',
          JSON.stringify([
            productOne,
            productTwo
          ])
        );


        const result =
          service.removeItem(
            1
          );


        expect(
          result.length
        ).toBe(1);


        expect(
          result[0].id
        ).toBe(2);


        const saved =
          JSON.parse(
            localStorage.getItem(
              'shopzone_cart'
            )!
          );


        expect(
          saved.length
        ).toBe(1);

      }
    );


    // =====================================
    // REMOVE UNKNOWN PRODUCT
    // =====================================

    it(
      'should keep cart unchanged when removing unknown product',
      () => {

        localStorage.setItem(
          'shopzone_cart',
          JSON.stringify([
            productOne
          ])
        );


        const result =
          service.removeItem(
            999
          );


        expect(
          result
        ).toEqual([
          productOne
        ]);

      }
    );


    // =====================================
    // CLEAR CART
    // =====================================

    it(
      'should clear cart',
      () => {

        localStorage.setItem(
          'shopzone_cart',
          JSON.stringify([
            productOne
          ])
        );


        service.clearCart();


        expect(
          localStorage.getItem(
            'shopzone_cart'
          )
        ).toBeNull();

      }
    );


    // =====================================
    // TOTAL - EMPTY
    // =====================================

    it(
      'should return zero total for empty cart',
      () => {

        expect(
          service.getTotal()
        ).toBe(0);

      }
    );


    // =====================================
    // TOTAL
    // =====================================

    it(
      'should calculate total cart amount',
      () => {

        localStorage.setItem(
          'shopzone_cart',
          JSON.stringify([

            {
              ...productOne,
              price: 1000,
              quantity: 2
            },

            {
              ...productTwo,
              price: 500,
              quantity: 3
            }

          ])
        );


        expect(
          service.getTotal()
        ).toBe(
          3500
        );

      }
    );

  }
);