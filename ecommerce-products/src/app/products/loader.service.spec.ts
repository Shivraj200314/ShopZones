import {
  TestBed
} from '@angular/core/testing';

import {
  LoaderService
} from './loader.service';


describe(
  'LoaderService',
  () => {

    let service:
      LoaderService;


    beforeEach(
      () => {

        TestBed.configureTestingModule({

          providers: [
            LoaderService
          ]

        });


        service =
          TestBed.inject(
            LoaderService
          );

      }
    );


    it(
      'should be created',
      () => {

        expect(
          service
        ).toBeTruthy();

      }
    );


    it(
      'should show loader',
      done => {

        service.show();


        service
          .loading$
          .subscribe(
            loading => {

              if (loading) {

                expect(
                  loading
                ).toBe(true);

                done();

              }

            }
          );

      }
    );


    it(
      'should hide loader',
      done => {

        service.show();

        service.hide();


        service
          .loading$
          .subscribe(
            loading => {

              if (!loading) {

                expect(
                  loading
                ).toBe(false);

                done();

              }

            }
          );

      }
    );

  }
);