import {
  TestBed
} from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import {
  ProductService
} from './product.service';

import {
  Product
} from './product';

import {
  PRODUCT_FALLBACK
} from './core/constants/product-fallback.constants';


describe(
  'ProductService',
  () => {

    let service:
      ProductService;

    let httpMock:
      HttpTestingController;


    // ==========================================
    // CONSTANTS
    // ==========================================

    const API_URL =
      'https://dummyjson.com/c/c9e0-3a94-4447?limit=100';

    const CART_KEY =
      'shopzone_cart';

    const CUSTOM_PRODUCTS_KEY =
      'shopzone_custom_products';


    // ==========================================
    // MOCK FRONTEND PRODUCT
    // ==========================================

    const mockProduct:
      Product = {

        id: 1,

        name:
          'Test Phone',

        brand:
          'Samsung',

        category:
          'smartphones',

        price:
          100,

        oldPrice:
          120,

        rating:
          4.5,

        reviews:
          2,

        image:
          'phone.jpg',

        description:
          'Test product',

        stock:
          5

      };


    const secondProduct:
      Product = {

        id: 2,

        name:
          'Test Laptop',

        brand:
          'Dell',

        category:
          'laptops',

        price:
          500,

        oldPrice:
          550,

        rating:
          4,

        reviews:
          3,

        image:
          'laptop.jpg',

        description:
          'Test laptop',

        stock:
          10

      };


    // ==========================================
    // MOCK API PRODUCT CREATOR
    // ==========================================

    const createApiProduct =
      (
        overrides: any = {}
      ) => {

        return {

          id: 1,

          title:
            'Test Phone',

          description:
            'Test product',

          category:
            'smartphones',

          price:
            100,

          discountPercentage:
            10,

          rating:
            4.5,

          stock:
            5,

          brand:
            'Samsung',

          thumbnail:
            'phone.jpg',

          reviews: [
            {
              rating: 5,

              comment:
                'Good',

              date:
                '',

              reviewerName:
                'Test User',

              reviewerEmail:
                'test@test.com'
            }
          ],

          ...overrides

        };

      };


    // ==========================================
    // API RESPONSE CREATOR
    // ==========================================

    const createApiResponse =
      (
        products: any[]
      ) => {

        return {

          products:

            products,

          total:
            products.length,

          skip:
            0,

          limit:
            100

        };

      };


    // ==========================================
    // BEFORE EACH
    // ==========================================

    beforeEach(
      () => {

        TestBed.configureTestingModule({

          imports: [

            HttpClientTestingModule

          ],

          providers: [

            ProductService

          ]

        });


        service =
          TestBed.inject(
            ProductService
          );


        httpMock =
          TestBed.inject(
            HttpTestingController
          );


        localStorage.clear();


        // Prevent expected error-path tests
        // from filling the terminal with logs.

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

      }
    );


    // ==========================================
    // AFTER EACH
    // ==========================================

    afterEach(
      () => {

        httpMock.verify();

        localStorage.clear();

        jest.restoreAllMocks();

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


    // =========================================================
    // GET PRODUCTS
    // =========================================================


    // ==========================================
    // GET PRODUCTS - SUCCESS
    // ==========================================

    it(
      'should get and map products from API',
      () => {

        const apiResponse =
          createApiResponse([

            createApiProduct(),

            createApiProduct({

              id:
                2,

              title:
                'Generic Product',

              discountPercentage:
                0,

              brand:
                undefined,

              reviews:
                undefined,

              thumbnail:
                'generic.jpg'

            })

          ]);


        let result:
          Product[] = [];


        service
          .getProducts()
          .subscribe(
            products => {

              result =
                products;

            }
          );


        const request =
          httpMock.expectOne(
            API_URL
          );


        expect(
          request.request.method
        ).toBe(
          'GET'
        );


        request.flush(
          apiResponse
        );


        expect(
          result.length
        ).toBe(
          2
        );


        // ======================================
        // title -> name
        // ======================================

        expect(
          result[0].name
        ).toBe(
          'Test Phone'
        );


        // ======================================
        // thumbnail -> image
        // ======================================

        expect(
          result[0].image
        ).toBe(
          'phone.jpg'
        );


        // ======================================
        // DISCOUNT > 0 BRANCH
        // ======================================

        expect(
          result[0].oldPrice
        ).toBeCloseTo(
          111.11,
          2
        );


        // ======================================
        // REVIEWS PRESENT BRANCH
        // ======================================

        expect(
          result[0].reviews
        ).toBe(
          1
        );


        // ======================================
        // DISCOUNT = 0 BRANCH
        // ======================================

        expect(
          result[1].oldPrice
        ).toBe(
          100
        );


        // ======================================
        // BRAND FALLBACK BRANCH
        // ======================================

        expect(
          result[1].brand
        ).toBe(
          'Generic'
        );


        // ======================================
        // REVIEWS MISSING BRANCH
        // ======================================

        expect(
          result[1].reviews
        ).toBe(
          0
        );

      }
    );


    // ==========================================
    // GET PRODUCTS - MERGE CUSTOM PRODUCTS
    // ==========================================

    it(
      'should merge custom products before API products',
      () => {

        localStorage.setItem(

          CUSTOM_PRODUCTS_KEY,

          JSON.stringify(
            [
              mockProduct
            ]
          )

        );


        let result:
          Product[] = [];


        service
          .getProducts()
          .subscribe(
            products => {

              result =
                products;

            }
          );


        const request =
          httpMock.expectOne(
            API_URL
          );


        request.flush(
          createApiResponse([
            createApiProduct({

              id:
                50,

              title:
                'API Product'

            })
          ])
        );


        expect(
          result.length
        ).toBe(
          2
        );


        expect(
          result[0]
        ).toEqual(
          mockProduct
        );


        expect(
          result[1].id
        ).toBe(
          50
        );

      }
    );


    // ==========================================
    // GET PRODUCTS - NULL RESPONSE
    // ==========================================

    it(
      'should use fallback products when API returns null',
      () => {

        let result:
          Product[] = [];


        service
          .getProducts()
          .subscribe(
            products => {

              result =
                products;

            }
          );


        const request =
          httpMock.expectOne(
            API_URL
          );


        request.flush(
          null
        );


        expect(
          result.length
        ).toBe(
          PRODUCT_FALLBACK.products.length
        );


        expect(
          console.error
        ).toHaveBeenCalled();

      }
    );


    // ==========================================
    // GET PRODUCTS - INVALID PRODUCTS PROPERTY
    // ==========================================

    it(
      'should use fallback when response products is not an array',
      () => {

        let result:
          Product[] = [];


        service
          .getProducts()
          .subscribe(
            products => {

              result =
                products;

            }
          );


        const request =
          httpMock.expectOne(
            API_URL
          );


        request.flush({

          products:
            'invalid',

          total:
            0,

          skip:
            0,

          limit:
            100

        });


        expect(
          result.length
        ).toBe(
          PRODUCT_FALLBACK.products.length
        );


        expect(
          console.error
        ).toHaveBeenCalled();

      }
    );


    // ==========================================
    // GET PRODUCTS - HTTP ERROR
    // ==========================================

    it(
      'should use fallback products when API request fails',
      () => {

        let result:
          Product[] = [];


        service
          .getProducts()
          .subscribe(
            products => {

              result =
                products;

            }
          );


        const request =
          httpMock.expectOne(
            API_URL
          );


        request.flush(

          'Server error',

          {

            status:
              500,

            statusText:
              'Server Error'

          }

        );


        expect(
          result.length
        ).toBe(
          PRODUCT_FALLBACK.products.length
        );


        expect(
          console.error
        ).toHaveBeenCalled();

      }
    );


    // ==========================================
    // FALLBACK + CUSTOM PRODUCTS
    // ==========================================

    it(
      'should merge custom products with fallback products when API fails',
      () => {

        localStorage.setItem(

          CUSTOM_PRODUCTS_KEY,

          JSON.stringify(
            [
              mockProduct
            ]
          )

        );


        let result:
          Product[] = [];


        service
          .getProducts()
          .subscribe(
            products => {

              result =
                products;

            }
          );


        const request =
          httpMock.expectOne(
            API_URL
          );


        request.flush(

          'Failure',

          {

            status:
              500,

            statusText:
              'Error'

          }

        );


        expect(
          result[0]
        ).toEqual(
          mockProduct
        );


        expect(
          result.length
        ).toBe(
          PRODUCT_FALLBACK.products.length + 1
        );

      }
    );


    // =========================================================
    // GET PRODUCT BY ID
    // =========================================================


    // ==========================================
    // CUSTOM PRODUCT FIRST
    // ==========================================

    it(
      'should return custom product without making API request',
      () => {

        service.addCustomProduct(
          mockProduct
        );


        let result:
          Product | undefined;


        service
          .getProductById(
            mockProduct.id
          )
          .subscribe(
            product => {

              result =
                product;

            }
          );


        expect(
          result
        ).toEqual(
          mockProduct
        );


        httpMock.expectNone(
          API_URL
        );

      }
    );


    // ==========================================
    // API PRODUCT BY ID
    // ==========================================

    it(
      'should find product by id from API response',
      () => {

        let result:
          Product | undefined;


        service
          .getProductById(
            2
          )
          .subscribe(
            product => {

              result =
                product;

            }
          );


        const request =
          httpMock.expectOne(
            API_URL
          );


        request.flush(
          createApiResponse([

            createApiProduct({

              id:
                1

            }),

            createApiProduct({

              id:
                2,

              title:
                'Selected Product'

            })

          ])
        );


        expect(
          result?.id
        ).toBe(
          2
        );


        expect(
          result?.name
        ).toBe(
          'Selected Product'
        );

      }
    );


    // ==========================================
    // GET PRODUCT BY ID - NULL RESPONSE
    // ==========================================

    it(
      'should use fallback product when API response is null',
      () => {

        const fallbackProduct =
          PRODUCT_FALLBACK.products[0];


        let result:
          Product | undefined;


        service
          .getProductById(
            fallbackProduct.id
          )
          .subscribe(
            product => {

              result =
                product;

            }
          );


        const request =
          httpMock.expectOne(
            API_URL
          );


        request.flush(
          null
        );


        expect(
          result?.id
        ).toBe(
          fallbackProduct.id
        );


        expect(
          console.error
        ).toHaveBeenCalled();

      }
    );


    // ==========================================
    // GET PRODUCT BY ID - INVALID PRODUCTS
    // ==========================================

    it(
      'should use fallback when API products property is invalid',
      () => {

        const fallbackProduct =
          PRODUCT_FALLBACK.products[0];


        let result:
          Product | undefined;


        service
          .getProductById(
            fallbackProduct.id
          )
          .subscribe(
            product => {

              result =
                product;

            }
          );


        const request =
          httpMock.expectOne(
            API_URL
          );


        request.flush({

          products:
            'invalid',

          total:
            0,

          skip:
            0,

          limit:
            100

        });


        expect(
          result?.id
        ).toBe(
          fallbackProduct.id
        );

      }
    );


    // ==========================================
    // PRODUCT NOT FOUND IN API
    // FALLBACK FOUND
    // ==========================================

    it(
      'should use fallback when product is not found in API response',
      () => {

        const fallbackProduct =
          PRODUCT_FALLBACK.products[0];


        let result:
          Product | undefined;


        service
          .getProductById(
            fallbackProduct.id
          )
          .subscribe(
            product => {

              result =
                product;

            }
          );


        const request =
          httpMock.expectOne(
            API_URL
          );


        request.flush(
          createApiResponse(
            []
          )
        );


        expect(
          result?.id
        ).toBe(
          fallbackProduct.id
        );

      }
    );


    // ==========================================
    // HTTP ERROR - FALLBACK FOUND
    // ==========================================

    it(
      'should use fallback product when product API fails',
      () => {

        const fallbackProduct =
          PRODUCT_FALLBACK.products[0];


        let result:
          Product | undefined;


        service
          .getProductById(
            fallbackProduct.id
          )
          .subscribe(
            product => {

              result =
                product;

            }
          );


        const request =
          httpMock.expectOne(
            API_URL
          );


        request.flush(

          'API Error',

          {

            status:
              500,

            statusText:
              'Server Error'

          }

        );


        expect(
          result?.id
        ).toBe(
          fallbackProduct.id
        );

      }
    );


    // ==========================================
    // PRODUCT NOT FOUND ANYWHERE
    // ==========================================

    it(
      'should throw error when product is missing from API and fallback',
      () => {

        const fallbackIds =
          PRODUCT_FALLBACK.products.map(
            product =>
              product.id
          );


        const missingId =
          Math.max(
            ...fallbackIds,
            0
          ) + 999999;


        let receivedError:
          Error | undefined;


        service
          .getProductById(
            missingId
          )
          .subscribe({

            next:
              () => {},

            error:
              error => {

                receivedError =
                  error;

              }

          });


        const request =
          httpMock.expectOne(
            API_URL
          );


        request.flush(
          createApiResponse(
            []
          )
        );


        expect(
          receivedError
        ).toBeDefined();


        expect(
          receivedError?.message
        ).toContain(
          `Product with id ${missingId} not found in fallback`
        );

      }
    );


    // =========================================================
    // GET CATEGORIES
    // =========================================================

    it(
      'should return unique categories with All first',
      () => {

        const products:
          Product[] = [

            mockProduct,

            secondProduct,

            {

              ...mockProduct,

              id:
                3,

              category:
                'smartphones'

            }

          ];


        expect(
          service.getCategories(
            products
          )
        ).toEqual(
          [
            'All',
            'smartphones',
            'laptops'
          ]
        );

      }
    );


    it(
      'should return only All for empty product array',
      () => {

        expect(
          service.getCategories(
            []
          )
        ).toEqual(
          [
            'All'
          ]
        );

      }
    );


    // =========================================================
    // CUSTOM PRODUCTS
    // =========================================================


    // ==========================================
    // NO CUSTOM PRODUCTS
    // ==========================================

    it(
      'should return empty custom products when localStorage is empty',
      () => {

        expect(
          service.getCustomProducts()
        ).toEqual(
          []
        );

      }
    );


    // ==========================================
    // VALID CUSTOM PRODUCTS
    // ==========================================

    it(
      'should return custom products from localStorage',
      () => {

        localStorage.setItem(

          CUSTOM_PRODUCTS_KEY,

          JSON.stringify(
            [
              mockProduct,
              secondProduct
            ]
          )

        );


        expect(
          service.getCustomProducts()
        ).toEqual(
          [
            mockProduct,
            secondProduct
          ]
        );

      }
    );


    // ==========================================
    // NON ARRAY CUSTOM PRODUCTS
    // ==========================================

    it(
      'should return empty array when custom product storage is not an array',
      () => {

        localStorage.setItem(

          CUSTOM_PRODUCTS_KEY,

          JSON.stringify({

            id:
              1

          })

        );


        expect(
          service.getCustomProducts()
        ).toEqual(
          []
        );

      }
    );


    // ==========================================
    // INVALID CUSTOM PRODUCT JSON
    // ==========================================

    it(
      'should return empty array when custom product JSON is invalid',
      () => {

        localStorage.setItem(

          CUSTOM_PRODUCTS_KEY,

          'invalid-json'

        );


        expect(
          service.getCustomProducts()
        ).toEqual(
          []
        );


        expect(
          console.error
        ).toHaveBeenCalled();

      }
    );


    // ==========================================
    // ADD CUSTOM PRODUCT
    // ==========================================

    it(
      'should add custom product',
      () => {

        service.addCustomProduct(
          mockProduct
        );


        expect(
          service.getCustomProducts()
        ).toEqual(
          [
            mockProduct
          ]
        );

      }
    );


    // ==========================================
    // CUSTOM PRODUCT IS ADDED FIRST
    // ==========================================

    it(
      'should add new custom product at beginning of list',
      () => {

        service.addCustomProduct(
          mockProduct
        );


        service.addCustomProduct(
          secondProduct
        );


        const products =
          service.getCustomProducts();


        expect(
          products[0]
        ).toEqual(
          secondProduct
        );


        expect(
          products[1]
        ).toEqual(
          mockProduct
        );

      }
    );


    // ==========================================
    // DELETE CUSTOM PRODUCT
    // ==========================================

    it(
      'should delete selected custom product',
      () => {

        service.addCustomProduct(
          mockProduct
        );


        service.addCustomProduct(
          secondProduct
        );


        service.deleteCustomProduct(
          mockProduct.id
        );


        expect(
          service.getCustomProducts()
        ).toEqual(
          [
            secondProduct
          ]
        );

      }
    );


    // ==========================================
    // DELETE UNKNOWN CUSTOM PRODUCT
    // ==========================================

    it(
      'should keep custom products when deleting unknown id',
      () => {

        service.addCustomProduct(
          mockProduct
        );


        service.deleteCustomProduct(
          999
        );


        expect(
          service.getCustomProducts()
        ).toEqual(
          [
            mockProduct
          ]
        );

      }
    );


    // =========================================================
    // CART STORAGE
    // =========================================================


    // ==========================================
    // EMPTY CART
    // ==========================================

    it(
      'should return empty cart when cart localStorage does not exist',
      () => {

        expect(
          service.getCartItems()
        ).toEqual(
          []
        );

      }
    );


    // ==========================================
    // VALID CART STORAGE
    // ==========================================

    it(
      'should return stored cart items',
      () => {

        const cart = [

          {

            id:
              1,

            name:
              'Phone',

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

          }

        ];


        localStorage.setItem(

          CART_KEY,

          JSON.stringify(
            cart
          )

        );


        expect(
          service.getCartItems()
        ).toEqual(
          cart
        );

      }
    );


    // ==========================================
    // NON ARRAY CART STORAGE
    // ==========================================

    it(
      'should return empty cart when stored cart is not an array',
      () => {

        localStorage.setItem(

          CART_KEY,

          JSON.stringify({

            id:
              1

          })

        );


        expect(
          service.getCartItems()
        ).toEqual(
          []
        );

      }
    );


    // ==========================================
    // INVALID CART JSON
    // ==========================================

    it(
      'should return empty cart when cart JSON is invalid',
      () => {

        localStorage.setItem(

          CART_KEY,

          'invalid-json'

        );


        expect(
          service.getCartItems()
        ).toEqual(
          []
        );


        expect(
          console.error
        ).toHaveBeenCalled();

      }
    );


    // =========================================================
    // ADD TO CART
    // =========================================================


    // ==========================================
    // NEW PRODUCT DEFAULT QUANTITY
    // ==========================================

    it(
      'should add new product with default quantity 1',
      () => {

        service.addToCart(
          mockProduct
        );


        const cart =
          service.getCartItems();


        expect(
          cart.length
        ).toBe(
          1
        );


        expect(
          cart[0].quantity
        ).toBe(
          1
        );


        expect(
          cart[0].id
        ).toBe(
          mockProduct.id
        );

      }
    );


    // ==========================================
    // NEW PRODUCT EXPLICIT QUANTITY
    // ==========================================

    it(
      'should add new product with supplied quantity',
      () => {

        service.addToCart(
          mockProduct,
          3
        );


        expect(
          service.getCartItems()[0].quantity
        ).toBe(
          3
        );

      }
    );


    // ==========================================
    // EXISTING ITEM - BELOW STOCK
    // ==========================================

    it(
      'should increase quantity for existing cart item',
      () => {

        service.addToCart(
          mockProduct
        );


        service.addToCart(
          mockProduct
        );


        expect(
          service.getCartItems()[0].quantity
        ).toBe(
          2
        );

      }
    );


    // ==========================================
    // EXISTING ITEM - ABOVE STOCK
    // ==========================================

    it(
      'should limit existing cart item quantity to stock',
      () => {

        service.addToCart(
          mockProduct,
          4
        );


        service.addToCart(
          mockProduct,
          10
        );


        expect(
          service.getCartItems()[0].quantity
        ).toBe(
          mockProduct.stock
        );

      }
    );


    // =========================================================
    // CART COUNT
    // =========================================================

    it(
      'should return zero cart count when cart is empty',
      () => {

        expect(
          service.getCartCount()
        ).toBe(
          0
        );

      }
    );


    it(
      'should return total quantity for all cart products',
      () => {

        service.addToCart(
          mockProduct,
          2
        );


        service.addToCart(
          secondProduct,
          3
        );


        expect(
          service.getCartCount()
        ).toBe(
          5
        );

      }
    );


    // =========================================================
    // REMOVE FROM CART
    // =========================================================

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


        expect(
          service.getCartItems()
        ).toEqual(
          [
            expect.objectContaining({

              id:
                secondProduct.id

            })
          ]
        );

      }
    );


    it(
      'should keep cart unchanged when removing unknown product id',
      () => {

        service.addToCart(
          mockProduct
        );


        service.removeFromCart(
          999
        );


        expect(
          service.getCartItems().length
        ).toBe(
          1
        );

      }
    );


    // =========================================================
    // CLEAR CART
    // =========================================================

    it(
      'should clear cart',
      () => {

        service.addToCart(
          mockProduct
        );


        service.clearCart();


        expect(
          service.getCartItems()
        ).toEqual(
          []
        );

      }
    );


    // =========================================================
    // UPDATE CART QUANTITY
    // =========================================================


    // ==========================================
    // NORMAL QUANTITY
    // ==========================================

    it(
      'should update cart quantity normally',
      () => {

        service.addToCart(
          mockProduct
        );


        service.updateCartQuantity(
          mockProduct.id,
          3
        );


        expect(
          service.getCartItems()[0].quantity
        ).toBe(
          3
        );

      }
    );


    // ==========================================
    // PRODUCT DOES NOT EXIST
    // ==========================================

    it(
      'should return without changing cart when update product does not exist',
      () => {

        service.addToCart(
          mockProduct
        );


        service.updateCartQuantity(
          999,
          3
        );


        expect(
          service.getCartItems()[0].quantity
        ).toBe(
          1
        );

      }
    );


    // ==========================================
    // QUANTITY BELOW 1
    // ==========================================

    it(
      'should set minimum quantity to 1',
      () => {

        service.addToCart(
          mockProduct
        );


        service.updateCartQuantity(
          mockProduct.id,
          0
        );


        expect(
          service.getCartItems()[0].quantity
        ).toBe(
          1
        );

      }
    );


    // ==========================================
    // QUANTITY ABOVE STOCK
    // ==========================================

    it(
      'should set maximum quantity to product stock',
      () => {

        service.addToCart(
          mockProduct
        );


        service.updateCartQuantity(
          mockProduct.id,
          100
        );


        expect(
          service.getCartItems()[0].quantity
        ).toBe(
          mockProduct.stock
        );

      }
    );


    // =========================================================
    // CART TOTAL
    // =========================================================

    it(
      'should return zero cart total when cart is empty',
      () => {

        expect(
          service.getCartTotal()
        ).toBe(
          0
        );

      }
    );


    it(
      'should calculate total cart amount',
      () => {

        service.addToCart(
          mockProduct,
          2
        );


        service.addToCart(
          secondProduct,
          3
        );


        // 100 * 2 = 200
        // 500 * 3 = 1500
        // Total = 1700

        expect(
          service.getCartTotal()
        ).toBe(
          1700
        );

      }
    );

  }
);