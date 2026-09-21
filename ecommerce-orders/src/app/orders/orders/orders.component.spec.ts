import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';

import {
  of,
  throwError
} from 'rxjs';

import {
  OrdersComponent
} from './orders.component';

import {
  OrdersRevampService
} from '../services/orders-revamp.service';

import {
  ORDER_FALLBACK
} from '../core/constants/order-fallback.constants';


describe(
  'OrdersComponent',
  () => {

    let component:
      OrdersComponent;

    let fixture:
      ComponentFixture<OrdersComponent>;


    // ==========================================
    // MOCK ORDERS REVAMP SERVICE
    // ==========================================

    const mockOrdersRevampService = {

      getRevampContent:
        jest.fn()

    };


    // ==========================================
    // TEST ORDER FACTORY
    // ==========================================

    const createOrder =
      (
        overrides: any = {}
      ): any => {

        return {

          orderId:
            'ORD-001',

          status:
            'Placed',

          createdAt:
            '2026-09-10T10:00:00.000Z',

          paymentMethod:
            'cod',

          customer: {

            fullName:
              'Rohit Yewale',

            city:
              'Pune',

            address:
              'Test Address',

            pinCode:
              '411001',

            phone:
              '9876543210',

            email:
              'rohit@gmail.com'

          },

          items: [

            {

              id: 1,

              name:
                'Laptop',

              image:
                'laptop.jpg',

              price:
                1000,

              quantity:
                2

            }

          ],

          total:
            2000,

          ...overrides

        };

      };


    // ==========================================
    // BEFORE EACH
    // ==========================================

    beforeEach(
      async () => {

        // Clear localStorage
        localStorage.clear();


        // ======================================
        // RESET REVAMP MOCK
        // ======================================

        mockOrdersRevampService
          .getRevampContent
          .mockReset();


        // Default successful response
        mockOrdersRevampService
          .getRevampContent
          .mockReturnValue(
            of(
              ORDER_FALLBACK
            )
          );


        // ======================================
        // MOCK CONSOLE LOG
        // ======================================

        jest
          .spyOn(
            console,
            'log'
          )
          .mockImplementation(
            () => {}
          );


        // ======================================
        // MOCK CONSOLE ERROR
        // ======================================

        jest
          .spyOn(
            console,
            'error'
          )
          .mockImplementation(
            () => {}
          );


        // ======================================
        // TEST BED
        // ======================================

        await TestBed
          .configureTestingModule({

            declarations: [

              OrdersComponent

            ],

            providers: [

              {
                provide:
                  OrdersRevampService,

                useValue:
                  mockOrdersRevampService
              }

            ]

          })


          // ====================================
          // REMOVE HTML FOR TS LOGIC TESTING
          // ====================================

          .overrideComponent(
            OrdersComponent,
            {

              set: {

                template:
                  ''

              }

            }
          )


          .compileComponents();


        // ======================================
        // CREATE COMPONENT
        // ======================================

        fixture =
          TestBed.createComponent(
            OrdersComponent
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
      'should initialize with empty orders',
      () => {

        expect(
          component.orders
        ).toEqual([]);


        expect(
          component.searchControl.value
        ).toBe('');

      }
    );


    // ==========================================
    // DEFAULT REVAMP FALLBACK
    // ==========================================

    it(
      'should initialize revampFallback with ORDER_FALLBACK',
      () => {

        expect(
          component.revampFallback()
        ).toEqual(
          ORDER_FALLBACK
        );

      }
    );


    // ==========================================
    // ON INIT
    // ==========================================

    it(
      'should load revamp content, orders and start search on init',
      () => {

        const revampSpy =
          jest
            .spyOn(
              component,
              'loadRevampContent'
            )
            .mockImplementation(
              () => {}
            );


        const loadSpy =
          jest
            .spyOn(
              component,
              'loadOrders'
            )
            .mockImplementation(
              () => {}
            );


        const searchSpy =
          jest
            .spyOn(
              component,
              'searchOrders'
            )
            .mockImplementation(
              () => {}
            );


        component.ngOnInit();


        expect(
          revampSpy
        ).toHaveBeenCalledTimes(1);


        expect(
          loadSpy
        ).toHaveBeenCalledTimes(1);


        expect(
          searchSpy
        ).toHaveBeenCalledTimes(1);

      }
    );


    // ==========================================
    // LOAD REVAMP CONTENT - SUCCESS
    // ==========================================

    it(
      'should load revamp content successfully',
      () => {

        const revampContent = {

          ...ORDER_FALLBACK,

          'order-list': {

            ...ORDER_FALLBACK[
              'order-list'
            ],

            title:
              'Updated Orders'

          }

        };


        mockOrdersRevampService
          .getRevampContent
          .mockReturnValue(
            of(
              revampContent
            )
          );


        component.loadRevampContent();


        expect(
          mockOrdersRevampService
            .getRevampContent
        ).toHaveBeenCalledTimes(1);


        expect(
          component
            .revampFallback()
            ['order-list']
            ['title']
        ).toBe(
          'Updated Orders'
        );

      }
    );


    // ==========================================
    // LOAD REVAMP CONTENT - FALLBACK
    // ==========================================

    it(
      'should use ORDER_FALLBACK when revamp content fails',
      () => {

        mockOrdersRevampService
          .getRevampContent
          .mockReturnValue(

            throwError(
              () =>
                new Error(
                  'Revamp API failed'
                )
            )

          );


        component.loadRevampContent();


        expect(
          console.error
        ).toHaveBeenCalled();


        expect(
          component.revampFallback()
        ).toEqual(
          ORDER_FALLBACK
        );

      }
    );


    // ==========================================
    // LOAD - NO STORAGE
    // ==========================================

    it(
      'should return empty orders when localStorage has no orders',
      () => {

        component.loadOrders();


        expect(
          component.orders
        ).toEqual([]);


        expect(
          (component as any)
            .allOrders
        ).toEqual([]);

      }
    );


    // ==========================================
    // LOAD - NOT ARRAY
    // ==========================================

    it(
      'should return empty orders when stored value is not an array',
      () => {

        localStorage.setItem(
          'shopzone_orders',

          JSON.stringify({

            orderId:
              'INVALID'

          })
        );


        component.loadOrders();


        expect(
          component.orders
        ).toEqual([]);


        expect(
          (component as any)
            .allOrders
        ).toEqual([]);

      }
    );


    // ==========================================
    // INVALID JSON
    // ==========================================

    it(
      'should handle invalid order JSON',
      () => {

        localStorage.setItem(
          'shopzone_orders',
          '{invalid-json'
        );


        component.loadOrders();


        expect(
          component.orders
        ).toEqual([]);


        expect(
          (component as any)
            .allOrders
        ).toEqual([]);


        expect(
          console.error
        ).toHaveBeenCalled();

      }
    );


    // ==========================================
    // LOAD + SORT
    // ==========================================

    it(
      'should load orders and sort latest order first',
      () => {

        const oldOrder =
          createOrder({

            orderId:
              'OLD',

            createdAt:
              '2026-09-01T10:00:00.000Z'

          });


        const newOrder =
          createOrder({

            orderId:
              'NEW',

            createdAt:
              '2026-09-12T10:00:00.000Z'

          });


        localStorage.setItem(

          'shopzone_orders',

          JSON.stringify([

            oldOrder,

            newOrder

          ])

        );


        component.loadOrders();


        expect(
          component.orders.length
        ).toBe(2);


        expect(
          component.getOrderId(
            component.orders[0]
          )
        ).toBe(
          'NEW'
        );


        expect(
          component.getOrderId(
            component.orders[1]
          )
        ).toBe(
          'OLD'
        );

      }
    );


    // ==========================================
    // EMPTY FILTER
    // ==========================================

    it(
      'should return all orders for empty search',
      () => {

        const orders = [

          createOrder({
            orderId:
              'A'
          }),

          createOrder({
            orderId:
              'B'
          })

        ];


        (component as any)
          .allOrders =
            orders;


        let result:
          any[] = [];


        component
          .filterOrders(
            '   '
          )
          .subscribe(
            value => {

              result =
                value;

            }
          );


        expect(
          result
        ).toEqual(
          orders
        );


        // New array should be returned
        expect(
          result
        ).not.toBe(
          orders
        );

      }
    );


    // ==========================================
    // ORDER ID SEARCH
    // ==========================================

    it(
      'should filter by order id',
      () => {

        const order =
          createOrder();


        (component as any)
          .allOrders = [
            order
          ];


        let result:
          any[] = [];


        component
          .filterOrders(
            'ord-001'
          )
          .subscribe(
            value => {

              result =
                value;

            }
          );


        expect(
          result
        ).toEqual([
          order
        ]);

      }
    );


    // ==========================================
    // STATUS SEARCH
    // ==========================================

    it(
      'should filter by status',
      () => {

        const order =
          createOrder({

            status:
              'Shipped'

          });


        (component as any)
          .allOrders = [
            order
          ];


        let result:
          any[] = [];


        component
          .filterOrders(
            'shipped'
          )
          .subscribe(
            value => {

              result =
                value;

            }
          );


        expect(
          result
        ).toEqual([
          order
        ]);

      }
    );


    // ==========================================
    // PRODUCT NAME SEARCH
    // ==========================================

    it(
      'should filter by product name',
      () => {

        const order =
          createOrder();


        (component as any)
          .allOrders = [
            order
          ];


        let result:
          any[] = [];


        component
          .filterOrders(
            'laptop'
          )
          .subscribe(
            value => {

              result =
                value;

            }
          );


        expect(
          result
        ).toEqual([
          order
        ]);

      }
    );


    // ==========================================
    // PRODUCT TITLE FALLBACK
    // ==========================================

    it(
      'should search product title when name is missing',
      () => {

        const order =
          createOrder({

            items: [

              {

                name:
                  '',

                title:
                  'Mobile Phone',

                price:
                  100,

                quantity:
                  1

              }

            ]

          });


        (component as any)
          .allOrders = [
            order
          ];


        let result:
          any[] = [];


        component
          .filterOrders(
            'mobile'
          )
          .subscribe(
            value => {

              result =
                value;

            }
          );


        expect(
          result
        ).toEqual([
          order
        ]);

      }
    );


    // ==========================================
    // PRODUCT NAME/TITLE BOTH MISSING
    // ==========================================

    it(
      'should handle product with no name or title',
      () => {

        const order =
          createOrder({

            items: [

              {

                name:
                  '',

                title:
                  '',

                price:
                  100,

                quantity:
                  1

              }

            ]

          });


        (component as any)
          .allOrders = [
            order
          ];


        let result:
          any[] = [];


        component
          .filterOrders(
            'not-found'
          )
          .subscribe(
            value => {

              result =
                value;

            }
          );


        expect(
          result
        ).toEqual([]);

      }
    );


    // ==========================================
    // PAYMENT SEARCH
    // ==========================================

    it(
      'should filter by payment method',
      () => {

        const order =
          createOrder();


        (component as any)
          .allOrders = [
            order
          ];


        let result:
          any[] = [];


        component
          .filterOrders(
            'cash'
          )
          .subscribe(
            value => {

              result =
                value;

            }
          );


        expect(
          result
        ).toEqual([
          order
        ]);

      }
    );


    // ==========================================
    // CUSTOMER SEARCH
    // ==========================================

    it(
      'should filter by customer name',
      () => {

        const order =
          createOrder();


        (component as any)
          .allOrders = [
            order
          ];


        let result:
          any[] = [];


        component
          .filterOrders(
            'rohit'
          )
          .subscribe(
            value => {

              result =
                value;

            }
          );


        expect(
          result
        ).toEqual([
          order
        ]);

      }
    );


    // ==========================================
    // CITY SEARCH
    // ==========================================

    it(
      'should filter by customer city',
      () => {

        const order =
          createOrder();


        (component as any)
          .allOrders = [
            order
          ];


        let result:
          any[] = [];


        component
          .filterOrders(
            'pune'
          )
          .subscribe(
            value => {

              result =
                value;

            }
          );


        expect(
          result
        ).toEqual([
          order
        ]);

      }
    );


    // ==========================================
    // NO MATCH
    // ==========================================

    it(
      'should return empty array when search has no match',
      () => {

        const order =
          createOrder();


        (component as any)
          .allOrders = [
            order
          ];


        let result:
          any[] = [];


        component
          .filterOrders(
            'something-that-does-not-exist'
          )
          .subscribe(
            value => {

              result =
                value;

            }
          );


        expect(
          result
        ).toEqual([]);

      }
    );


    // ==========================================
    // SEARCH PIPELINE
    // ==========================================

    it(
      'should update orders after debounced search',
      fakeAsync(
        () => {

          const order =
            createOrder();


          (component as any)
            .allOrders = [
              order
            ];


          component.searchOrders();


          component
            .searchControl
            .setValue(
              'laptop'
            );


          tick(
            300
          );


          expect(
            component.orders
          ).toEqual([
            order
          ]);


          component.ngOnDestroy();

        }
      )
    );


    // ==========================================
    // DISTINCT UNTIL CHANGED
    // ==========================================

    it(
      'should ignore duplicate search values',
      fakeAsync(
        () => {

          const order =
            createOrder();


          (component as any)
            .allOrders = [
              order
            ];


          const filterSpy =
            jest.spyOn(
              component,
              'filterOrders'
            );


          component.searchOrders();


          component
            .searchControl
            .setValue(
              'laptop'
            );


          tick(
            300
          );


          component
            .searchControl
            .setValue(
              'laptop'
            );


          tick(
            300
          );


          expect(
            filterSpy
          ).toHaveBeenCalledTimes(
            1
          );


          component.ngOnDestroy();

        }
      )
    );


    // ==========================================
    // NULL SEARCH
    // Covers: searchText ?? ''
    // ==========================================

    it(
      'should treat null search value as empty string',
      fakeAsync(
        () => {

          const order =
            createOrder();


          (component as any)
            .allOrders = [
              order
            ];


          const filterSpy =
            jest.spyOn(
              component,
              'filterOrders'
            );


          component.searchOrders();


          component
            .searchControl
            .setValue(
              null as any
            );


          tick(
            300
          );


          expect(
            filterSpy
          ).toHaveBeenCalledWith(
            ''
          );


          component.ngOnDestroy();

        }
      )
    );


    // ==========================================
    // ORDER ID - orderId
    // ==========================================

    it(
      'should return orderId',
      () => {

        expect(
          component.getOrderId(
            {

              orderId:
                'ORD-999'

            } as any
          )
        ).toBe(
          'ORD-999'
        );

      }
    );


    // ==========================================
    // ORDER ID - OLD ID
    // ==========================================

    it(
      'should support old numeric id',
      () => {

        expect(
          component.getOrderId(
            {

              id:
                123

            } as any
          )
        ).toBe(
          '123'
        );

      }
    );


    // ==========================================
    // ORDER ID 0
    // ==========================================

    it(
      'should support zero order id',
      () => {

        expect(
          component.getOrderId(
            {

              id:
                0

            } as any
          )
        ).toBe(
          '0'
        );

      }
    );


    // ==========================================
    // ORDER ID MISSING
    // ==========================================

    it(
      'should return empty string when order id is missing',
      () => {

        expect(
          component.getOrderId(
            {} as any
          )
        ).toBe(
          ''
        );

      }
    );


    it(
      'should return empty string when old id is null',
      () => {

        expect(
          component.getOrderId(
            {

              id:
                null

            } as any
          )
        ).toBe(
          ''
        );

      }
    );


    // ==========================================
    // STATUS
    // ==========================================

    it(
      'should return existing order status',
      () => {

        expect(
          component.getOrderStatus(
            {

              status:
                'Delivered'

            } as any
          )
        ).toBe(
          'Delivered'
        );

      }
    );


    it(
      'should return Placed when status is missing',
      () => {

        expect(
          component.getOrderStatus(
            {} as any
          )
        ).toBe(
          'Placed'
        );

      }
    );


    // ==========================================
    // ITEMS
    // ==========================================

    it(
      'should return order items when items is an array',
      () => {

        const items = [

          {

            name:
              'Phone'

          }

        ];


        expect(
          component.getOrderItems(
            {

              items

            } as any
          )
        ).toBe(
          items
        );

      }
    );


    it(
      'should return empty items when items is not an array',
      () => {

        expect(
          component.getOrderItems(
            {

              items:
                {}

            } as any
          )
        ).toEqual([]);

      }
    );


    it(
      'should return empty items when items is missing',
      () => {

        expect(
          component.getOrderItems(
            {} as any
          )
        ).toEqual([]);

      }
    );


    // ==========================================
    // CUSTOMER NAME
    // ==========================================

    it(
      'should return empty customer name when customer is missing',
      () => {

        expect(
          component.getCustomerName(
            {} as any
          )
        ).toBe(
          ''
        );

      }
    );


    it(
      'should use fullName when available',
      () => {

        expect(
          component.getCustomerName(
            {

              customer: {

                fullName:
                  'Rohit Yewale'

              }

            } as any
          )
        ).toBe(
          'Rohit Yewale'
        );

      }
    );


    it(
      'should support old firstName and lastName structure',
      () => {

        expect(
          component.getCustomerName(
            {

              customer: {

                firstName:
                  'Rohit',

                lastName:
                  'Yewale'

              }

            } as any
          )
        ).toBe(
          'Rohit Yewale'
        );

      }
    );


    it(
      'should support only firstName',
      () => {

        expect(
          component.getCustomerName(
            {

              customer: {

                firstName:
                  'Rohit'

              }

            } as any
          )
        ).toBe(
          'Rohit'
        );

      }
    );


    it(
      'should support only lastName',
      () => {

        expect(
          component.getCustomerName(
            {

              customer: {

                lastName:
                  'Yewale'

              }

            } as any
          )
        ).toBe(
          'Yewale'
        );

      }
    );


    it(
      'should return empty name for empty customer object',
      () => {

        expect(
          component.getCustomerName(
            {

              customer:
                {}

            } as any
          )
        ).toBe(
          ''
        );

      }
    );


    // ==========================================
    // CUSTOMER CITY
    // ==========================================

    it(
      'should return customer city',
      () => {

        expect(
          component.getCustomerCity(
            {

              customer: {

                city:
                  'Pune'

              }

            } as any
          )
        ).toBe(
          'Pune'
        );

      }
    );


    it(
      'should return empty city when customer is missing',
      () => {

        expect(
          component.getCustomerCity(
            {} as any
          )
        ).toBe(
          ''
        );

      }
    );


    // ==========================================
    // PAYMENT - COD
    // ==========================================

    it(
      'should return Cash on Delivery for cod',
      () => {

        expect(
          component.getPaymentMethod(
            {

              paymentMethod:
                'cod'

            } as any
          )
        ).toBe(
          'Cash on Delivery'
        );

      }
    );


    it(
      'should return Cash on Delivery for cash on delivery',
      () => {

        expect(
          component.getPaymentMethod(
            {

              paymentMethod:
                'cash on delivery'

            } as any
          )
        ).toBe(
          'Cash on Delivery'
        );

      }
    );


    it(
      'should return Cash on Delivery for cash',
      () => {

        expect(
          component.getPaymentMethod(
            {

              paymentMethod:
                'cash'

            } as any
          )
        ).toBe(
          'Cash on Delivery'
        );

      }
    );


    // ==========================================
    // PAYMENT - UPI
    // ==========================================

    it(
      'should return UPI',
      () => {

        expect(
          component.getPaymentMethod(
            {

              paymentMethod:
                'upi'

            } as any
          )
        ).toBe(
          'UPI'
        );

      }
    );


    // ==========================================
    // PAYMENT - CREDIT CARD
    // ==========================================

    it(
      'should return Credit Card',
      () => {

        expect(
          component.getPaymentMethod(
            {

              paymentMethod:
                'credit-card'

            } as any
          )
        ).toBe(
          'Credit Card'
        );

      }
    );


    // ==========================================
    // PAYMENT - DEBIT CARD
    // ==========================================

    it(
      'should return Debit Card',
      () => {

        expect(
          component.getPaymentMethod(
            {

              paymentMethod:
                'debit-card'

            } as any
          )
        ).toBe(
          'Debit Card'
        );

      }
    );


    // ==========================================
    // PAYMENT - CARD
    // ==========================================

    it(
      'should return Card Payment',
      () => {

        expect(
          component.getPaymentMethod(
            {

              paymentMethod:
                'card'

            } as any
          )
        ).toBe(
          'Card Payment'
        );

      }
    );


    // ==========================================
    // PAYMENT - NET BANKING
    // ==========================================

    it(
      'should return Net Banking',
      () => {

        expect(
          component.getPaymentMethod(
            {

              paymentMethod:
                'netbanking'

            } as any
          )
        ).toBe(
          'Net Banking'
        );

      }
    );


    // ==========================================
    // PAYMENT - WALLET
    // ==========================================

    it(
      'should return Wallet',
      () => {

        expect(
          component.getPaymentMethod(
            {

              paymentMethod:
                'wallet'

            } as any
          )
        ).toBe(
          'Wallet'
        );

      }
    );


    // ==========================================
    // PAYMENT - ONLINE
    // ==========================================

    it(
      'should return Online Payment for online',
      () => {

        expect(
          component.getPaymentMethod(
            {

              paymentMethod:
                'online'

            } as any
          )
        ).toBe(
          'Online Payment'
        );

      }
    );


    // ==========================================
    // PAYMENT NESTED OBJECT
    // ==========================================

    it(
      'should support payment method from payment object',
      () => {

        expect(
          component.getPaymentMethod(
            {

              payment: {

                method:
                  'upi'

              }

            } as any
          )
        ).toBe(
          'UPI'
        );

      }
    );


    // ==========================================
    // PAYMENT FROM CUSTOMER
    // ==========================================

    it(
      'should support payment method from customer',
      () => {

        expect(
          component.getPaymentMethod(
            {

              customer: {

                paymentMethod:
                  'cod'

              }

            } as any
          )
        ).toBe(
          'Cash on Delivery'
        );

      }
    );


    // ==========================================
    // PAYMENT CASE + SPACE
    // ==========================================

    it(
      'should normalize payment method case and spaces',
      () => {

        expect(
          component.getPaymentMethod(
            {

              paymentMethod:
                '  UPI  '

            } as any
          )
        ).toBe(
          'UPI'
        );

      }
    );


    // ==========================================
    // PAYMENT MISSING
    // ==========================================

    it(
      'should return Not Available when payment method is missing',
      () => {

        expect(
          component.getPaymentMethod(
            {} as any
          )
        ).toBe(
          'Not Available'
        );

      }
    );


    // ==========================================
    // PAYMENT UNKNOWN
    // ==========================================

    it(
      'should return Not Available for unknown payment method',
      () => {

        expect(
          component.getPaymentMethod(
            {

              paymentMethod:
                'unknown'

            } as any
          )
        ).toBe(
          'Not Available'
        );

      }
    );


    // ==========================================
    // CREATED DATE
    // ==========================================

    it(
      'should return created date',
      () => {

        const date =
          '2026-09-10T10:00:00.000Z';


        expect(
          component.getCreatedDate(
            {

              createdAt:
                date

            } as any
          )
        ).toBe(
          date
        );

      }
    );


    it(
      'should return empty created date when missing',
      () => {

        expect(
          component.getCreatedDate(
            {} as any
          )
        ).toBe(
          ''
        );

      }
    );


    // ==========================================
    // FORMAT DATE
    // ==========================================

    it(
      'should return empty string for empty date',
      () => {

        expect(
          component.formatDate(
            ''
          )
        ).toBe(
          ''
        );

      }
    );


    it(
      'should format valid date',
      () => {

        const result =
          component.formatDate(
            '2026-09-10T10:00:00.000Z'
          );


        expect(
          result
        ).toBeTruthy();


        expect(
          result
        ).toContain(
          '2026'
        );

      }
    );


    // ==========================================
    // TOTAL ITEMS
    // ==========================================

    it(
      'should calculate total item quantity',
      () => {

        const order = {

          items: [

            {

              quantity:
                2

            },

            {

              quantity:
                3

            }

          ]

        } as any;


        expect(
          component.getTotalItems(
            order
          )
        ).toBe(
          5
        );

      }
    );


    it(
      'should treat missing quantity as zero',
      () => {

        const order = {

          items: [

            {

              quantity:
                undefined

            }

          ]

        } as any;


        expect(
          component.getTotalItems(
            order
          )
        ).toBe(
          0
        );

      }
    );


    it(
      'should return zero total items for missing items',
      () => {

        expect(
          component.getTotalItems(
            {} as any
          )
        ).toBe(
          0
        );

      }
    );


    // ==========================================
    // ITEM TOTAL
    // ==========================================

    it(
      'should calculate item total',
      () => {

        expect(
          component.getItemTotal(
            {

              price:
                100,

              quantity:
                3

            } as any
          )
        ).toBe(
          300
        );

      }
    );


    it(
      'should treat missing price as zero',
      () => {

        expect(
          component.getItemTotal(
            {

              quantity:
                3

            } as any
          )
        ).toBe(
          0
        );

      }
    );


    it(
      'should treat missing quantity as zero',
      () => {

        expect(
          component.getItemTotal(
            {

              price:
                100

            } as any
          )
        ).toBe(
          0
        );

      }
    );


    // ==========================================
    // CLEAR SEARCH
    // ==========================================

    it(
      'should clear search',
      () => {

        component
          .searchControl
          .setValue(
            'laptop'
          );


        component.clearSearch();


        expect(
          component.searchControl.value
        ).toBe(
          ''
        );

      }
    );


    // ==========================================
    // DESTROY
    // ==========================================

    it(
      'should complete destroy subject',
      () => {

        const destroySubject =
          (component as any)
            .destroy$;


        const nextSpy =
          jest.spyOn(
            destroySubject,
            'next'
          );


        const completeSpy =
          jest.spyOn(
            destroySubject,
            'complete'
          );


        component.ngOnDestroy();


        expect(
          nextSpy
        ).toHaveBeenCalledTimes(
          1
        );


        expect(
          completeSpy
        ).toHaveBeenCalledTimes(
          1
        );

      }
    );

  }
);