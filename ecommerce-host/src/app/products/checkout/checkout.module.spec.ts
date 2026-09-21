import {
  CheckoutModule
} from './checkout.module';


describe(
  'CheckoutModule',
  () => {

    it(
      'should create',
      () => {

        const module =
          new CheckoutModule();


        expect(
          module
        ).toBeTruthy();

      }
    );

  }
);