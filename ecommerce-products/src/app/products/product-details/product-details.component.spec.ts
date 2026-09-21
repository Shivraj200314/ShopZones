import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Location
} from '@angular/common';

import {
  of,
  throwError
} from 'rxjs';

import {
  ProductDetailsComponent
} from './product-details.component';

import {
  ProductService
} from '../product.service';

import {
  Product
} from '../product';

import {
  PRODUCT_FALLBACK
} from '../core/constants/product-fallback.constants';


describe(
  'ProductDetailsComponent',
  () => {

    let component:
      ProductDetailsComponent;


    // ==========================================
    // MOCK SERVICES
    // ==========================================

    let productServiceMock: {
      getProductById: jest.Mock;
      addToCart: jest.Mock;
      getCartCount: jest.Mock;
    };


    let routerMock: {
      navigate: jest.Mock;
      navigateByUrl: jest.Mock;
    };


    let locationMock: {
      back: jest.Mock;
    };


    let activatedRouteMock: {
      snapshot: {
        paramMap: {
          get: jest.Mock;
        };
      };
    };


    // ==========================================
    // MOCK PRODUCT
    // ==========================================

    const mockProduct:
      Product = {

        id:
          1,

        name:
          'Test Product',

        brand:
          'Test Brand',

        category:
          'test',

        price:
          100,

        oldPrice:
          120,

        rating:
          4.5,

        reviews:
          10,

        image:
          'test.jpg',

        description:
          'Test product description',

        stock:
          10

      };


    // ==========================================
    // BEFORE EACH
    // ==========================================

    beforeEach(
      () => {

        productServiceMock = {

          getProductById:
            jest.fn(),

          addToCart:
            jest.fn(),

          getCartCount:
            jest.fn()

        };


        routerMock = {

          navigate:
            jest.fn(),

          navigateByUrl:
            jest.fn()

        };


        locationMock = {

          back:
            jest.fn()

        };


        activatedRouteMock = {

          snapshot: {

            paramMap: {

              get:
                jest.fn()
                  .mockReturnValue(
                    '1'
                  )

            }

          }

        };


        // Default service values

        productServiceMock
          .getProductById
          .mockReturnValue(
            of(
              mockProduct
            )
          );


        productServiceMock
          .getCartCount
          .mockReturnValue(
            0
          );


        // ======================================
        // CREATE COMPONENT DIRECTLY
        // ======================================

        component =
          new ProductDetailsComponent(

            activatedRouteMock as any,

            routerMock as any,

            locationMock as any,

            productServiceMock as any

          );


        // ======================================
        // MOCK CONSOLE
        // ======================================

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


        // ======================================
        // MOCK ALERT
        // ======================================

        jest
          .spyOn(
            window,
            'alert'
          )
          .mockImplementation(
            () => {}
          );


        localStorage.clear();

      }
    );


    // ==========================================
    // AFTER EACH
    // ==========================================

    afterEach(
      () => {

        localStorage.clear();

        jest.restoreAllMocks();

      }
    );


    // ==========================================
    // CREATE
    // ==========================================

    it(
      'should create',
      () => {

        expect(
          component
        ).toBeTruthy();

      }
    );


    // ==========================================
    // DEFAULT VALUES
    // ==========================================

    it(
      'should initialize default values',
      () => {

        expect(
          component.quantity
        ).toBe(
          1
        );


        expect(
          component.cartCount
        ).toBe(
          0
        );


        expect(
          component.isLoading
        ).toBe(
          false
        );


        expect(
          component.errorMessage
        ).toBe(
          ''
        );

      }
    );


    // ==========================================
    // REVAMP FALLBACK
    // ==========================================

    it(
      'should initialize revamp fallback',
      () => {

        expect(
          component.revampFallback()
        ).toEqual(
          PRODUCT_FALLBACK
        );

      }
    );


    // ==========================================
    // NG ON INIT
    // ==========================================

    it(
      'should read product id and initialize product and cart count',
      () => {

        const getProductSpy =
          jest.spyOn(
            component,
            'getProduct'
          );


        const cartCountSpy =
          jest.spyOn(
            component,
            'updateCartCount'
          );


        component.ngOnInit();


        expect(
          activatedRouteMock
            .snapshot
            .paramMap
            .get
        ).toHaveBeenCalledWith(
          'id'
        );


        expect(
          component.productId
        ).toBe(
          1
        );


        expect(
          getProductSpy
        ).toHaveBeenCalledTimes(
          1
        );


        expect(
          cartCountSpy
        ).toHaveBeenCalledTimes(
          1
        );

      }
    );


    // ==========================================
    // NG ON INIT - DIFFERENT PRODUCT ID
    // ==========================================

    it(
      'should convert route product id from string to number',
      () => {

        activatedRouteMock
          .snapshot
          .paramMap
          .get
          .mockReturnValue(
            '25'
          );


        component.ngOnInit();


        expect(
          component.productId
        ).toBe(
          25
        );


        expect(
          productServiceMock.getProductById
        ).toHaveBeenCalledWith(
          25
        );

      }
    );


    // ==========================================
    // GET PRODUCT - SUCCESS
    // ==========================================

    it(
      'should load product successfully',
      () => {

        component.productId =
          1;


        component.errorMessage =
          'Old Error';


        productServiceMock
          .getProductById
          .mockReturnValue(
            of(
              mockProduct
            )
          );


        component.getProduct();


        expect(
          productServiceMock.getProductById
        ).toHaveBeenCalledWith(
          1
        );


        expect(
          component.product
        ).toEqual(
          mockProduct
        );


        expect(
          component.errorMessage
        ).toBe(
          ''
        );


        expect(
          component.isLoading
        ).toBe(
          false
        );


        expect(
          console.log
        ).toHaveBeenCalledWith(
          'Product Details:',
          mockProduct
        );

      }
    );


    // ==========================================
    // GET PRODUCT - LOADING START
    // ==========================================

    it(
      'should set loading true before requesting product',
      () => {

        const observableMock = {

          subscribe:
            jest.fn(
              () => {

                expect(
                  component.isLoading
                ).toBe(
                  true
                );

              }
            )

        };


        productServiceMock
          .getProductById
          .mockReturnValue(
            observableMock
          );


        component.productId =
          1;


        component.getProduct();


        expect(
          observableMock.subscribe
        ).toHaveBeenCalled();

      }
    );


    // ==========================================
    // GET PRODUCT - ERROR
    // ==========================================

    it(
      'should handle product API error',
      () => {

        const apiError =
          new Error(
            'API failed'
          );


        productServiceMock
          .getProductById
          .mockReturnValue(
            throwError(
              () =>
                apiError
            )
          );


        component.productId =
          1;


        component.getProduct();


        expect(
          console.error
        ).toHaveBeenCalledWith(
          'Product Details API Error:',
          apiError
        );


        expect(
          component.errorMessage
        ).toBe(
          'Unable to load product details.'
        );


        expect(
          component.isLoading
        ).toBe(
          false
        );

      }
    );


    // ==========================================
    // INCREASE QUANTITY - PRODUCT NOT AVAILABLE
    // ==========================================

    it(
      'should not increase quantity when product is not available',
      () => {

        component.product =
          undefined as any;


        component.quantity =
          1;


        component.increaseQuantity();


        expect(
          component.quantity
        ).toBe(
          1
        );

      }
    );


    // ==========================================
    // INCREASE QUANTITY
    // ==========================================

    it(
      'should increase quantity when below stock',
      () => {

        component.product =
          mockProduct;


        component.quantity =
          1;


        component.increaseQuantity();


        expect(
          component.quantity
        ).toBe(
          2
        );

      }
    );


    // ==========================================
    // INCREASE QUANTITY - STOCK LIMIT
    // ==========================================

    it(
      'should not increase quantity above stock',
      () => {

        component.product =
          mockProduct;


        component.quantity =
          mockProduct.stock;


        component.increaseQuantity();


        expect(
          component.quantity
        ).toBe(
          mockProduct.stock
        );

      }
    );


    // ==========================================
    // DECREASE QUANTITY
    // ==========================================

    it(
      'should decrease quantity when greater than 1',
      () => {

        component.quantity =
          3;


        component.decreaseQuantity();


        expect(
          component.quantity
        ).toBe(
          2
        );

      }
    );


    // ==========================================
    // DECREASE QUANTITY - MINIMUM LIMIT
    // ==========================================

    it(
      'should not decrease quantity below 1',
      () => {

        component.quantity =
          1;


        component.decreaseQuantity();


        expect(
          component.quantity
        ).toBe(
          1
        );

      }
    );


    // ==========================================
    // TOTAL PRICE - NO PRODUCT
    // ==========================================

    it(
      'should return zero total when product is not available',
      () => {

        component.product =
          undefined as any;


        component.quantity =
          3;


        expect(
          component.getTotalPrice()
        ).toBe(
          0
        );

      }
    );


    // ==========================================
    // TOTAL PRICE
    // ==========================================

    it(
      'should calculate total price',
      () => {

        component.product =
          mockProduct;


        component.quantity =
          3;


        expect(
          component.getTotalPrice()
        ).toBe(
          300
        );

      }
    );


    // ==========================================
    // ADD TO CART - NO PRODUCT
    // ==========================================

    it(
      'should not add to cart when product is not available',
      () => {

        component.product =
          undefined as any;


        component.addToCart();


        expect(
          productServiceMock.addToCart
        ).not.toHaveBeenCalled();


        expect(
          window.alert
        ).not.toHaveBeenCalled();

      }
    );


    // ==========================================
    // ADD TO CART
    // ==========================================

    it(
      'should add product to cart',
      () => {

        component.product =
          mockProduct;


        component.quantity =
          2;


        productServiceMock
          .getCartCount
          .mockReturnValue(
            2
          );


        component.addToCart();


        expect(
          productServiceMock.addToCart
        ).toHaveBeenCalledWith(
          mockProduct,
          2
        );


        expect(
          productServiceMock.getCartCount
        ).toHaveBeenCalled();


        expect(
          component.cartCount
        ).toBe(
          2
        );


        expect(
          console.log
        ).toHaveBeenCalledWith(
          'Added to cart:',
          mockProduct.name,
          'Quantity:',
          2
        );


        expect(
          window.alert
        ).toHaveBeenCalledWith(
          'Test Product added to cart'
        );

      }
    );


    // ==========================================
    // UPDATE CART COUNT
    // ==========================================

    it(
      'should update cart count',
      () => {

        productServiceMock
          .getCartCount
          .mockReturnValue(
            5
          );


        component.updateCartCount();


        expect(
          productServiceMock.getCartCount
        ).toHaveBeenCalled();


        expect(
          component.cartCount
        ).toBe(
          5
        );

      }
    );


    // ==========================================
    // BUY NOW - PRODUCT NOT AVAILABLE
    // ==========================================

    it(
      'should stop buyNow when product is not available',
      () => {

        component.product =
          undefined as any;


        component.buyNow();


        expect(
          console.log
        ).toHaveBeenCalledWith(
          'Product not available'
        );


        expect(
          productServiceMock.addToCart
        ).not.toHaveBeenCalled();


        expect(
          routerMock.navigate
        ).not.toHaveBeenCalled();


        expect(
          routerMock.navigateByUrl
        ).not.toHaveBeenCalled();

      }
    );


    // ==========================================
    // BUY NOW - USER NOT LOGGED IN
    // ==========================================

    it(
      'should add product and navigate to login when user is not logged in',
      () => {

        component.product =
          mockProduct;


        component.quantity =
          2;


        localStorage.removeItem(
          'shopzone_user'
        );


        productServiceMock
          .getCartCount
          .mockReturnValue(
            2
          );


        component.buyNow();


        expect(
          console.log
        ).toHaveBeenCalledWith(
          'Logged In User:',
          null
        );


        expect(
          console.log
        ).toHaveBeenCalledWith(
          'User not logged in'
        );


        expect(
          productServiceMock.addToCart
        ).toHaveBeenCalledWith(
          mockProduct,
          2
        );


        expect(
          component.cartCount
        ).toBe(
          2
        );


        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith(

          [
            '/login'
          ],

          {
            queryParams: {

              returnUrl:
                '/checkout'

            }
          }

        );


        expect(
          routerMock.navigateByUrl
        ).not.toHaveBeenCalled();

      }
    );


    // ==========================================
    // BUY NOW - USER LOGGED IN
    // ==========================================

    it(
      'should add product and navigate to checkout when user is logged in',
      () => {

        component.product =
          mockProduct;


        component.quantity =
          3;


        localStorage.setItem(

          'shopzone_user',

          JSON.stringify({

            email:
              'test@test.com'

          })

        );


        productServiceMock
          .getCartCount
          .mockReturnValue(
            3
          );


        component.buyNow();


        expect(
          console.log
        ).toHaveBeenCalledWith(
          'User already logged in'
        );


        expect(
          productServiceMock.addToCart
        ).toHaveBeenCalledWith(
          mockProduct,
          3
        );


        expect(
          component.cartCount
        ).toBe(
          3
        );


        expect(
          console.log
        ).toHaveBeenCalledWith(
          'Buy Now Product:',
          mockProduct
        );


        expect(
          console.log
        ).toHaveBeenCalledWith(
          'Navigating to checkout...'
        );


        expect(
          routerMock.navigateByUrl
        ).toHaveBeenCalledWith(
          '/checkout'
        );


        expect(
          routerMock.navigate
        ).not.toHaveBeenCalled();

      }
    );


    // ==========================================
    // GO BACK
    // ==========================================

    it(
      'should go back',
      () => {

        component.goBack();


        expect(
          locationMock.back
        ).toHaveBeenCalledTimes(
          1
        );

      }
    );

  }
);