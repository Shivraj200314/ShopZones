import {
  TestBed
} from '@angular/core/testing';

import {
  firstValueFrom
} from 'rxjs';

import {
  OrdersRevampService
} from './orders-revamp.service';

import {
  ORDER_FALLBACK
} from '../core/constants/order-fallback.constants';


describe(
  'OrdersRevampService',
  () => {


    let service:
      OrdersRevampService;


    let fetchMock:
      jest.Mock;


    let consoleErrorSpy:
      jest.SpyInstance;


    // ==========================================
    // URL
    // ==========================================

    const REVAMP_URL =
      '/assets/em/orders-content.json';


    // ==========================================
    // BEFORE EACH
    // ==========================================

    beforeEach(
      () => {

        TestBed.configureTestingModule({

          providers: [

            OrdersRevampService

          ]

        });


        service =
          TestBed.inject(
            OrdersRevampService
          );


        // ======================================
        // MOCK FETCH
        // ======================================

        fetchMock =
          jest.fn();


        (
          globalThis as any
        ).fetch =
          fetchMock;


        // ======================================
        // HIDE EXPECTED ERROR LOGS
        // ======================================

        consoleErrorSpy =
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

        jest.clearAllMocks();


        consoleErrorSpy
          .mockRestore();


        (
          globalThis as any
        ).fetch =
          undefined;

      }
    );


    // ==========================================
    // CREATE SERVICE
    // ==========================================

    it(
      'should be created',
      () => {

        expect(
          service
        )
          .toBeTruthy();

      }
    );


    // ==========================================
    // SUCCESS
    // ==========================================

    it(
      'should get revamp content and merge with fallback',
      async () => {

        const apiResponse =
          {

            'order-list': {

              title:
                'My API Orders',

              subtitle:
                'Orders loaded from API.'

            },

            'order-detail': {

              title:
                'API Order Details'

            },

            'orders-loader': {

              title:
                'Loading API Orders'

            }

          };


        // ======================================
        // MOCK SUCCESS RESPONSE
        // ======================================

        fetchMock
          .mockResolvedValue({

            ok:
              true,

            status:
              200,

            json:
              jest
                .fn()
                .mockResolvedValue(
                  apiResponse
                )

          });


        const result =
          await firstValueFrom(

            service
              .getRevampContent()

          );


        // ======================================
        // FETCH CALLED
        // ======================================

        expect(
          fetchMock
        )
          .toHaveBeenCalledWith(
            REVAMP_URL
          );


        // ======================================
        // API VALUES
        // ======================================

        expect(
          result[
            'order-list'
          ].title
        )
          .toBe(
            'My API Orders'
          );


        expect(
          result[
            'order-list'
          ].subtitle
        )
          .toBe(
            'Orders loaded from API.'
          );


        expect(
          result[
            'order-detail'
          ].title
        )
          .toBe(
            'API Order Details'
          );


        expect(
          result[
            'orders-loader'
          ].title
        )
          .toBe(
            'Loading API Orders'
          );


        // ======================================
        // FALLBACK VALUES PRESERVED
        // ======================================

        expect(
          result[
            'order-list'
          ][
            'search-placeholder'
          ]
        )
          .toBe(

            ORDER_FALLBACK[
              'order-list'
            ][
              'search-placeholder'
            ]

          );


        expect(
          result[
            'order-detail'
          ][
            'order-id-label'
          ]
        )
          .toBe(

            ORDER_FALLBACK[
              'order-detail'
            ][
              'order-id-label'
            ]

          );

      }
    );


    // ==========================================
    // PARTIAL ORDER LIST
    // ==========================================

    it(
      'should preserve fallback values when order-list response is partial',
      async () => {

        const apiResponse =
          {

            'order-list': {

              title:
                'API Order History'

            }

          };


        fetchMock
          .mockResolvedValue({

            ok:
              true,

            status:
              200,

            json:
              jest
                .fn()
                .mockResolvedValue(
                  apiResponse
                )

          });


        const result =
          await firstValueFrom(

            service
              .getRevampContent()

          );


        // API value
        expect(
          result[
            'order-list'
          ].title
        )
          .toBe(
            'API Order History'
          );


        // Fallback value
        expect(
          result[
            'order-list'
          ].subtitle
        )
          .toBe(

            ORDER_FALLBACK[
              'order-list'
            ].subtitle

          );


        // Fallback search
        expect(
          result[
            'order-list'
          ][
            'search-placeholder'
          ]
        )
          .toBe(

            ORDER_FALLBACK[
              'order-list'
            ][
              'search-placeholder'
            ]

          );

      }
    );


    // ==========================================
    // EMPTY API RESPONSE
    // ==========================================

    it(
      'should return fallback values when API response is empty',
      async () => {

        fetchMock
          .mockResolvedValue({

            ok:
              true,

            status:
              200,

            json:
              jest
                .fn()
                .mockResolvedValue(
                  {}
                )

          });


        const result =
          await firstValueFrom(

            service
              .getRevampContent()

          );


        expect(
          result[
            'order-list'
          ]
        )
          .toEqual(

            ORDER_FALLBACK[
              'order-list'
            ]

          );


        expect(
          result[
            'order-detail'
          ]
        )
          .toEqual(

            ORDER_FALLBACK[
              'order-detail'
            ]

          );


        expect(
          result[
            'orders-loader'
          ]
        )
          .toEqual(

            ORDER_FALLBACK[
              'orders-loader'
            ]

          );

      }
    );


    // ==========================================
    // FETCH NETWORK ERROR
    // ==========================================

    it(
      'should return ORDER_FALLBACK when fetch request fails',
      async () => {

        fetchMock
          .mockRejectedValue(

            new Error(
              'Network Error'
            )

          );


        const result =
          await firstValueFrom(

            service
              .getRevampContent()

          );


        expect(
          result
        )
          .toEqual(
            ORDER_FALLBACK
          );


        expect(
          consoleErrorSpy
        )
          .toHaveBeenCalled();

      }
    );


    // ==========================================
    // HTTP ERROR
    // ==========================================

    it(
      'should return ORDER_FALLBACK when response is not ok',
      async () => {

        fetchMock
          .mockResolvedValue({

            ok:
              false,

            status:
              500,

            json:
              jest.fn()

          });


        const result =
          await firstValueFrom(

            service
              .getRevampContent()

          );


        expect(
          result
        )
          .toEqual(
            ORDER_FALLBACK
          );


        expect(
          consoleErrorSpy
        )
          .toHaveBeenCalled();

      }
    );


    // ==========================================
    // ORDER DETAIL MERGE
    // ==========================================

    it(
      'should merge order-detail content with fallback',
      async () => {

        const apiResponse =
          {

            'order-detail': {

              title:
                'Updated Order Details',

              'back-label':
                'Go Back'

            }

          };


        fetchMock
          .mockResolvedValue({

            ok:
              true,

            status:
              200,

            json:
              jest
                .fn()
                .mockResolvedValue(
                  apiResponse
                )

          });


        const result =
          await firstValueFrom(

            service
              .getRevampContent()

          );


        // ======================================
        // API VALUES
        // ======================================

        expect(
          result[
            'order-detail'
          ].title
        )
          .toBe(
            'Updated Order Details'
          );


        expect(
          result[
            'order-detail'
          ][
            'back-label'
          ]
        )
          .toBe(
            'Go Back'
          );


        // ======================================
        // FALLBACK STILL AVAILABLE
        // ======================================

        expect(
          result[
            'order-detail'
          ][
            'order-id-label'
          ]
        )
          .toBe(

            ORDER_FALLBACK[
              'order-detail'
            ][
              'order-id-label'
            ]

          );


        expect(
          result[
            'order-detail'
          ][
            'payment-label'
          ]
        )
          .toBe(

            ORDER_FALLBACK[
              'order-detail'
            ][
              'payment-label'
            ]

          );

      }
    );


    // ==========================================
    // LOADER MERGE
    // ==========================================

    it(
      'should merge orders-loader content with fallback',
      async () => {

        const apiResponse =
          {

            'orders-loader': {

              title:
                'Please Wait'

            }

          };


        fetchMock
          .mockResolvedValue({

            ok:
              true,

            status:
              200,

            json:
              jest
                .fn()
                .mockResolvedValue(
                  apiResponse
                )

          });


        const result =
          await firstValueFrom(

            service
              .getRevampContent()

          );


        // API value
        expect(
          result[
            'orders-loader'
          ].title
        )
          .toBe(
            'Please Wait'
          );


        // Fallback value
        expect(
          result[
            'orders-loader'
          ].subtitle
        )
          .toBe(

            ORDER_FALLBACK[
              'orders-loader'
            ].subtitle

          );

      }
    );


    // ==========================================
    // JSON PARSE FAILURE
    // ==========================================

    it(
      'should return fallback when response json parsing fails',
      async () => {

        fetchMock
          .mockResolvedValue({

            ok:
              true,

            status:
              200,

            json:
              jest
                .fn()
                .mockRejectedValue(

                  new Error(
                    'Invalid JSON'
                  )

                )

          });


        const result =
          await firstValueFrom(

            service
              .getRevampContent()

          );


        expect(
          result
        )
          .toEqual(
            ORDER_FALLBACK
          );


        expect(
          consoleErrorSpy
        )
          .toHaveBeenCalled();

      }
    );

  }
);