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


    beforeEach(
      () => {

        TestBed.configureTestingModule({});

        service =
          TestBed.inject(
            CartService
          );

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
    // INITIAL CART
    // =====================================

    it(
      'should initialize with empty cart',
      () => {

        expect(
          service.getCart()
        ).toEqual([]);

      }
    );


    // =====================================
    // CART OBSERVABLE INITIAL VALUE
    // =====================================

    it(
      'should emit empty cart initially',
      () => {

        const values:
          any[][] = [];


        const subscription =
          service.cart$
            .subscribe(
              cart => {

                values.push(
                  cart
                );

              }
            );


        expect(
          values[0]
        ).toEqual([]);


        subscription.unsubscribe();

      }
    );


    // =====================================
    // ADD PRODUCT WITH DEFAULT QUANTITY
    // =====================================

    it(
      'should add product with default quantity one',
      () => {

        const product = {

          id: 1,

          title:
            'Laptop',

          price:
            50000

        };


        service.addToCart(
          product
        );


        expect(
          service.getCart()
        ).toEqual([

          {

            ...product,

            quantity: 1

          }

        ]);

      }
    );


    // =====================================
    // ADD WITH CUSTOM QUANTITY
    // =====================================

    it(
      'should add product with provided quantity',
      () => {

        const product = {

          id: 1,

          title:
            'Laptop',

          price:
            50000

        };


        service.addToCart(
          product,
          3
        );


        expect(
          service.getCart()[0]
            .quantity
        ).toBe(3);

      }
    );


    // =====================================
    // EXISTING PRODUCT
    // =====================================

    it(
      'should increase quantity when product already exists',
      () => {

        const product = {

          id: 1,

          title:
            'Laptop',

          price:
            50000

        };


        service.addToCart(
          product,
          1
        );


        service.addToCart(
          product,
          2
        );


        const cart =
          service.getCart();


        expect(
          cart.length
        ).toBe(1);


        expect(
          cart[0].quantity
        ).toBe(3);

      }
    );


    // =====================================
    // MULTIPLE PRODUCTS
    // =====================================

    it(
      'should add multiple different products',
      () => {

        service.addToCart({

          id: 1,

          title:
            'Laptop'

        });


        service.addToCart({

          id: 2,

          title:
            'Phone'

        });


        expect(
          service.getCart().length
        ).toBe(2);

      }
    );


    // =====================================
    // OBSERVABLE UPDATE
    // =====================================

    it(
      'should emit updated cart after adding product',
      () => {

        const values:
          any[][] = [];


        const subscription =
          service.cart$
            .subscribe(
              value => {

                values.push(
                  value
                );

              }
            );


        service.addToCart({

          id: 1,

          title:
            'Phone'

        });


        expect(
          values[
            values.length - 1
          ].length
        ).toBe(1);


        subscription.unsubscribe();

      }
    );


    // =====================================
    // COPY PROTECTION
    // =====================================

    it(
      'should return copy of cart array',
      () => {

        service.addToCart({

          id: 1,

          title:
            'Phone'

        });


        const first =
          service.getCart();


        const second =
          service.getCart();


        expect(
          first
        ).not.toBe(second);

      }
    );


    // =====================================
    // REMOVE
    // =====================================

    it(
      'should remove product by id',
      () => {

        service.addToCart({
          id: 1
        });


        service.addToCart({
          id: 2
        });


        service.removeFromCart(
          1
        );


        expect(
          service.getCart()
        ).toEqual([

          expect.objectContaining({
            id: 2
          })

        ]);

      }
    );


    // =====================================
    // REMOVE NON EXISTING
    // =====================================

    it(
      'should keep cart unchanged when removing unknown id',
      () => {

        service.addToCart({
          id: 1
        });


        service.removeFromCart(
          999
        );


        expect(
          service.getCart().length
        ).toBe(1);

      }
    );


    // =====================================
    // CLEAR
    // =====================================

    it(
      'should clear complete cart',
      () => {

        service.addToCart({
          id: 1
        });


        service.addToCart({
          id: 2
        });


        service.clearCart();


        expect(
          service.getCart()
        ).toEqual([]);

      }
    );

  }
);