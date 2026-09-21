import {
  CartService
} from './cart.service';

import {
  CartItem
} from '../cart/cart-item';


describe(
  'CartService',
  () => {

    let service:
      CartService;


    // ==========================================
    // MOCK CART ITEM
    // ==========================================

    const mockProduct:
      CartItem = {

        id: 1,

        name:
          'Test Phone',

        brand:
          'Samsung',

        image:
          'phone.jpg',

        price:
          100,

        oldPrice:
          120,

        quantity:
          1,

        stock:
          5

      };


    // ==========================================
    // SECOND MOCK CART ITEM
    // ==========================================

    const secondProduct:
      CartItem = {

        id: 2,

        name:
          'Test Laptop',

        brand:
          'Dell',

        image:
          'laptop.jpg',

        price:
          500,

        oldPrice:
          600,

        quantity:
          1,

        stock:
          10

      };


    // ==========================================
    // BEFORE EACH
    // ==========================================

    beforeEach(
      () => {

        // CartService has no constructor
        // dependencies, therefore we can
        // directly create the service.

        service =
          new CartService();


        jest.clearAllMocks();

      }
    );


    // ==========================================
    // AFTER EACH
    // ==========================================

    afterEach(
      () => {

        jest.clearAllMocks();

      }
    );


    // ==========================================
    // SERVICE CREATION
    // ==========================================

    it(
      'should be created',
      () => {

        expect(
          service
        ).toBeTruthy();

      }
    );


    // ==========================================
    // INITIAL CART
    // ==========================================

    it(
      'should start with an empty cart',
      () => {

        expect(
          service.getItems()
        ).toEqual(
          []
        );

      }
    );


    // ==========================================
    // INITIAL CART OBSERVABLE
    // ==========================================

    it(
      'should initially emit an empty cart',
      () => {

        const emissions:
          CartItem[][] = [];


        const subscription =
          service
            .cartItems$
            .subscribe(
              items => {

                emissions.push(
                  items
                );

              }
            );


        expect(
          emissions[0]
        ).toEqual(
          []
        );


        subscription.unsubscribe();

      }
    );


    // ==========================================
    // ADD NEW PRODUCT
    // ==========================================

    it(
      'should add a new product to cart with quantity 1',
      () => {

        // Product quantity supplied here
        // is intentionally different.
        //
        // addToCart() should always set
        // quantity = 1 for a new product.

        const product:
          CartItem = {

            ...mockProduct,

            quantity:
              4

          };


        service.addToCart(
          product
        );


        const items =
          service.getItems();


        expect(
          items.length
        ).toBe(
          1
        );


        expect(
          items[0].id
        ).toBe(
          mockProduct.id
        );


        expect(
          items[0].name
        ).toBe(
          'Test Phone'
        );


        expect(
          items[0].quantity
        ).toBe(
          1
        );

      }
    );


    // ==========================================
    // ADD EXISTING PRODUCT
    // QUANTITY BELOW STOCK
    // ==========================================

    it(
      'should increase quantity when existing product is added again and stock is available',
      () => {

        service.addToCart(
          mockProduct
        );


        service.addToCart(
          mockProduct
        );


        const items =
          service.getItems();


        expect(
          items.length
        ).toBe(
          1
        );


        expect(
          items[0].quantity
        ).toBe(
          2
        );

      }
    );


    // ==========================================
    // ADD EXISTING PRODUCT
    // STOCK LIMIT
    // ==========================================

    it(
      'should not increase quantity when existing product reaches stock limit',
      () => {

        const product:
          CartItem = {

            ...mockProduct,

            stock:
              2

          };


        // First call:
        // product added with quantity 1.

        service.addToCart(
          product
        );


        // Second call:
        // quantity becomes 2.

        service.addToCart(
          product
        );


        // Third call:
        // quantity === stock,
        // therefore it must NOT increase.

        service.addToCart(
          product
        );


        const items =
          service.getItems();


        expect(
          items[0].quantity
        ).toBe(
          2
        );


        expect(
          items[0].quantity
        ).toBeLessThanOrEqual(
          items[0].stock
        );

      }
    );


    // ==========================================
    // ADD MULTIPLE PRODUCTS
    // ==========================================

    it(
      'should add multiple different products',
      () => {

        service.addToCart(
          mockProduct
        );


        service.addToCart(
          secondProduct
        );


        const items =
          service.getItems();


        expect(
          items.length
        ).toBe(
          2
        );


        expect(
          items[0].id
        ).toBe(
          1
        );


        expect(
          items[1].id
        ).toBe(
          2
        );

      }
    );


    // ==========================================
    // CART OBSERVABLE AFTER ADD
    // ==========================================

    it(
      'should emit updated cart when product is added',
      () => {

        const emissions:
          CartItem[][] = [];


        const subscription =
          service
            .cartItems$
            .subscribe(
              items => {

                emissions.push(
                  items
                );

              }
            );


        service.addToCart(
          mockProduct
        );


        // BehaviorSubject first emits []
        // and then emits updated cart.

        expect(
          emissions.length
        ).toBe(
          2
        );


        expect(
          emissions[1].length
        ).toBe(
          1
        );


        expect(
          emissions[1][0].id
        ).toBe(
          1
        );


        subscription.unsubscribe();

      }
    );


    // ==========================================
    // REMOVE PRODUCT
    // ==========================================

    it(
      'should remove product from cart',
      () => {

        service.addToCart(
          mockProduct
        );


        service.addToCart(
          secondProduct
        );


        service.removeFromCart(
          mockProduct.id
        );


        const items =
          service.getItems();


        expect(
          items.length
        ).toBe(
          1
        );


        expect(
          items[0].id
        ).toBe(
          secondProduct.id
        );

      }
    );


    // ==========================================
    // REMOVE NON-EXISTING PRODUCT
    // ==========================================

    it(
      'should keep existing items when removing unknown product id',
      () => {

        service.addToCart(
          mockProduct
        );


        service.removeFromCart(
          999
        );


        const items =
          service.getItems();


        expect(
          items.length
        ).toBe(
          1
        );


        expect(
          items[0].id
        ).toBe(
          mockProduct.id
        );

      }
    );


    // ==========================================
    // REMOVE SHOULD EMIT
    // ==========================================

    it(
      'should emit updated cart after removing a product',
      () => {

        service.addToCart(
          mockProduct
        );


        const emissions:
          CartItem[][] = [];


        const subscription =
          service
            .cartItems$
            .subscribe(
              items => {

                emissions.push(
                  items
                );

              }
            );


        service.removeFromCart(
          mockProduct.id
        );


        const lastEmission =
          emissions[
            emissions.length - 1
          ];


        expect(
          lastEmission
        ).toEqual(
          []
        );


        subscription.unsubscribe();

      }
    );


    // ==========================================
    // INCREASE QUANTITY
    // PRODUCT EXISTS + STOCK AVAILABLE
    // ==========================================

    it(
      'should increase quantity when item exists and stock is available',
      () => {

        service.addToCart(
          mockProduct
        );


        service.increaseQuantity(
          mockProduct.id
        );


        const items =
          service.getItems();


        expect(
          items[0].quantity
        ).toBe(
          2
        );

      }
    );


    // ==========================================
    // INCREASE QUANTITY
    // PRODUCT DOES NOT EXIST
    // ==========================================

    it(
      'should not increase quantity when item does not exist',
      () => {

        service.addToCart(
          mockProduct
        );


        service.increaseQuantity(
          999
        );


        const items =
          service.getItems();


        expect(
          items[0].quantity
        ).toBe(
          1
        );

      }
    );


    // ==========================================
    // INCREASE QUANTITY
    // STOCK LIMIT
    // ==========================================

    it(
      'should not increase quantity above stock',
      () => {

        const product:
          CartItem = {

            ...mockProduct,

            stock:
              2

          };


        service.addToCart(
          product
        );


        // 1 -> 2

        service.increaseQuantity(
          product.id
        );


        // quantity already equals stock.
        // This call must do nothing.

        service.increaseQuantity(
          product.id
        );


        const items =
          service.getItems();


        expect(
          items[0].quantity
        ).toBe(
          2
        );

      }
    );


    // ==========================================
    // INCREASE QUANTITY SHOULD EMIT
    // ==========================================

    it(
      'should emit updated cart after increasing quantity',
      () => {

        service.addToCart(
          mockProduct
        );


        const emissions:
          CartItem[][] = [];


        const subscription =
          service
            .cartItems$
            .subscribe(
              items => {

                emissions.push(
                  items
                );

              }
            );


        service.increaseQuantity(
          mockProduct.id
        );


        const lastEmission =
          emissions[
            emissions.length - 1
          ];


        expect(
          lastEmission[0].quantity
        ).toBe(
          2
        );


        subscription.unsubscribe();

      }
    );


    // ==========================================
    // DECREASE QUANTITY
    // PRODUCT EXISTS + QUANTITY > 1
    // ==========================================

    it(
      'should decrease quantity when item exists and quantity is greater than 1',
      () => {

        service.addToCart(
          mockProduct
        );


        service.increaseQuantity(
          mockProduct.id
        );


        // Current quantity = 2

        service.decreaseQuantity(
          mockProduct.id
        );


        const items =
          service.getItems();


        expect(
          items[0].quantity
        ).toBe(
          1
        );

      }
    );


    // ==========================================
    // DECREASE QUANTITY
    // PRODUCT DOES NOT EXIST
    // ==========================================

    it(
      'should return without changing cart when decreasing unknown product',
      () => {

        service.addToCart(
          mockProduct
        );


        service.decreaseQuantity(
          999
        );


        const items =
          service.getItems();


        expect(
          items.length
        ).toBe(
          1
        );


        expect(
          items[0].quantity
        ).toBe(
          1
        );

      }
    );


    // ==========================================
    // DECREASE QUANTITY
    // MINIMUM QUANTITY = 1
    // ==========================================

    it(
      'should not decrease quantity below 1',
      () => {

        service.addToCart(
          mockProduct
        );


        // Current quantity is already 1.

        service.decreaseQuantity(
          mockProduct.id
        );


        const items =
          service.getItems();


        expect(
          items[0].quantity
        ).toBe(
          1
        );

      }
    );


    // ==========================================
    // DECREASE SHOULD EMIT
    // ==========================================

    it(
      'should emit updated cart after decreasing quantity',
      () => {

        service.addToCart(
          mockProduct
        );


        service.increaseQuantity(
          mockProduct.id
        );


        const emissions:
          CartItem[][] = [];


        const subscription =
          service
            .cartItems$
            .subscribe(
              items => {

                emissions.push(
                  items
                );

              }
            );


        service.decreaseQuantity(
          mockProduct.id
        );


        const lastEmission =
          emissions[
            emissions.length - 1
          ];


        expect(
          lastEmission[0].quantity
        ).toBe(
          1
        );


        subscription.unsubscribe();

      }
    );


    // ==========================================
    // GET ITEMS
    // ==========================================

    it(
      'should return all cart items',
      () => {

        service.addToCart(
          mockProduct
        );


        service.addToCart(
          secondProduct
        );


        const items =
          service.getItems();


        expect(
          items.length
        ).toBe(
          2
        );

      }
    );


    // ==========================================
    // GET ITEMS RETURNS COPY
    // ==========================================

    it(
      'should return a copy of cart items array',
      () => {

        service.addToCart(
          mockProduct
        );


        const firstResult =
          service.getItems();


        const secondResult =
          service.getItems();


        // The arrays should contain
        // equal data...

        expect(
          firstResult
        ).toEqual(
          secondResult
        );


        // ...but should NOT be
        // the exact same array reference.

        expect(
          firstResult
        ).not.toBe(
          secondResult
        );

      }
    );


    // ==========================================
    // TOTAL ITEMS
    // ==========================================

    it(
      'should return total quantity of all cart items',
      () => {

        service.addToCart(
          mockProduct
        );


        service.addToCart(
          mockProduct
        );


        // Product 1 quantity = 2


        service.addToCart(
          secondProduct
        );


        // Product 2 quantity = 1
        //
        // Total quantity = 3


        expect(
          service.getTotalItems()
        ).toBe(
          3
        );

      }
    );


    // ==========================================
    // TOTAL ITEMS - EMPTY CART
    // ==========================================

    it(
      'should return zero total items for empty cart',
      () => {

        expect(
          service.getTotalItems()
        ).toBe(
          0
        );

      }
    );


    // ==========================================
    // SUBTOTAL
    // ==========================================

    it(
      'should calculate cart subtotal',
      () => {

        // Product 1:
        // price 100 × quantity 2 = 200

        service.addToCart(
          mockProduct
        );


        service.addToCart(
          mockProduct
        );


        // Product 2:
        // price 500 × quantity 1 = 500

        service.addToCart(
          secondProduct
        );


        // Expected subtotal:
        // 200 + 500 = 700

        expect(
          service.getSubtotal()
        ).toBe(
          700
        );

      }
    );


    // ==========================================
    // SUBTOTAL - EMPTY CART
    // ==========================================

    it(
      'should return zero subtotal for empty cart',
      () => {

        expect(
          service.getSubtotal()
        ).toBe(
          0
        );

      }
    );


    // ==========================================
    // CLEAR CART
    // ==========================================

    it(
      'should clear all cart items',
      () => {

        service.addToCart(
          mockProduct
        );


        service.addToCart(
          secondProduct
        );


        expect(
          service.getItems().length
        ).toBe(
          2
        );


        service.clearCart();


        expect(
          service.getItems()
        ).toEqual(
          []
        );

      }
    );


    // ==========================================
    // CLEAR CART SHOULD EMIT EMPTY ARRAY
    // ==========================================

    it(
      'should emit empty array after clearing cart',
      () => {

        service.addToCart(
          mockProduct
        );


        const emissions:
          CartItem[][] = [];


        const subscription =
          service
            .cartItems$
            .subscribe(
              items => {

                emissions.push(
                  items
                );

              }
            );


        service.clearCart();


        const lastEmission =
          emissions[
            emissions.length - 1
          ];


        expect(
          lastEmission
        ).toEqual(
          []
        );


        subscription.unsubscribe();

      }
    );

  }
);