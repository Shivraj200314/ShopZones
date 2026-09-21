import {
  TestBed
} from '@angular/core/testing';

import {
  SpinnerService
} from './spinner.service';


describe(
  'SpinnerService',
  () => {

    let service:
      SpinnerService;


    beforeEach(
      () => {

        TestBed.configureTestingModule({});

        service =
          TestBed.inject(
            SpinnerService
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
      'should emit false initially',
      () => {

        let loading:
          boolean | undefined;


        const subscription =
          service.loading$
            .subscribe(
              value => {

                loading =
                  value;

              }
            );


        expect(
          loading
        ).toBe(false);


        subscription.unsubscribe();

      }
    );


    it(
      'should emit true when show is called',
      () => {

        let loading =
          false;


        const subscription =
          service.loading$
            .subscribe(
              value => {

                loading =
                  value;

              }
            );


        service.show();


        expect(
          loading
        ).toBe(true);


        subscription.unsubscribe();

      }
    );


    it(
      'should emit false when hide is called',
      () => {

        let loading =
          false;


        const subscription =
          service.loading$
            .subscribe(
              value => {

                loading =
                  value;

              }
            );


        service.show();

        service.hide();


        expect(
          loading
        ).toBe(false);


        subscription.unsubscribe();

      }
    );

  }
);