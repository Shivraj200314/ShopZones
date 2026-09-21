import {
  CART_FALLBACK
} from './cart-fallback.constants';


describe(
  'CART_FALLBACK',
  () => {

    it(
      'should be defined',
      () => {

        expect(
          CART_FALLBACK
        ).toBeDefined();

      }
    );


    it(
      'should be an object',
      () => {

        expect(
          typeof CART_FALLBACK
        ).toBe(
          'object'
        );

      }
    );


    it(
      'should not be null',
      () => {

        expect(
          CART_FALLBACK
        ).not.toBeNull();

      }
    );

  }
);