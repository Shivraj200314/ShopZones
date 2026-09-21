import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  convertToParamMap,
  Router
} from '@angular/router';

import {
  of
} from 'rxjs';

import {
  OrderDetailComponent
} from './order-detail.component';

import {
  OrdersRevampService
} from '../orders/services/orders-revamp.service';

import {
  ORDER_FALLBACK
} from '../orders/core/constants/order-fallback.constants';


describe(
  'OrderDetailComponent',
  () => {


    let component:
      OrderDetailComponent;


    let fixture:
      ComponentFixture<OrderDetailComponent>;


    let routerMock:
      {
        navigate:
          jest.Mock
      };


    let ordersRevampServiceMock:
      {
        getRevampContent:
          jest.Mock
      };


    // ==========================================
    // BEFORE EACH
    // ==========================================

    beforeEach(
      async () => {


        // ======================================
        // ROUTER MOCK
        // ======================================

        routerMock = {

          navigate:
            jest.fn()

        };


        // ======================================
        // REVAMP SERVICE MOCK
        // ======================================

        ordersRevampServiceMock = {

          getRevampContent:
            jest.fn()
              .mockReturnValue(
                of(
                  ORDER_FALLBACK
                )
              )

        };


        // ======================================
        // TEST BED
        // ======================================

        await TestBed
          .configureTestingModule({

            declarations: [

              OrderDetailComponent

            ],

            imports: [

              // Required for:
              // *ngIf
              // *ngFor
              // number pipe
              CommonModule

            ],

            providers: [

              // =================================
              // ACTIVATED ROUTE
              // =================================

              {

                provide:
                  ActivatedRoute,

                useValue: {

                  paramMap:
                    of(

                      convertToParamMap({

                        id:
                          'ORD-1001'

                      })

                    )

                }

              },


              // =================================
              // ROUTER
              // =================================

              {

                provide:
                  Router,

                useValue:
                  routerMock

              },


              // =================================
              // REVAMP SERVICE
              // =================================

              {

                provide:
                  OrdersRevampService,

                useValue:
                  ordersRevampServiceMock

              }

            ]

          })
          .compileComponents();


        fixture =
          TestBed.createComponent(
            OrderDetailComponent
          );


        component =
          fixture.componentInstance;

      }
    );


    // ==========================================
    // AFTER EACH
    // ==========================================

    afterEach(
      () => {

        localStorage.clear();

        jest.clearAllMocks();

      }
    );


    // ==========================================
    // CREATE
    // ==========================================

    it(
      'should create',
      () => {

        fixture.detectChanges();


        expect(
          component
        )
          .toBeTruthy();

      }
    );


    // ==========================================
    // LOAD REVAMP
    // ==========================================

    it(
      'should load revamp content',
      () => {

        fixture.detectChanges();


        expect(
          ordersRevampServiceMock
            .getRevampContent
        )
          .toHaveBeenCalled();


        expect(
          component
            .revampFallback()
        )
          .toEqual(
            ORDER_FALLBACK
          );

      }
    );


    // ==========================================
    // LOAD ORDER FROM STORAGE
    // ==========================================

    it(
      'should load selected order from localStorage',
      () => {

        const orders =
          [

            {

              orderId:
                'ORD-1001',

              status:
                'Placed',

              createdAt:
                '2026-09-16T10:00:00',

              total:
                1000,

              paymentMethod:
                'upi',

              items: [

                {

                  name:
                    'Test Product',

                  price:
                    500,

                  quantity:
                    2

                }

              ]

            }

          ];


        localStorage.setItem(

          'shopzone_orders',

          JSON.stringify(
            orders
          )

        );


        fixture.detectChanges();


        expect(
          component.order
        )
          .toBeTruthy();


        expect(
          component.getOrderId()
        )
          .toBe(
            'ORD-1001'
          );

      }
    );


    // ==========================================
    // NO ORDERS
    // ==========================================

    it(
      'should set order to null when localStorage has no orders',
      () => {

        localStorage.removeItem(
          'shopzone_orders'
        );


        fixture.detectChanges();


        expect(
          component.order
        )
          .toBeNull();

      }
    );


    // ==========================================
    // GET ORDER ITEMS
    // ==========================================

    it(
      'should return order items',
      () => {

        component.order =
          {

            items: [

              {

                name:
                  'Product 1',

                price:
                  100,

                quantity:
                  2

              }

            ]

          } as any;


        expect(
          component
            .getOrderItems()
            .length
        )
          .toBe(
            1
          );

      }
    );


    // ==========================================
    // EMPTY ITEMS
    // ==========================================

    it(
      'should return empty array when order is null',
      () => {

        component.order =
          null;


        expect(
          component.getOrderItems()
        )
          .toEqual(
            []
          );

      }
    );


    // ==========================================
    // ITEM TOTAL
    // ==========================================

    it(
      'should calculate item total',
      () => {

        const item =
          {

            price:
              250,

            quantity:
              3

          };


        expect(
          component.getItemTotal(
            item
          )
        )
          .toBe(
            750
          );

      }
    );


    // ==========================================
    // TOTAL ITEMS
    // ==========================================

    it(
      'should calculate total item quantity',
      () => {

        component.order =
          {

            items: [

              {

                price:
                  100,

                quantity:
                  2

              },

              {

                price:
                  200,

                quantity:
                  3

              }

            ]

          } as any;


        expect(
          component.getTotalItems()
        )
          .toBe(
            5
          );

      }
    );


    // ==========================================
    // STATUS
    // ==========================================

    it(
      'should return order status',
      () => {

        component.order =
          {

            status:
              'Delivered'

          } as any;


        expect(
          component.getOrderStatus()
        )
          .toBe(
            'Delivered'
          );

      }
    );


    // ==========================================
    // DEFAULT STATUS
    // ==========================================

    it(
      'should return default status when status is missing',
      () => {

        component.order =
          {} as any;


        expect(
          component.getOrderStatus()
        )
          .toBe(
            'Placed'
          );

      }
    );


    // ==========================================
    // PAYMENT UPI
    // ==========================================

    it(
      'should format UPI payment method',
      () => {

        component.order =
          {

            paymentMethod:
              'upi'

          } as any;


        expect(
          component.getPaymentMethod()
        )
          .toBe(
            'UPI'
          );

      }
    );


    // ==========================================
    // PAYMENT COD
    // ==========================================

    it(
      'should format COD payment method',
      () => {

        component.order =
          {

            paymentMethod:
              'cod'

          } as any;


        expect(
          component.getPaymentMethod()
        )
          .toBe(
            'Cash on Delivery'
          );

      }
    );


    // ==========================================
    // FORMAT EMPTY DATE
    // ==========================================

    it(
      'should return empty string when date is empty',
      () => {

        expect(
          component.formatDate(
            ''
          )
        )
          .toBe(
            ''
          );

      }
    );


    // ==========================================
    // BACK
    // ==========================================

    it(
      'should navigate back to orders',
      () => {

        component.goBack();


        expect(
          routerMock.navigate
        )
          .toHaveBeenCalledWith(
            [
              '/orders'
            ]
          );

      }
    );

  }
);