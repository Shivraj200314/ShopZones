import {
  TestBed
} from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import {
  CartRevampService
} from './cart-revamp.service';

import {
  CART_FALLBACK
} from '../cart/core/constants/cart-fallback.constants';


describe(
  'CartRevampService',
  () => {

    let service:
      CartRevampService;

    let httpMock:
      HttpTestingController;


    const apiUrl =
      'https://dummyjson.com/c/c9e0-3a94-4447-9457';


    beforeEach(
      () => {

        TestBed.configureTestingModule({

          imports: [
            HttpClientTestingModule
          ],

          providers: [
            CartRevampService
          ]

        });


        service =
          TestBed.inject(
            CartRevampService
          );


        httpMock =
          TestBed.inject(
            HttpTestingController
          );


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


    afterEach(
      () => {

        httpMock.verify();

        jest.restoreAllMocks();

      }
    );


    // =====================================
    // CREATE
    // =====================================

    it(
      'should be created',
      () => {

        expect(
          service
        ).toBeTruthy();

      }
    );


    // =====================================
    // HTTP GET
    // =====================================

    it(
      'should request revamp API using GET',
      () => {

        service
          .getRevampContent()
          .subscribe();


        const req =
          httpMock.expectOne(
            apiUrl
          );


        expect(
          req.request.method
        ).toBe('GET');


        req.flush({
          content: []
        });

      }
    );


    // =====================================
    // EMPTY CONTENT
    // =====================================

    it(
      'should return fallback when content is empty',
      () => {

        let result:
          any;


        service
          .getRevampContent()
          .subscribe(
            response => {

              result =
                response;

            }
          );


        const req =
          httpMock.expectOne(
            apiUrl
          );


        req.flush({
          content: []
        });


        expect(
          result
        ).toEqual(
          CART_FALLBACK
        );

      }
    );


    // =====================================
    // CONTENT MISSING
    // optional chaining false branch
    // =====================================

    it(
      'should return fallback when content is missing',
      () => {

        let result:
          any;


        service
          .getRevampContent()
          .subscribe(
            response => {

              result =
                response;

            }
          );


        const req =
          httpMock.expectOne(
            apiUrl
          );


        req.flush({});


        expect(
          result
        ).toEqual(
          CART_FALLBACK
        );

      }
    );


    // =====================================
    // SCREEN CONTENT MISSING
    // =====================================

    it(
      'should ignore screen without screenContent',
      () => {

        let result:
          any;


        service
          .getRevampContent()
          .subscribe(
            response => {

              result =
                response;

            }
          );


        const req =
          httpMock.expectOne(
            apiUrl
          );


        req.flush({

          content: [

            {},

            {
              screenContent:
                undefined
            }

          ]

        });


        expect(
          result
        ).toEqual(
          CART_FALLBACK
        );

      }
    );


    // =====================================
    // MERGE EXISTING FALLBACK KEY
    // =====================================

    it(
      'should merge API data with existing fallback section',
      () => {

        const fallback:
          any =
            CART_FALLBACK;


        const existingKey =
          Object.keys(
            fallback
          )[0];


        let result:
          any;


        service
          .getRevampContent()
          .subscribe(
            response => {

              result =
                response;

            }
          );


        const req =
          httpMock.expectOne(
            apiUrl
          );


        req.flush({

          content: [

            {

              screenContent: [

                {

                  key:
                    existingKey,

                  title:
                    'API Cart Title',

                  apiOnlyValue:
                    'API Value'

                }

              ]

            }

          ]

        });


        expect(
          result[
            existingKey
          ].title
        ).toBe(
          'API Cart Title'
        );


        expect(
          result[
            existingKey
          ].apiOnlyValue
        ).toBe(
          'API Value'
        );

      }
    );


    // =====================================
    // NEW API SECTION
    // =====================================

    it(
      'should add new API section not present in fallback',
      () => {

        let result:
          any;


        service
          .getRevampContent()
          .subscribe(
            response => {

              result =
                response;

            }
          );


        const req =
          httpMock.expectOne(
            apiUrl
          );


        req.flush({

          content: [

            {

              screenContent: [

                {

                  key:
                    'api-new-section',

                  title:
                    'New Section'

                }

              ]

            }

          ]

        });


        expect(
          result[
            'api-new-section'
          ]
        ).toEqual({

          key:
            'api-new-section',

          title:
            'New Section'

        });

      }
    );


    // =====================================
    // MULTIPLE SCREENS / ITEMS
    // =====================================

    it(
      'should process multiple screens and items',
      () => {

        let result:
          any;


        service
          .getRevampContent()
          .subscribe(
            response => {

              result =
                response;

            }
          );


        const req =
          httpMock.expectOne(
            apiUrl
          );


        req.flush({

          content: [

            {

              screenContent: [

                {
                  key:
                    'section-a',

                  title:
                    'A'
                },

                {
                  key:
                    'section-b',

                  title:
                    'B'
                }

              ]

            },

            {

              screenContent: [

                {
                  key:
                    'section-c',

                  title:
                    'C'
                }

              ]

            }

          ]

        });


        expect(
          result[
            'section-a'
          ].title
        ).toBe('A');


        expect(
          result[
            'section-b'
          ].title
        ).toBe('B');


        expect(
          result[
            'section-c'
          ].title
        ).toBe('C');

      }
    );


    // =====================================
    // HTTP ERROR
    // =====================================

    it(
      'should return CART_FALLBACK when API fails',
      () => {

        let result:
          any;


        service
          .getRevampContent()
          .subscribe(
            response => {

              result =
                response;

            }
          );


        const req =
          httpMock.expectOne(
            apiUrl
          );


        req.flush(

          'Server error',

          {

            status:
              500,

            statusText:
              'Internal Server Error'

          }

        );


        expect(
          console.error
        ).toHaveBeenCalledWith(

          'Cart Revamp API Failed. Using CART_FALLBACK:',

          expect.anything()

        );


        expect(
          result
        ).toEqual(
          CART_FALLBACK
        );

      }
    );

  }
);