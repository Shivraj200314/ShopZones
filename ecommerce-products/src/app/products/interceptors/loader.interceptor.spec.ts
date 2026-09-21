import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';

import {
  Observable,
  Subject,
  of,
  throwError
} from 'rxjs';

import {
  LoaderInterceptor
} from './loader.interceptor';

import {
  LoaderService
} from '../loader.service';


describe(
  'LoaderInterceptor',
  () => {

    let interceptor:
      LoaderInterceptor;

    let loaderServiceMock: {
      show: jest.Mock;
      hide: jest.Mock;
    };

    let handleMock:
      jest.Mock;

    let nextMock:
      HttpHandler;


    // ==========================================
    // BEFORE EACH
    // ==========================================

    beforeEach(
      () => {

        // --------------------------------------
        // Mock LoaderService
        // --------------------------------------

        loaderServiceMock = {

          show:
            jest.fn(),

          hide:
            jest.fn()

        };


        // --------------------------------------
        // Mock HttpHandler.handle()
        // --------------------------------------

        handleMock =
          jest.fn();


        nextMock = {

          handle:
            handleMock

        } as unknown as HttpHandler;


        // --------------------------------------
        // Create interceptor
        // --------------------------------------

        interceptor =
          new LoaderInterceptor(

            loaderServiceMock as unknown as LoaderService

          );

      }
    );


    // ==========================================
    // AFTER EACH
    // ==========================================

    afterEach(
      () => {

        jest.clearAllMocks();

      }
    );


    // ==========================================
    // INTERCEPTOR CREATION
    // ==========================================

    it(
      'should be created',
      () => {

        expect(
          interceptor
        ).toBeTruthy();

      }
    );


    // ==========================================
    // SHOW LOADER BEFORE HTTP REQUEST
    // ==========================================

    it(
      'should show loader when HTTP request starts',
      () => {

        // Arrange

        const request =
          new HttpRequest(
            'GET',
            '/api/products'
          );


        const response =
          new HttpResponse({

            status:
              200,

            body: {

              success:
                true

            }

          });


        handleMock
          .mockReturnValue(
            of(
              response
            )
          );


        // Act

        interceptor
          .intercept(
            request,
            nextMock
          )
          .subscribe();


        // Assert

        expect(
          loaderServiceMock.show
        ).toHaveBeenCalledTimes(
          1
        );

      }
    );


    // ==========================================
    // PASS REQUEST TO NEXT HANDLER
    // ==========================================

    it(
      'should pass HTTP request to next handler',
      () => {

        // Arrange

        const request =
          new HttpRequest(
            'GET',
            '/api/products'
          );


        const response =
          new HttpResponse({

            status:
              200

          });


        handleMock
          .mockReturnValue(
            of(
              response
            )
          );


        // Act

        interceptor
          .intercept(
            request,
            nextMock
          )
          .subscribe();


        // Assert

        expect(
          handleMock
        ).toHaveBeenCalledTimes(
          1
        );


        expect(
          handleMock
        ).toHaveBeenCalledWith(
          request
        );

      }
    );


    // ==========================================
    // HIDE LOADER AFTER SUCCESS
    // ==========================================

    it(
      'should hide loader when HTTP request completes successfully',
      () => {

        // Arrange

        const request =
          new HttpRequest(
            'GET',
            '/api/products'
          );


        const response =
          new HttpResponse({

            status:
              200,

            body: {

              products:
                []

            }

          });


        handleMock
          .mockReturnValue(
            of(
              response
            )
          );


        // Act

        interceptor
          .intercept(
            request,
            nextMock
          )
          .subscribe();


        // Assert

        expect(
          loaderServiceMock.show
        ).toHaveBeenCalledTimes(
          1
        );


        expect(
          loaderServiceMock.hide
        ).toHaveBeenCalledTimes(
          1
        );

      }
    );


    // ==========================================
    // HIDE LOADER AFTER ERROR
    // ==========================================

    it(
      'should hide loader when HTTP request fails',
      () => {

        // Arrange

        const request =
          new HttpRequest(
            'GET',
            '/api/products'
          );


        const httpError =
          new Error(
            'API failed'
          );


        handleMock
          .mockReturnValue(

            throwError(
              () =>
                httpError
            )

          );


        // Act

        interceptor
          .intercept(
            request,
            nextMock
          )
          .subscribe({

            next:
              () => {},

            error:
              error => {

                expect(
                  error
                ).toBe(
                  httpError
                );

              }

          });


        // Assert

        expect(
          loaderServiceMock.show
        ).toHaveBeenCalledTimes(
          1
        );


        expect(
          loaderServiceMock.hide
        ).toHaveBeenCalledTimes(
          1
        );

      }
    );


    // ==========================================
    // RETURN HTTP RESPONSE
    // ==========================================

    it(
      'should return response from next handler',
      () => {

        // Arrange

        const request =
          new HttpRequest(
            'GET',
            '/api/products'
          );


        const response =
          new HttpResponse({

            status:
              200,

            body: {

              message:
                'success'

            }

          });


        handleMock
          .mockReturnValue(
            of(
              response
            )
          );


        let actualResponse:
          HttpEvent<any> | undefined;


        // Act

        interceptor
          .intercept(
            request,
            nextMock
          )
          .subscribe(
            result => {

              actualResponse =
                result;

            }
          );


        // Assert

        expect(
          actualResponse
        ).toBe(
          response
        );

      }
    );


    // ==========================================
    // FINALIZE ON UNSUBSCRIBE
    // ==========================================

    it(
      'should hide loader when request subscription is cancelled',
      () => {

        // Arrange

        const request =
          new HttpRequest(
            'GET',
            '/api/products'
          );


        const requestSubject =
          new Subject<
            HttpEvent<any>
          >();


        handleMock
          .mockReturnValue(
            requestSubject
              .asObservable()
          );


        // Act

        const subscription =
          interceptor
            .intercept(
              request,
              nextMock
            )
            .subscribe();


        // Loader should already be shown.

        expect(
          loaderServiceMock.show
        ).toHaveBeenCalledTimes(
          1
        );


        // Request has not completed yet,
        // therefore hide should not have
        // been called yet.

        expect(
          loaderServiceMock.hide
        ).not.toHaveBeenCalled();


        // Cancel HTTP subscription.

        subscription.unsubscribe();


        // finalize() executes on unsubscribe.

        expect(
          loaderServiceMock.hide
        ).toHaveBeenCalledTimes(
          1
        );

      }
    );


    // ==========================================
    // SHOW BEFORE HANDLE
    // ==========================================

    it(
      'should call loader show before sending request',
      () => {

        // Arrange

        const request =
          new HttpRequest(
            'GET',
            '/api/products'
          );


        handleMock
          .mockReturnValue(
            of(
              new HttpResponse({
                status:
                  200
              })
            )
          );


        // Act

        interceptor
          .intercept(
            request,
            nextMock
          )
          .subscribe();


        // Assert

        expect(
          loaderServiceMock.show
        ).toHaveBeenCalled();


        expect(
          handleMock
        ).toHaveBeenCalled();


        const showCallOrder =
          loaderServiceMock
            .show
            .mock
            .invocationCallOrder[0];


        const handleCallOrder =
          handleMock
            .mock
            .invocationCallOrder[0];


        expect(
          showCallOrder
        ).toBeLessThan(
          handleCallOrder
        );

      }
    );

  }
);