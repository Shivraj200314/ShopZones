import {
  PRODUCT_FALLBACK
} from './product-fallback.constants';


describe(
  'PRODUCT_FALLBACK',
  () => {

    it(
      'should be defined',
      () => {

        expect(
          PRODUCT_FALLBACK
        ).toBeDefined();

      }
    );


    it(
      'should be an object',
      () => {

        expect(
          typeof PRODUCT_FALLBACK
        ).toBe(
          'object'
        );

      }
    );


    it(
      'should not be null',
      () => {

        expect(
          PRODUCT_FALLBACK
        ).not.toBeNull();

      }
    );

  }
);