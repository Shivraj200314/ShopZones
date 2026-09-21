import {
  TestBed
} from '@angular/core/testing';

import {
  HttpClientTestingModule,
  HttpTestingController
} from '@angular/common/http/testing';

import {
  UserRevampService
} from './user-revamp.service';

import {
  USER_FALLBACK
} from '../users/core/constants/user-fallback.constants';


describe(
  'UserRevampService',
  () => {

    let service:
      UserRevampService;

    let httpMock:
      HttpTestingController;

    let consoleErrorSpy:
      jest.SpyInstance;


    const API_URL =
      'http://localhost:4200/assets/em/user-content.json';


    // =========================================
    // BEFORE EACH
    // =========================================

    beforeEach(
      () => {

        TestBed.configureTestingModule({

          imports: [
            HttpClientTestingModule
          ],

          providers: [
            UserRevampService
          ]

        });


        service =
          TestBed.inject(
            UserRevampService
          );


        httpMock =
          TestBed.inject(
            HttpTestingController
          );


        consoleErrorSpy =
          jest
            .spyOn(
              console,
              'error'
            )
            .mockImplementation();

      }
    );


    // =========================================
    // AFTER EACH
    // =========================================

    afterEach(
      () => {

        httpMock.verify();

        jest.restoreAllMocks();

      }
    );


    // =========================================
    // CREATE
    // =========================================

    it(
      'should be created',
      () => {

        expect(
          service
        ).toBeTruthy();

      }
    );


    // =========================================
    // API SUCCESS + MERGE
    // =========================================

  it(
  'should get API content and merge it with USER_FALLBACK',
  () => {

    // =========================================
    // MOCK API RESPONSE
    // =========================================

    const response = {

      content: [

        {

          screenIdentifier:
            'login',

          screenContent: [

            {

              key:
                'login',

              title:
                'Login From API',

              description:
                'API description'

            }

          ]

        }

      ]

    };


    let result:
      any;


    // =========================================
    // CALL SERVICE
    // =========================================

    service
      .getRevampContent()
      .subscribe(
        data => {

          result =
            data;

        }
      );


    // =========================================
    // EXPECT HTTP REQUEST
    // =========================================

    const request =
      httpMock.expectOne(
        API_URL
      );


    expect(
      request.request.method
    ).toBe(
      'GET'
    );


    // =========================================
    // RETURN MOCK RESPONSE
    // =========================================

    request.flush(
      response
    );


    // =========================================
    // BASIC RESULT CHECK
    // =========================================

    expect(
      result
    ).toBeTruthy();


    // =========================================
    // API VALUES SHOULD OVERRIDE FALLBACK
    // =========================================

    expect(
      result.login.title
    ).toBe(
      'Login From API'
    );


    expect(
      result.login.description
    ).toBe(
      'API description'
    );


    // =========================================
    // EXISTING FALLBACK VALUES SHOULD REMAIN
    // =========================================

    expect(
      result.login[
        'email-label'
      ]
    ).toBe(
      (USER_FALLBACK as any)
        .login[
          'email-label'
        ]
    );


    expect(
      result.login[
        'password-label'
      ]
    ).toBe(
      (USER_FALLBACK as any)
        .login[
          'password-label'
        ]
    );


    expect(
      result.login[
        'login-button'
      ]
    ).toBe(
      (USER_FALLBACK as any)
        .login[
          'login-button'
        ]
    );


    // =========================================
    // OTHER FALLBACK SECTIONS SHOULD REMAIN
    // =========================================

    expect(
      result.profile
    ).toEqual(
      (USER_FALLBACK as any)
        .profile
    );


    expect(
      result[
        'account-overview'
      ]
    ).toEqual(
      (USER_FALLBACK as any)[
        'account-overview'
      ]
    );

  }
);


    // =========================================
    // VERIFY API ITEM OVERRIDES FALLBACK
    // =========================================

    it(
      'should override fallback properties with API item properties',
      () => {

        const response = {

          content: [

            {

              screenContent: [

                {

                  key:
                    'login',

                  title:
                    'Overridden Login'

                }

              ]

            }

          ]

        };


        service
          .getRevampContent()
          .subscribe(
            data => {

              expect(
                data.login.title
              ).toBe(
                'Overridden Login'
              );

            }
          );


        httpMock
          .expectOne(
            API_URL
          )
          .flush(
            response
          );

      }
    );


    // =========================================
    // CONTENT UNDEFINED
    // Covers:
    // response.content?.forEach
    // =========================================

    it(
      'should return USER_FALLBACK when response content is undefined',
      () => {

        const response = {};


        service
          .getRevampContent()
          .subscribe(
            data => {

              expect(
                data
              ).toEqual(
                USER_FALLBACK
              );

            }
          );


        httpMock
          .expectOne(
            API_URL
          )
          .flush(
            response
          );

      }
    );


    // =========================================
    // SCREEN CONTENT UNDEFINED
    // Covers:
    // screen.screenContent?.forEach
    // =========================================

    it(
      'should return USER_FALLBACK when screenContent is undefined',
      () => {

        const response = {

          content: [

            {

              screenIdentifier:
                'login'

              // screenContent intentionally missing

            }

          ]

        };


        service
          .getRevampContent()
          .subscribe(
            data => {

              expect(
                data
              ).toEqual(
                USER_FALLBACK
              );

            }
          );


        httpMock
          .expectOne(
            API_URL
          )
          .flush(
            response
          );

      }
    );


    // =========================================
    // EMPTY CONTENT
    // =========================================

    it(
      'should return fallback when content array is empty',
      () => {

        service
          .getRevampContent()
          .subscribe(
            data => {

              expect(
                data
              ).toEqual(
                USER_FALLBACK
              );

            }
          );


        httpMock
          .expectOne(
            API_URL
          )
          .flush({

            content: []

          });

      }
    );


    // =========================================
    // EMPTY SCREEN CONTENT
    // =========================================

    it(
      'should return fallback when screenContent array is empty',
      () => {

        service
          .getRevampContent()
          .subscribe(
            data => {

              expect(
                data
              ).toEqual(
                USER_FALLBACK
              );

            }
          );


        httpMock
          .expectOne(
            API_URL
          )
          .flush({

            content: [

              {

                screenContent:
                  []

              }

            ]

          });

      }
    );


    // =========================================
    // API ERROR
    // =========================================

    it(
      'should return USER_FALLBACK when API fails',
      () => {

        let result:
          any;


        service
          .getRevampContent()
          .subscribe(
            data => {

              result =
                data;

            }
          );


        const request =
          httpMock.expectOne(
            API_URL
          );


        request.flush(

          'Server error',

          {

            status:
              500,

            statusText:
              'Internal Server Error'

          }

        );


        expect(
          result
        ).toEqual(
          USER_FALLBACK
        );


        expect(
          consoleErrorSpy
        ).toHaveBeenCalled();


        expect(
          consoleErrorSpy.mock.calls[0][0]
        ).toBe(
          'User Revamp API failed. Using USER_FALLBACK:'
        );

      }
    );


    // =========================================
    // CACHE
    // =========================================

    it(
      'should return the same cached observable on multiple calls',
      () => {

        const firstObservable =
          service
            .getRevampContent();


        const secondObservable =
          service
            .getRevampContent();


        // Same cached observable
        expect(
          firstObservable
        ).toBe(
          secondObservable
        );


        let firstResult:
          any;

        let secondResult:
          any;


        firstObservable
          .subscribe(
            data => {

              firstResult =
                data;

            }
          );


        secondObservable
          .subscribe(
            data => {

              secondResult =
                data;

            }
          );


        // Only ONE HTTP request should exist
        const request =
          httpMock.expectOne(
            API_URL
          );


        request.flush({

          content:
            []

        });


        expect(
          firstResult
        ).toEqual(
          USER_FALLBACK
        );


        expect(
          secondResult
        ).toEqual(
          USER_FALLBACK
        );


        // No second HTTP request
        httpMock.expectNone(
          API_URL
        );

      }
    );


    // =========================================
    // SHARE REPLAY
    // =========================================

    it(
      'should replay cached result to a later subscriber without another HTTP call',
      () => {

        const observable =
          service
            .getRevampContent();


        let firstResult:
          any;


        observable
          .subscribe(
            data => {

              firstResult =
                data;

            }
          );


        const request =
          httpMock.expectOne(
            API_URL
          );


        request.flush({

          content:
            []

        });


        expect(
          firstResult
        ).toEqual(
          USER_FALLBACK
        );


        // Subscribe AFTER request already completed

        let replayResult:
          any;


        observable
          .subscribe(
            data => {

              replayResult =
                data;

            }
          );


        expect(
          replayResult
        ).toEqual(
          USER_FALLBACK
        );


        // shareReplay prevents another HTTP request
        httpMock.expectNone(
          API_URL
        );

      }
    );

  }
);