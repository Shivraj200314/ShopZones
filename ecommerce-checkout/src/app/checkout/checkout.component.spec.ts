import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule,
  ReactiveFormsModule
} from '@angular/forms';

import {
  HttpClientTestingModule
} from '@angular/common/http/testing';

import {
  RouterTestingModule
} from '@angular/router/testing';

import {
  NO_ERRORS_SCHEMA
} from '@angular/core';

import {
  CheckoutComponent
} from './checkout.component';

import {
  CheckoutRevampService
} from '../service/checkout-revamp.service';

import {
  of
} from 'rxjs';


describe(
  'CheckoutComponent',
  () => {

    let component:
      CheckoutComponent;

    let fixture:
      ComponentFixture<CheckoutComponent>;


    // =====================================================
    // TEST SETUP
    // =====================================================

    beforeEach(
      async () => {

        await TestBed
          .configureTestingModule({

            declarations: [
              CheckoutComponent
            ],

            imports: [
              CommonModule,
              FormsModule,
              ReactiveFormsModule,
              HttpClientTestingModule,
              RouterTestingModule
            ],

            providers: [
              {
                provide: CheckoutRevampService,
                useValue: {
                  getRevampContent: () => of({})
                }
              }
            ],

            schemas: [
              NO_ERRORS_SCHEMA
            ]

          })
          .compileComponents();


        fixture =
          TestBed.createComponent(
            CheckoutComponent
          );


        component =
          fixture.componentInstance;


        // Clear previous browser data
        localStorage.clear();


        // Prevent browser alert problems in Jest
        jest
          .spyOn(
            window,
            'alert'
          )
          .mockImplementation(
            () => {}
          );


        fixture.detectChanges();

      }
    );


    afterEach(
      () => {

        localStorage.clear();

        jest.restoreAllMocks();

      }
    );


    // =====================================================
    // VALID CHECKOUT FORM
    // =====================================================

    const setValidCheckoutForm =
      (): void => {

        component.checkoutForm.setValue({

          fullName:
            'Rohit Yewale',

          email:
            'rohit@gmail.com',

          phone:
            '9876543210',

          address:
            '123 MG Road Pune Maharashtra',

          city:
            'Pune',

          state:
            'Maharashtra',

          pinCode:
            '411001',

          paymentMethod:
            'upi',

          upiId:
            'rohit@upi'

        });


        component.checkoutForm
          .markAsTouched();


        component.checkoutForm
          .updateValueAndValidity();

      };


    // =====================================================
    // TEST CART ITEM
    // =====================================================

    const createCartItem =
      () => {

        return {

          id: 1,

          title:
            'Test Product',

          price:
            1000,

          quantity:
            1,

          stock:
            30,

          category:
            'electronics',

          image:
            'test-image.jpg'

        } as any;

      };


    // =====================================================
    // FIND ORDER STORAGE KEY
    // =====================================================
    //
    // This avoids hard-coding:
    //
    // orders
    // shopzone_orders
    // ecommerce_orders
    //
    // It finds whichever key placeOrder() actually uses.
    // =====================================================

    const getOrderStorageKey =
      (): string | null => {

        for (
          let index = 0;
          index < localStorage.length;
          index++
        ) {

          const key =
            localStorage.key(
              index
            );


          if (!key) {
            continue;
          }


          const value =
            localStorage.getItem(
              key
            );


          if (!value) {
            continue;
          }


          try {

            const parsed =
              JSON.parse(
                value
              );


            if (
              Array.isArray(
                parsed
              )
            ) {

              return key;

            }

          } catch {

            // Ignore non JSON values

          }

        }


        return null;

      };


    // =====================================================
    // CREATE ONE ORDER AND FIND STORAGE KEY
    // =====================================================

    const createFirstOrder =
      (): string => {

        setValidCheckoutForm();


        component.cartItems = [
          createCartItem()
        ];


        component.placeOrder();


        const storageKey =
          getOrderStorageKey();


        expect(
          storageKey
        ).not.toBeNull();


        return storageKey as string;

      };


    // =====================================================
    // 1. COMPONENT CREATION
    // =====================================================

    it(
      'should create',
      () => {

        expect(
          component
        ).toBeTruthy();

      }
    );


    // =====================================================
    // 2. FORM SHOULD EXIST
    // =====================================================

    it(
      'should create checkout form',
      () => {

        expect(
          component.checkoutForm
        ).toBeTruthy();

      }
    );


    // =====================================================
    // 3. REQUIRED CONTROLS
    // =====================================================

    it(
      'should contain required checkout form controls',
      () => {

        expect(
          component.checkoutForm
            .get(
              'fullName'
            )
        ).toBeTruthy();


        expect(
          component.checkoutForm
            .get(
              'email'
            )
        ).toBeTruthy();


        expect(
          component.checkoutForm
            .get(
              'phone'
            )
        ).toBeTruthy();


        expect(
          component.checkoutForm
            .get(
              'address'
            )
        ).toBeTruthy();


        expect(
          component.checkoutForm
            .get(
              'city'
            )
        ).toBeTruthy();


        expect(
          component.checkoutForm
            .get(
              'state'
            )
        ).toBeTruthy();


        expect(
          component.checkoutForm
            .get(
              'pinCode'
            )
        ).toBeTruthy();


        expect(
          component.checkoutForm
            .get(
              'paymentMethod'
            )
        ).toBeTruthy();


        expect(
          component.checkoutForm
            .get(
              'upiId'
            )
        ).toBeTruthy();

      }
    );


    // =====================================================
    // 4. EMPTY FORM INVALID
    // =====================================================

    it(
      'should make empty checkout form invalid',
      () => {

        component.checkoutForm.reset();


        component.checkoutForm
          .updateValueAndValidity();


        expect(
          component.checkoutForm
            .invalid
        ).toBe(true);

      }
    );


    // =====================================================
    // 5. VALID FORM
    // =====================================================

    it(
      'should make form valid with correct values',
      () => {

        setValidCheckoutForm();


        // Helpful only if this test fails.
        Object
          .keys(
            component.checkoutForm
              .controls
          )
          .forEach(
            key => {

              const control =
                component.checkoutForm
                  .get(
                    key
                  );


              if (
                control?.invalid
              ) {

                console.log(
                  'INVALID CONTROL:',
                  key,
                  'VALUE:',
                  control.value,
                  'ERROR:',
                  control.errors
                );

              }

            }
          );


        expect(
          component.checkoutForm
            .valid
        ).toBe(true);

      }
    );


    // =====================================================
    // 6. UPI ID CONTROL
    // =====================================================

    it(
      'should accept valid UPI ID',
      () => {

        setValidCheckoutForm();


        const upiControl =
          component.checkoutForm
            .get(
              'upiId'
            );


        expect(
          upiControl?.value
        ).toBe(
          'rohit@upi'
        );


        expect(
          upiControl?.valid
        ).toBe(true);

      }
    );


    // =====================================================
    // 7. INVALID UPI ID
    // =====================================================

    it(
      'should make UPI ID invalid for invalid value',
      () => {

        setValidCheckoutForm();


        const upiControl =
          component.checkoutForm
            .get(
              'upiId'
            );


        upiControl?.setValue(
          'invalidupi'
        );


        upiControl
          ?.updateValueAndValidity();


        expect(
          upiControl?.invalid
        ).toBe(true);

      }
    );


    // =====================================================
    // 8. INVALID EMAIL
    // =====================================================

    it(
      'should make email invalid for invalid email',
      () => {

        setValidCheckoutForm();


        const control =
          component.checkoutForm
            .get(
              'email'
            );


        control?.setValue(
          'invalid-email'
        );


        control
          ?.updateValueAndValidity();


        expect(
          control?.invalid
        ).toBe(true);

      }
    );


    // =====================================================
    // 9. INVALID PHONE
    // =====================================================

    it(
      'should make phone invalid for invalid phone',
      () => {

        setValidCheckoutForm();


        const control =
          component.checkoutForm
            .get(
              'phone'
            );


        control?.setValue(
          '123'
        );


        control
          ?.updateValueAndValidity();


        expect(
          control?.invalid
        ).toBe(true);

      }
    );


    // =====================================================
    // 10. INVALID PIN CODE
    // =====================================================

    it(
      'should make pin code invalid for invalid pin code',
      () => {

        setValidCheckoutForm();


        const control =
          component.checkoutForm
            .get(
              'pinCode'
            );


        control?.setValue(
          '123'
        );


        control
          ?.updateValueAndValidity();


        expect(
          control?.invalid
        ).toBe(true);

      }
    );


    // =====================================================
    // 11. EMPTY CART
    // =====================================================

    it(
      'should not place order when cart is empty',
      () => {

        setValidCheckoutForm();


        component.cartItems = [];


        const consoleSpy =
          jest
            .spyOn(
              console,
              'log'
            )
            .mockImplementation(
              () => {}
            );


        component.placeOrder();


        expect(
          consoleSpy
        ).toHaveBeenCalledWith(
          'Cart is empty'
        );

      }
    );


    // =====================================================
    // 12. INVALID FORM SHOULD NOT PLACE ORDER
    // =====================================================

    it(
      'should not place order when checkout form is invalid',
      () => {

        component.checkoutForm
          .reset();


        component.cartItems = [
          createCartItem()
        ];


        const consoleSpy =
          jest
            .spyOn(
              console,
              'log'
            )
            .mockImplementation(
              () => {}
            );


        component.placeOrder();


        expect(
          consoleSpy
        ).toHaveBeenCalledWith(
          'Checkout form invalid'
        );

      }
    );


    // =====================================================
    // 13. SUCCESSFULLY PLACE FIRST ORDER
    // =====================================================

    it(
      'should successfully place first order',
      () => {

        setValidCheckoutForm();


        component.cartItems = [
          createCartItem()
        ];


        component.placeOrder();


        const storageKey =
          getOrderStorageKey();


        expect(
          storageKey
        ).not.toBeNull();


        const storedValue =
          localStorage.getItem(
            storageKey as string
          );


        expect(
          storedValue
        ).not.toBeNull();


        const savedOrders =
          JSON.parse(
            storedValue as string
          );


        expect(
          Array.isArray(
            savedOrders
          )
        ).toBe(true);


        expect(
          savedOrders.length
        ).toBe(1);

      }
    );


    it(
      'should decrement shared inventory when an order is placed',
      () => {

        setValidCheckoutForm();

        component.cartItems = [
          {
            ...createCartItem(),
            stock: 29
          }
        ];


        component.placeOrder();


        expect(
          JSON.parse(
            localStorage.getItem(
              'shopzone_inventory_stock'
            ) || '{}'
          )['1']
        ).toBe(28);

      }
    );


    // =====================================================
    // 14. PREPEND ORDER
    // =====================================================

    it(
      'should prepend new order to existing orders',
      () => {

        // ---------------------------------------------
        // First successful order finds actual key used
        // by checkout.component.ts
        // ---------------------------------------------

        const storageKey =
          createFirstOrder();


        // ---------------------------------------------
        // Replace with known existing order
        // ---------------------------------------------

        const existingOrder = {

          id:
            'OLD-ORDER-001',

          orderId:
            'OLD-ORDER-001',

          total:
            500,

          items: []

        };


        localStorage.setItem(

          storageKey,

          JSON.stringify([
            existingOrder
          ])

        );


        // ---------------------------------------------
        // Add new order
        // ---------------------------------------------

        setValidCheckoutForm();


        component.cartItems = [
          {
            ...createCartItem(),
            id: 2,
            title:
              'Second Product',
            price:
              2000
          }
        ];


        component.placeOrder();


        const storedValue =
          localStorage.getItem(
            storageKey
          );


        expect(
          storedValue
        ).not.toBeNull();


        const savedOrders =
          JSON.parse(
            storedValue as string
          );


        expect(
          savedOrders.length
        ).toBe(2);


        // Existing order should now be second
        expect(
          savedOrders[1]
            .orderId ??
          savedOrders[1].id
        ).toBe(
          'OLD-ORDER-001'
        );

      }
    );


    // =====================================================
    // 15. STORED ORDERS NOT ARRAY
    // =====================================================

    it(
      'should ignore existing orders when stored data is not an array',
      () => {

        const storageKey =
          createFirstOrder();


        // Put object instead of array
        localStorage.setItem(

          storageKey,

          JSON.stringify({
            orderId:
              'INVALID-OBJECT'
          })

        );


        setValidCheckoutForm();


        component.cartItems = [
          createCartItem()
        ];


        component.placeOrder();


        const storedValue =
          localStorage.getItem(
            storageKey
          );


        expect(
          storedValue
        ).not.toBeNull();


        const savedOrders =
          JSON.parse(
            storedValue as string
          );


        expect(
          Array.isArray(
            savedOrders
          )
        ).toBe(true);


        expect(
          savedOrders.length
        ).toBe(1);

      }
    );


    // =====================================================
    // 16. INVALID EXISTING ORDERS JSON
    // =====================================================

    it(
      'should handle invalid existing orders JSON',
      () => {

        const storageKey =
          createFirstOrder();


        // Put broken JSON
        localStorage.setItem(
          storageKey,
          '{invalid-json'
        );


        setValidCheckoutForm();


        component.cartItems = [
          createCartItem()
        ];


        const consoleErrorSpy =
          jest
            .spyOn(
              console,
              'error'
            )
            .mockImplementation(
              () => {}
            );


        component.placeOrder();


        expect(
          consoleErrorSpy
        ).toHaveBeenCalled();


        const storedValue =
          localStorage.getItem(
            storageKey
          );


        expect(
          storedValue
        ).not.toBeNull();


        const savedOrders =
          JSON.parse(
            storedValue as string
          );


        expect(
          Array.isArray(
            savedOrders
          )
        ).toBe(true);


        expect(
          savedOrders.length
        ).toBe(1);

      }
    );


    // =====================================================
    // 17. FULL NAME VALUE
    // =====================================================

    it(
      'should set full name correctly',
      () => {

        setValidCheckoutForm();


        expect(
          component.checkoutForm
            .get(
              'fullName'
            )
            ?.value
        ).toBe(
          'Rohit Yewale'
        );

      }
    );


    // =====================================================
    // 18. PAYMENT METHOD
    // =====================================================

    it(
      'should set UPI as payment method',
      () => {

        setValidCheckoutForm();


        expect(
          component.checkoutForm
            .get(
              'paymentMethod'
            )
            ?.value
        ).toBe(
          'upi'
        );

      }
    );


    // =====================================================
    // 19. VALID PHONE
    // =====================================================

    it(
      'should accept valid Indian mobile number',
      () => {

        setValidCheckoutForm();


        expect(
          component.checkoutForm
            .get(
              'phone'
            )
            ?.valid
        ).toBe(true);

      }
    );


    // =====================================================
    // 20. VALID PIN CODE
    // =====================================================

    it(
      'should accept valid pin code',
      () => {

        setValidCheckoutForm();


        expect(
          component.checkoutForm
            .get(
              'pinCode'
            )
            ?.valid
        ).toBe(true);

      }
    );

  }
);