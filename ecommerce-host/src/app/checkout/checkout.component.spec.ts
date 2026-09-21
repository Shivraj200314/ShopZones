import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  Router
} from '@angular/router';

import {
  CheckoutComponent
} from './checkout.component';


describe(
  'CheckoutComponent',
  () => {

    let component:
      CheckoutComponent;

    let fixture:
      ComponentFixture<CheckoutComponent>;


    let routerMock: {
      navigate: jest.Mock;
    };


    let alertSpy:
      jest.SpyInstance;


    const validCustomer = {

      fullName:
        'Rohit Yewale',

      email:
        'rohit@gmail.com',

      phone:
        '9876543210',

      address:
        'Pune',

      city:
        'Pune',

      state:
        'Maharashtra',

      pincode:
        '411001'

    };


    beforeEach(
      async () => {

        localStorage.clear();


        routerMock = {

          navigate:
            jest.fn()

        };


        alertSpy =
          jest.spyOn(
            window,
            'alert'
          )
          .mockImplementation(
            () => {}
          );


        await TestBed
          .configureTestingModule({

            declarations: [
              CheckoutComponent
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
            CheckoutComponent,
            {

              set: {
                template: ''
              }

            }
          )
          .compileComponents();


        fixture =
          TestBed.createComponent(
            CheckoutComponent
          );


        component =
          fixture.componentInstance;

      }
    );


    afterEach(
      () => {

        localStorage.clear();

        alertSpy.mockRestore();

        jest.clearAllMocks();

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
    // DEFAULT VALUES
    // =====================================

    it(
      'should initialize default values',
      () => {

        expect(
          component.cartItems
        ).toEqual([]);


        expect(
          component.paymentMethod
        ).toBe('cod');


        expect(
          component.isPlacingOrder
        ).toBe(false);

      }
    );


    // =====================================
    // INIT
    // =====================================

    it(
      'should call loadCart on ngOnInit',
      () => {

        const spy =
          jest.spyOn(
            component,
            'loadCart'
          );


        component
          .ngOnInit();


        expect(
          spy
        ).toHaveBeenCalled();

      }
    );


    // =====================================
    // LOAD CART - NO CART
    // =====================================

    it(
      'should keep cart empty when localStorage has no cart',
      () => {

        component
          .loadCart();


        expect(
          component.cartItems
        ).toEqual([]);

      }
    );


    // =====================================
    // LOAD CART
    // =====================================

    it(
      'should load cart from localStorage',
      () => {

        const cart = [

          {

            id: 1,

            title:
              'Phone',

            price:
              1000,

            quantity:
              2

          }

        ];


        localStorage.setItem(
          'cartItems',
          JSON.stringify(
            cart
          )
        );


        component
          .loadCart();


        expect(
          component.cartItems
        ).toEqual(
          cart
        );

      }
    );


    // =====================================
    // IMAGE - THUMBNAIL
    // =====================================

    it(
      'should return thumbnail when available',
      () => {

        const image =
          component.getProductImage({

            id: 1,

            title:
              'Phone',

            price:
              100,

            quantity:
              1,

            thumbnail:
              'thumb.jpg',

            image:
              'image.jpg'

          });


        expect(
          image
        ).toBe(
          'thumb.jpg'
        );

      }
    );


    // =====================================
    // IMAGE
    // =====================================

    it(
      'should return image when thumbnail is unavailable',
      () => {

        const image =
          component.getProductImage({

            id: 1,

            title:
              'Phone',

            price:
              100,

            quantity:
              1,

            image:
              'image.jpg'

          });


        expect(
          image
        ).toBe(
          'image.jpg'
        );

      }
    );


    // =====================================
    // FALLBACK IMAGE
    // =====================================

    it(
      'should return placeholder when no image exists',
      () => {

        const image =
          component.getProductImage({

            id: 1,

            title:
              'Phone',

            price:
              100,

            quantity:
              1

          });


        expect(
          image
        ).toBe(
          'https://placehold.co/100x100'
        );

      }
    );


    // =====================================
    // ITEM TOTAL
    // =====================================

    it(
      'should calculate item total',
      () => {

        const total =
          component.getItemTotal({

            id: 1,

            title:
              'Phone',

            price:
              500,

            quantity:
              3

          });


        expect(
          total
        ).toBe(1500);

      }
    );


    // =====================================
    // SUBTOTAL EMPTY
    // =====================================

    it(
      'should return zero subtotal for empty cart',
      () => {

        component.cartItems =
          [];


        expect(
          component.subtotal
        ).toBe(0);

      }
    );


    // =====================================
    // SUBTOTAL
    // =====================================

    it(
      'should calculate subtotal',
      () => {

        component.cartItems = [

          {

            id: 1,

            title:
              'A',

            price:
              500,

            quantity:
              2

          },

          {

            id: 2,

            title:
              'B',

            price:
              200,

            quantity:
              1

          }

        ];


        expect(
          component.subtotal
        ).toBe(1200);

      }
    );


    // =====================================
    // DELIVERY ZERO - EMPTY CART
    // =====================================

    it(
      'should return zero delivery charge when subtotal is zero',
      () => {

        component.cartItems =
          [];


        expect(
          component.deliveryCharge
        ).toBe(0);

      }
    );


    // =====================================
    // DELIVERY 99
    // =====================================

    it(
      'should return 99 delivery charge when subtotal is below 999',
      () => {

        component.cartItems = [

          {

            id: 1,

            title:
              'A',

            price:
              500,

            quantity:
              1

          }

        ];


        expect(
          component.deliveryCharge
        ).toBe(99);

      }
    );


    // =====================================
    // DELIVERY FREE
    // =====================================

    it(
      'should return zero delivery charge when subtotal is 999 or above',
      () => {

        component.cartItems = [

          {

            id: 1,

            title:
              'A',

            price:
              999,

            quantity:
              1

          }

        ];


        expect(
          component.deliveryCharge
        ).toBe(0);

      }
    );


    // =====================================
    // GRAND TOTAL
    // =====================================

    it(
      'should calculate grand total',
      () => {

        component.cartItems = [

          {

            id: 1,

            title:
              'A',

            price:
              500,

            quantity:
              1

          }

        ];


        expect(
          component.grandTotal
        ).toBe(599);

      }
    );


    // =====================================
    // VALIDATION HELPER
    // =====================================

    const configureValidCustomer =
      (): void => {

        component.customer = {
          ...validCustomer
        };

      };


    // =====================================
    // MISSING FULL NAME
    // =====================================

    it(
      'should fail validation when fullName is missing',
      () => {

        configureValidCustomer();

        component.customer.fullName =
          '';


        expect(
          component.validateForm()
        ).toBe(false);


        expect(
          alertSpy
        ).toHaveBeenCalledWith(
          'Please fill all delivery details.'
        );

      }
    );


    // =====================================
    // MISSING EMAIL
    // =====================================

    it(
      'should fail validation when email is missing',
      () => {

        configureValidCustomer();

        component.customer.email =
          '';


        expect(
          component.validateForm()
        ).toBe(false);

      }
    );


    // =====================================
    // MISSING PHONE
    // =====================================

    it(
      'should fail validation when phone is missing',
      () => {

        configureValidCustomer();

        component.customer.phone =
          '';


        expect(
          component.validateForm()
        ).toBe(false);

      }
    );


    // =====================================
    // MISSING ADDRESS
    // =====================================

    it(
      'should fail validation when address is missing',
      () => {

        configureValidCustomer();

        component.customer.address =
          '';


        expect(
          component.validateForm()
        ).toBe(false);

      }
    );


    // =====================================
    // MISSING CITY
    // =====================================

    it(
      'should fail validation when city is missing',
      () => {

        configureValidCustomer();

        component.customer.city =
          '';


        expect(
          component.validateForm()
        ).toBe(false);

      }
    );


    // =====================================
    // MISSING STATE
    // =====================================

    it(
      'should fail validation when state is missing',
      () => {

        configureValidCustomer();

        component.customer.state =
          '';


        expect(
          component.validateForm()
        ).toBe(false);

      }
    );


    // =====================================
    // MISSING PINCODE
    // =====================================

    it(
      'should fail validation when pincode is missing',
      () => {

        configureValidCustomer();

        component.customer.pincode =
          '';


        expect(
          component.validateForm()
        ).toBe(false);

      }
    );


    // =====================================
    // INVALID PHONE
    // =====================================

    it(
      'should fail validation for invalid phone',
      () => {

        configureValidCustomer();

        component.customer.phone =
          '12345';


        expect(
          component.validateForm()
        ).toBe(false);


        expect(
          alertSpy
        ).toHaveBeenCalledWith(
          'Please enter a valid 10 digit mobile number.'
        );

      }
    );


    // =====================================
    // INVALID PINCODE
    // =====================================

    it(
      'should fail validation for invalid pincode',
      () => {

        configureValidCustomer();

        component.customer.pincode =
          '123';


        expect(
          component.validateForm()
        ).toBe(false);


        expect(
          alertSpy
        ).toHaveBeenCalledWith(
          'Please enter a valid 6 digit pincode.'
        );

      }
    );


    // =====================================
    // VALID FORM
    // =====================================

    it(
      'should pass validation for valid customer details',
      () => {

        configureValidCustomer();


        expect(
          component.validateForm()
        ).toBe(true);

      }
    );


    // =====================================
    // EMPTY CART ORDER
    // =====================================

    it(
      'should not place order when cart is empty',
      () => {

        component.cartItems =
          [];


        component
          .placeOrder();


        expect(
          alertSpy
        ).toHaveBeenCalledWith(
          'Your cart is empty.'
        );


        expect(
          routerMock.navigate
        ).not.toHaveBeenCalled();

      }
    );


    // =====================================
    // INVALID CUSTOMER ORDER
    // =====================================

    it(
      'should not place order when form validation fails',
      () => {

        component.cartItems = [

          {

            id: 1,

            title:
              'Phone',

            price:
              1000,

            quantity:
              1

          }

        ];


        const validationSpy =
          jest.spyOn(
            component,
            'validateForm'
          )
          .mockReturnValue(
            false
          );


        component
          .placeOrder();


        expect(
          validationSpy
        ).toHaveBeenCalled();


        expect(
          component.isPlacingOrder
        ).toBe(false);


        expect(
          routerMock.navigate
        ).not.toHaveBeenCalled();

      }
    );


    // =====================================
    // PLACE FIRST ORDER
    // =====================================

    it(
      'should place order when cart and customer are valid',
      () => {

        configureValidCustomer();


        component.cartItems = [

          {

            id: 1,

            title:
              'Phone',

            price:
              1000,

            quantity:
              2

          }

        ];


        component.paymentMethod =
          'cod';


        const dateNowSpy =
          jest.spyOn(
            Date,
            'now'
          )
          .mockReturnValue(
            123456789
          );


        const validationSpy =
          jest.spyOn(
            component,
            'validateForm'
          )
          .mockReturnValue(
            true
          );


        localStorage.setItem(
          'cartItems',
          JSON.stringify(
            component.cartItems
          )
        );


        component
          .placeOrder();


        expect(
          validationSpy
        ).toHaveBeenCalled();


        expect(
          component.isPlacingOrder
        ).toBe(true);


        const orders =
          JSON.parse(
            localStorage.getItem(
              'orders'
            )!
          );


        expect(
          orders.length
        ).toBe(1);


        expect(
          orders[0].id
        ).toBe(
          'ORD-123456789'
        );


        expect(
          orders[0].customer
        ).toEqual(
          validCustomer
        );


        expect(
          orders[0].subtotal
        ).toBe(2000);


        expect(
          orders[0].deliveryCharge
        ).toBe(0);


        expect(
          orders[0].total
        ).toBe(2000);


        expect(
          orders[0].paymentMethod
        ).toBe('cod');


        expect(
          orders[0].status
        ).toBe(
          'Order Placed'
        );


        expect(
          orders[0].orderDate
        ).toBeTruthy();


        expect(
          localStorage.getItem(
            'cartItems'
          )
        ).toBeNull();


        expect(
          alertSpy
        ).toHaveBeenCalledWith(
          'Order placed successfully!'
        );


        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith([
          '/orders'
        ]);


        dateNowSpy.mockRestore();

      }
    );


    // =====================================
    // APPEND EXISTING ORDER
    // =====================================

    it(
      'should append new order to existing orders',
      () => {

        configureValidCustomer();


        component.cartItems = [

          {

            id: 2,

            title:
              'Laptop',

            price:
              500,

            quantity:
              1

          }

        ];


        localStorage.setItem(
          'orders',
          JSON.stringify([

            {

              id:
                'OLD-ORDER'

            }

          ])
        );


        jest.spyOn(
          component,
          'validateForm'
        )
        .mockReturnValue(
          true
        );


        component
          .placeOrder();


        const orders =
          JSON.parse(
            localStorage.getItem(
              'orders'
            )!
          );


        expect(
          orders.length
        ).toBe(2);


        expect(
          orders[0].id
        ).toBe(
          'OLD-ORDER'
        );

      }
    );


    // =====================================
    // BACK TO CART
    // =====================================

    it(
      'should navigate back to cart',
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

  }
);