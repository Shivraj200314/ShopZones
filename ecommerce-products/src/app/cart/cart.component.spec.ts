import {
  CartComponent
} from './cart.component';

import {
  CartItem
} from './cart-item';


describe(
  'CartComponent',
  () => {

    // ==========================================
    // COMPONENT
    // ==========================================

    let component:
      CartComponent;


    // ==========================================
    // MOCK PRODUCT SERVICE
    // ==========================================

    let productServiceMock: {

      getCartItems:
        jest.Mock;

      updateCartQuantity:
        jest.Mock;

      removeFromCart:
        jest.Mock;

    };


    // ==========================================
    // MOCK ROUTER
    // ==========================================

    let routerMock: {

      navigate:
        jest.Mock;

    };


    // ==========================================
    // MOCK CART ITEM
    // ==========================================

    const mockCartItem:
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
          2,

        stock:
          5

      };


    // ==========================================
    // BEFORE EACH
    // ==========================================

    beforeEach(
      () => {

        // --------------------------------------
        // ProductService mock
        // --------------------------------------

        productServiceMock = {

          getCartItems:
            jest.fn(),

          updateCartQuantity:
            jest.fn(),

          removeFromCart:
            jest.fn()

        };


        // --------------------------------------
        // Router mock
        // --------------------------------------

        routerMock = {

          navigate:
            jest.fn()

        };


        // --------------------------------------
        // Create component manually
        // --------------------------------------
        //
        // We do not need TestBed here because
        // we are testing the TypeScript logic
        // of CartComponent.
        // --------------------------------------

        component =
          new CartComponent(

            productServiceMock as any,

            routerMock as any

          );

      }
    );


    // ==========================================
    // COMPONENT CREATION
    // ==========================================

    it(
      'should create the component',
      () => {

        expect(
          component
        ).toBeTruthy();

      }
    );


    // ==========================================
    // NG ON INIT
    // ==========================================

    it(
      'should call loadCart on ngOnInit',
      () => {

        // Arrange

        const loadCartSpy =
          jest.spyOn(
            component,
            'loadCart'
          );


        // Act

        component.ngOnInit();


        // Assert

        expect(
          loadCartSpy
        ).toHaveBeenCalledTimes(
          1
        );

      }
    );


    // ==========================================
    // LOAD CART
    // ==========================================

    it(
      'should load cart items from ProductService',
      () => {

        // Arrange

        productServiceMock
          .getCartItems
          .mockReturnValue(
            [
              mockCartItem
            ]
          );


        // Act

        component.loadCart();


        // Assert

        expect(
          productServiceMock.getCartItems
        ).toHaveBeenCalledTimes(
          1
        );


        expect(
          component.cartItems
        ).toEqual(
          [
            mockCartItem
          ]
        );

      }
    );


    // ==========================================
    // LOAD EMPTY CART
    // ==========================================

    it(
      'should load an empty cart',
      () => {

        // Arrange

        productServiceMock
          .getCartItems
          .mockReturnValue(
            []
          );


        // Act

        component.loadCart();


        // Assert

        expect(
          component.cartItems
        ).toEqual(
          []
        );

      }
    );


    // ==========================================
    // GET ITEM TOTAL
    // ==========================================

    it(
      'should calculate item total',
      () => {

        // price = 100
        // quantity = 2
        //
        // expected = 200

        const result =
          component.getItemTotal(
            mockCartItem
          );


        expect(
          result
        ).toBe(
          200
        );

      }
    );


    // ==========================================
    // GET SUBTOTAL
    // ==========================================

    it(
      'should calculate cart subtotal',
      () => {

        // Arrange

        const secondItem:
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
              2,

            stock:
              10

          };


        component.cartItems = [

          mockCartItem,

          secondItem

        ];


        // Item 1:
        // 100 * 2 = 200
        //
        // Item 2:
        // 500 * 2 = 1000
        //
        // Total:
        // 1200


        // Act

        const subtotal =
          component.getSubtotal();


        // Assert

        expect(
          subtotal
        ).toBe(
          1200
        );

      }
    );


    // ==========================================
    // GET SUBTOTAL - EMPTY CART
    // ==========================================

    it(
      'should return zero subtotal when cart is empty',
      () => {

        component.cartItems =
          [];


        expect(
          component.getSubtotal()
        ).toBe(
          0
        );

      }
    );


    // ==========================================
    // GET TOTAL
    // ==========================================

    it(
      'should return subtotal as total',
      () => {

        // Arrange

        component.cartItems = [

          mockCartItem

        ];


        // Act

        const total =
          component.getTotal();


        // Assert

        expect(
          total
        ).toBe(
          200
        );

      }
    );


    // ==========================================
    // INCREASE QUANTITY
    // TRUE CONDITION
    // ==========================================

    it(
      'should increase quantity when quantity is less than stock',
      () => {

        // Arrange

        const item:
          CartItem = {

            ...mockCartItem,

            quantity:
              2,

            stock:
              5

          };


        const loadCartSpy =
          jest
            .spyOn(
              component,
              'loadCart'
            )
            .mockImplementation(
              () => {}
            );


        // Act

        component.increaseQuantity(
          item
        );


        // Assert

        expect(
          productServiceMock
            .updateCartQuantity
        ).toHaveBeenCalledWith(
          1,
          3
        );


        expect(
          loadCartSpy
        ).toHaveBeenCalledTimes(
          1
        );

      }
    );


    // ==========================================
    // INCREASE QUANTITY
    // FALSE CONDITION / STOCK LIMIT
    // ==========================================

    it(
      'should not increase quantity when quantity equals stock',
      () => {

        // Arrange

        const item:
          CartItem = {

            ...mockCartItem,

            quantity:
              5,

            stock:
              5

          };


        const loadCartSpy =
          jest.spyOn(
            component,
            'loadCart'
          );


        // Act

        component.increaseQuantity(
          item
        );


        // Assert

        expect(
          productServiceMock
            .updateCartQuantity
        ).not.toHaveBeenCalled();


        expect(
          loadCartSpy
        ).not.toHaveBeenCalled();

      }
    );


    // ==========================================
    // INCREASE QUANTITY
    // QUANTITY ABOVE STOCK
    // ==========================================

    it(
      'should not increase quantity when quantity is greater than stock',
      () => {

        const item:
          CartItem = {

            ...mockCartItem,

            quantity:
              6,

            stock:
              5

          };


        component.increaseQuantity(
          item
        );


        expect(
          productServiceMock
            .updateCartQuantity
        ).not.toHaveBeenCalled();

      }
    );


    // ==========================================
    // DECREASE QUANTITY
    // TRUE CONDITION
    // ==========================================

    it(
      'should decrease quantity when quantity is greater than 1',
      () => {

        // Arrange

        const item:
          CartItem = {

            ...mockCartItem,

            quantity:
              3

          };


        const loadCartSpy =
          jest
            .spyOn(
              component,
              'loadCart'
            )
            .mockImplementation(
              () => {}
            );


        // Act

        component.decreaseQuantity(
          item
        );


        // Assert

        expect(
          productServiceMock
            .updateCartQuantity
        ).toHaveBeenCalledWith(
          1,
          2
        );


        expect(
          loadCartSpy
        ).toHaveBeenCalledTimes(
          1
        );

      }
    );


    // ==========================================
    // DECREASE QUANTITY
    // FALSE CONDITION / MINIMUM QUANTITY
    // ==========================================

    it(
      'should not decrease quantity when quantity is 1',
      () => {

        // Arrange

        const item:
          CartItem = {

            ...mockCartItem,

            quantity:
              1

          };


        const loadCartSpy =
          jest.spyOn(
            component,
            'loadCart'
          );


        // Act

        component.decreaseQuantity(
          item
        );


        // Assert

        expect(
          productServiceMock
            .updateCartQuantity
        ).not.toHaveBeenCalled();


        expect(
          loadCartSpy
        ).not.toHaveBeenCalled();

      }
    );


    // ==========================================
    // REMOVE ITEM
    // ==========================================

    it(
      'should remove item from cart and reload cart',
      () => {

        // Arrange

        const loadCartSpy =
          jest
            .spyOn(
              component,
              'loadCart'
            )
            .mockImplementation(
              () => {}
            );


        // Act

        component.removeItem(
          mockCartItem
        );


        // Assert

        expect(
          productServiceMock
            .removeFromCart
        ).toHaveBeenCalledWith(
          mockCartItem.id
        );


        expect(
          loadCartSpy
        ).toHaveBeenCalledTimes(
          1
        );

      }
    );


    // ==========================================
    // CONTINUE SHOPPING
    // ==========================================

    it(
      'should navigate to products when continueShopping is called',
      () => {

        // Act

        component.continueShopping();


        // Assert

        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith(
          [
            '/products'
          ]
        );

      }
    );


    // ==========================================
    // CHECKOUT
    // CART HAS ITEMS
    // ==========================================

    it(
      'should navigate to checkout when cart has items',
      () => {

        // Arrange

        component.cartItems = [

          mockCartItem

        ];


        // Act

        component.checkout();


        // Assert

        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith(
          [
            '/checkout'
          ]
        );

      }
    );


    // ==========================================
    // CHECKOUT
    // EMPTY CART
    // ==========================================

    it(
      'should not navigate to checkout when cart is empty',
      () => {

        // Arrange

        component.cartItems =
          [];


        // Act

        component.checkout();


        // Assert

        expect(
          routerMock.navigate
        ).not.toHaveBeenCalled();

      }
    );

  }
);