import {
  TestBed
} from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import {
  ProductRevampService
} from './product-revamp.service';


describe(
  'ProductRevampService',
  () => {

    let service:
      ProductRevampService;

    let httpMock:
      HttpTestingController;


    const API_URL =
      'https://dummyjson.com/c/c9e0-3a94-4447-9457';


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
            ProductRevampService
          ]

        });


        service =
          TestBed.inject(
            ProductRevampService
          );


        httpMock =
          TestBed.inject(
            HttpTestingController
          );

      }
    );


    // ==========================================
    // AFTER EACH
    // ==========================================

    afterEach(
      () => {

        httpMock.verify();

        jest.clearAllMocks();

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


    // ==========================================
    // GET REVAMP CONTENT SUCCESS
    // ==========================================

    it(
      'should get revamp content successfully',
      () => {

        const mockResponse = {

          title:
            'Product Revamp',

          subtitle:
            'Revamp content'

        };


        let responseData:
          any;


        service
          .getRevampContent()
          .subscribe(
            response => {

              responseData =
                response;

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
          mockResponse
        );


        expect(
          responseData
        ).toEqual(
          mockResponse
        );

      }
    );


    // ==========================================
    // CORRECT URL
    // ==========================================

    it(
      'should call correct API URL',
      () => {

        service
          .getRevampContent()
          .subscribe();


        const request =
          httpMock.expectOne(
            API_URL
          );


        expect(
          request.request.url
        ).toBe(
          API_URL
        );


        request.flush(
          {}
        );

      }
    );


    // ==========================================
    // EMPTY RESPONSE
    // ==========================================

    it(
      'should handle empty response',
      () => {

        let responseData:
          any;


        service
          .getRevampContent()
          .subscribe(
            response => {

              responseData =
                response;

            }
          );


        const request =
          httpMock.expectOne(
            API_URL
          );


        request.flush(
          {}
        );


        expect(
          responseData
        ).toEqual(
          {}
        );

      }
    );


    // ==========================================
    // NULL RESPONSE
    // ==========================================

    it(
      'should handle null response',
      () => {

        let responseData:
          any;


        service
          .getRevampContent()
          .subscribe(
            response => {

              responseData =
                response;

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
          responseData
        ).toBeNull();

      }
    );


    // ==========================================
    // HTTP ERROR
    // ==========================================

    it(
      'should return error when API fails',
      () => {

        let receivedError:
          any;


        service
          .getRevampContent()
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

          'Server Error',

          {

            status:
              500,

            statusText:
              'Internal Server Error'

          }

        );


        expect(
          receivedError
        ).toBeDefined();


        expect(
          receivedError.status
        ).toBe(
          500
        );

      }
    );

  }
);