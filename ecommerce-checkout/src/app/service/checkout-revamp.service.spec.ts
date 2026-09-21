import {
  TestBed
} from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import {
  CheckoutRevampService
} from './checkout-revamp.service';

import {
  CHECKOUT_FALLBACK
} from '../checkout/core/constants/checkout-fallback.constants';


describe(
  'CheckoutRevampService',
  () => {

    let service:
      CheckoutRevampService;

    let httpMock:
      HttpTestingController;


    const apiUrl =
      'http://localhost:4203/assets/em/checkout-content.json';


    beforeEach(
      () => {

        TestBed.configureTestingModule({

          imports: [
            HttpClientTestingModule
          ],

          providers: [
            CheckoutRevampService
          ]

        });


        service =
          TestBed.inject(
            CheckoutRevampService
          );


        httpMock =
          TestBed.inject(
            HttpTestingController
          );

      }
    );


    afterEach(
      () => {

        httpMock.verify();

        jest.restoreAllMocks();

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
        ).toBeTruthy();

      }
    );


    // ==========================================
    // HTTP GET
    // ==========================================

    it(
      'should call checkout content API using GET',
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


    // ==========================================
    // EMPTY API CONTENT
    // ==========================================

    it(
      'should return complete fallback when API content is empty',
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
          CHECKOUT_FALLBACK
        );

      }
    );


    // ==========================================
    // NULL RESPONSE
    // Covers response?.content
    // ==========================================

    it(
      'should return fallback when API response is null',
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
          null
        );


        expect(
          result
        ).toEqual(
          CHECKOUT_FALLBACK
        );

      }
    );


    // ==========================================
    // RESPONSE WITHOUT CONTENT
    // Covers content?.forEach
    // ==========================================

    it(
      'should return fallback when API response has no content',
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
          CHECKOUT_FALLBACK
        );

      }
    );


    // ==========================================
    // INVALID SCREEN VALUES
    // Covers:
    // screen?.screenContent?.forEach
    // ==========================================

    it(
      'should ignore screens without screenContent',
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

            null,

            {},

            {
              screenContent:
                null
            },

            {
              screenContent:
                []
            }

          ]

        });


        expect(
          result
        ).toEqual(
          CHECKOUT_FALLBACK
        );

      }
    );


    // ==========================================
    // INVALID ITEM
    // Covers:
    // if (!item?.key)
    // ==========================================

    it(
      'should ignore content items that do not contain a key',
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

                null,

                {},

                {
                  key: ''
                }

              ]

            }

          ]

        });


        expect(
          result
        ).toEqual(
          CHECKOUT_FALLBACK
        );

      }
    );


    // ==========================================
    // MERGE EXISTING FALLBACK KEY
    // ==========================================

   it(
  'should merge API content with existing fallback content',
  () => {

    const fallback:
      any =
        CHECKOUT_FALLBACK;


    const existingKey =
      Object.keys(
        fallback
      )[0];


    expect(
      existingKey
    ).toBeDefined();


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
                'Title from API',

              apiOnlyValue:
                'API value'

            }

          ]

        }

      ]

    });


    // ==========================================
    // API VALUES SHOULD OVERRIDE FALLBACK
    // ==========================================

    expect(
      result[existingKey]
        .title
    ).toBe(
      'Title from API'
    );


    // ==========================================
    // NEW API VALUE SHOULD BE ADDED
    // ==========================================

    expect(
      result[existingKey]
        .apiOnlyValue
    ).toBe(
      'API value'
    );


    // ==========================================
    // ORIGINAL FALLBACK PROPERTIES
    // SHOULD STILL EXIST
    // ==========================================

    Object
      .keys(
        fallback[existingKey]
      )
      .forEach(
        key => {

          // title is intentionally
          // overridden by API
          if (
            key !== 'title'
          ) {

            expect(
              result[existingKey][key]
            ).toEqual(
              fallback[
                existingKey
              ][key]
            );

          }

        }
      );


    // ==========================================
    // OTHER FALLBACK SECTIONS
    // SHOULD REMAIN UNCHANGED
    // ==========================================

    Object
      .keys(
        fallback
      )
      .filter(
        key =>
          key !==
          existingKey
      )
      .forEach(
        key => {

          expect(
            result[key]
          ).toEqual(
            fallback[key]
          );

        }
      );

  }
);


    // ==========================================
    // NEW API KEY
    //
    // Covers:
    // fallback[item.key] || {}
    //
    // Here fallback does not contain
    // this key, so {} branch executes.
    // ==========================================

    it(
      'should add API content when key does not exist in fallback',
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
                    'new-checkout-section',

                  title:
                    'New API Section',

                  subtitle:
                    'New subtitle'

                }

              ]

            }

          ]

        });


        expect(
          result[
            'new-checkout-section'
          ]
        ).toEqual({

          key:
            'new-checkout-section',

          title:
            'New API Section',

          subtitle:
            'New subtitle'

        });

      }
    );


    // ==========================================
    // MULTIPLE SCREENS + ITEMS
    // ==========================================

    it(
      'should process multiple screens and multiple items',
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
                    'section-one',

                  title:
                    'Section One'
                },

                {
                  key:
                    'section-two',

                  title:
                    'Section Two'
                }

              ]

            },

            {

              screenContent: [

                {
                  key:
                    'section-three',

                  title:
                    'Section Three'
                }

              ]

            }

          ]

        });


        expect(
          result[
            'section-one'
          ].title
        ).toBe(
          'Section One'
        );


        expect(
          result[
            'section-two'
          ].title
        ).toBe(
          'Section Two'
        );


        expect(
          result[
            'section-three'
          ].title
        ).toBe(
          'Section Three'
        );

      }
    );


    // ==========================================
    // API ERROR
    // ==========================================

    it(
      'should return CHECKOUT_FALLBACK when API request fails',
      () => {

        const consoleErrorSpy =
          jest
            .spyOn(
              console,
              'error'
            )
            .mockImplementation(
              () => {}
            );


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

          'Server Error',

          {
            status:
              500,

            statusText:
              'Internal Server Error'
          }

        );


        expect(
          consoleErrorSpy
        ).toHaveBeenCalledWith(

          'Checkout Revamp API failed. Using fallback:',

          expect.anything()

        );


        expect(
          result
        ).toEqual(
          CHECKOUT_FALLBACK
        );

      }
    );

  }
);