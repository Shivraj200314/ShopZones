import {
  CheckoutRoutingModule
} from './checkout-routing.module';


describe(
  'CheckoutRoutingModule',
  () => {

    it(
      'should create',
      () => {

        const module =
          new CheckoutRoutingModule();


        expect(
          module
        ).toBeTruthy();

      }
    );

  }
);