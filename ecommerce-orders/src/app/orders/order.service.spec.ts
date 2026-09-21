import {
  OrderService
} from './order.service';


describe(
  'OrderService',
  () => {

    let service:
      OrderService;


    const createOrder =
      (
        overrides:
          any = {}
      ): any => {

        return {

          id: 1,

          date:
            '2026-09-10T10:00:00.000Z',

          status:
            'Placed',

          total:
            1000,

          ...overrides

        };

      };


    beforeEach(
      () => {

        localStorage.clear();


        jest
          .spyOn(
            console,
            'error'
          )
          .mockImplementation(
            () => {}
          );


        service =
          new OrderService();

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
      'should create',
      () => {

        expect(
          service
        ).toBeTruthy();

      }
    );


    // =====================================
    // LOAD - NO STORAGE
    // =====================================

    it(
      'should load empty orders when localStorage is empty',
      () => {

        let result:
          any[] = [];


        service.orders$
          .subscribe(
            value =>
              result = value
          );


        service.loadOrders();


        expect(
          result
        ).toEqual([]);

      }
    );


    // =====================================
    // LOAD VALID ORDERS
    // =====================================

    it(
      'should load valid orders from localStorage',
      () => {

        const orders = [

          createOrder({
            id: 1
          }),

          createOrder({
            id: 2
          })

        ];


        localStorage.setItem(
          'shopzone_orders',
          JSON.stringify(
            orders
          )
        );


        service.loadOrders();


        let result:
          any[] = [];


        service.orders$
          .subscribe(
            value =>
              result = value
          );


        expect(
          result
        ).toEqual(
          orders
        );

      }
    );


    // =====================================
    // INVALID JSON
    // =====================================

    it(
      'should handle invalid stored JSON',
      () => {

        localStorage.setItem(
          'shopzone_orders',
          '{invalid-json'
        );


        service.loadOrders();


        let result:
          any[] = [];


        service.orders$
          .subscribe(
            value =>
              result = value
          );


        expect(
          result
        ).toEqual([]);


        expect(
          console.error
        ).toHaveBeenCalledWith(

          'Error parsing orders:',

          expect.anything()

        );

      }
    );


    // =====================================
    // LOAD CATCHERROR
    // =====================================

    it(
      'should handle errors produced while loading orders',
      () => {

        localStorage.setItem(
          'shopzone_orders',
          '[]'
        );


        const ordersSubject =
          (service as any)
            .ordersSubject;


        const originalNext =
          ordersSubject
            .next
            .bind(
              ordersSubject
            );


        jest
          .spyOn(
            ordersSubject,
            'next'
          )

          .mockImplementationOnce(
            () => {

              throw new Error(
                'Subject failure'
              );

            }
          )

          .mockImplementationOnce(
            (
              value: any
            ) => {

              originalNext(
                value
              );

            }
          );


        service.loadOrders();


        expect(
          console.error
        ).toHaveBeenCalledWith(

          'Error loading orders:',

          expect.any(
            Error
          )

        );

      }
    );


    // =====================================
    // SORT ORDERS
    // =====================================

    it(
      'should return orders sorted newest first',
      () => {

        const oldOrder =
          createOrder({

            id: 1,

            date:
              '2026-09-01T00:00:00.000Z'

          });


        const newOrder =
          createOrder({

            id: 2,

            date:
              '2026-09-12T00:00:00.000Z'

          });


        (service as any)
          .ordersSubject
          .next([
            oldOrder,
            newOrder
          ]);


        let result:
          any[] = [];


        service.getOrders()
          .subscribe(
            value =>
              result = value
          );


        expect(
          result[0].id
        ).toBe(2);


        expect(
          result[1].id
        ).toBe(1);

      }
    );


    // =====================================
    // ADD ORDER
    // =====================================

    it(
      'should add new order at the beginning',
      () => {

        const oldOrder =
          createOrder({
            id: 1
          });


        const newOrder =
          createOrder({
            id: 2
          });


        (service as any)
          .ordersSubject
          .next([
            oldOrder
          ]);


        let result:
          any;


        service
          .addOrder(
            newOrder
          )
          .subscribe(
            value =>
              result = value
          );


        expect(
          result
        ).toEqual(
          newOrder
        );


        const stored =
          JSON.parse(
            localStorage.getItem(
              'shopzone_orders'
            )!
          );


        expect(
          stored.length
        ).toBe(2);


        expect(
          stored[0].id
        ).toBe(2);


        expect(
          stored[1].id
        ).toBe(1);

      }
    );


    // =====================================
    // ADD ORDER ERROR
    // =====================================

    it(
      'should propagate error when adding order fails',
      () => {

        const error =
          new Error(
            'Storage failed'
          );


        jest
          .spyOn(
            Storage.prototype,
            'setItem'
          )
          .mockImplementation(
            () => {

              throw error;

            }
          );


        let receivedError:
          any;


        service
          .addOrder(
            createOrder()
          )
          .subscribe({

            error:
              err => {

                receivedError =
                  err;

              }

          });


        expect(
          console.error
        ).toHaveBeenCalledWith(

          'Error adding order:',

          error

        );


        expect(
          receivedError
        ).toBe(
          error
        );

      }
    );


    // =====================================
    // GET ORDER BY ID
    // =====================================

    it(
      'should return order by id',
      () => {

        const first =
          createOrder({
            id: 1
          });


        const second =
          createOrder({
            id: 2
          });


        (service as any)
          .ordersSubject
          .next([
            first,
            second
          ]);


        let result:
          any;


        service
          .getOrderById(
            2
          )
          .subscribe(
            value =>
              result = value
          );


        expect(
          result
        ).toEqual(
          second
        );

      }
    );


    it(
      'should return undefined when order id does not exist',
      () => {

        (service as any)
          .ordersSubject
          .next([
            createOrder({
              id: 1
            })
          ]);


        let result:
          any;


        service
          .getOrderById(
            999
          )
          .subscribe(
            value =>
              result = value
          );


        expect(
          result
        ).toBeUndefined();

      }
    );


    // =====================================
    // DELETE
    // =====================================

    it(
      'should delete order and update localStorage',
      () => {

        const first =
          createOrder({
            id: 1
          });


        const second =
          createOrder({
            id: 2
          });


        (service as any)
          .ordersSubject
          .next([
            first,
            second
          ]);


        let result:
          any[] = [];


        service
          .deleteOrder(
            1
          )
          .subscribe(
            value =>
              result = value
          );


        expect(
          result.length
        ).toBe(1);


        expect(
          result[0].id
        ).toBe(2);


        const stored =
          JSON.parse(
            localStorage.getItem(
              'shopzone_orders'
            )!
          );


        expect(
          stored.length
        ).toBe(1);


        expect(
          stored[0].id
        ).toBe(2);

      }
    );


    // =====================================
    // DELETE UNKNOWN
    // =====================================

    it(
      'should keep orders when deleting unknown id',
      () => {

        const order =
          createOrder({
            id: 1
          });


        (service as any)
          .ordersSubject
          .next([
            order
          ]);


        let result:
          any[] = [];


        service
          .deleteOrder(
            999
          )
          .subscribe(
            value =>
              result = value
          );


        expect(
          result
        ).toEqual([
          order
        ]);

      }
    );


    // =====================================
    // CLEAR ORDERS
    // =====================================

    it(
      'should clear orders',
      () => {

        localStorage.setItem(

          'shopzone_orders',

          JSON.stringify([
            createOrder()
          ])

        );


        (service as any)
          .ordersSubject
          .next([
            createOrder()
          ]);


        let result:
          any;


        service
          .clearOrders()
          .subscribe(
            value =>
              result = value
          );


        expect(
          result
        ).toBeUndefined();


        expect(
          localStorage.getItem(
            'shopzone_orders'
          )
        ).toBeNull();


        let orders:
          any[] = [];


        service.orders$
          .subscribe(
            value =>
              orders = value
          );


        expect(
          orders
        ).toEqual([]);

      }
    );

  }
);