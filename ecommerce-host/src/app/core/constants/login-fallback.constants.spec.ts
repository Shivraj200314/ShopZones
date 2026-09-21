import {
  LOGIN_FALLBACK
} from './login-fallback.constants';


describe(
  'LOGIN_FALLBACK',
  () => {

    it(
      'should be defined',
      () => {

        expect(
          LOGIN_FALLBACK
        ).toBeDefined();

      }
    );


    it(
      'should not be null',
      () => {

        expect(
          LOGIN_FALLBACK
        ).not.toBeNull();

      }
    );


    it(
      'should be an object',
      () => {

        expect(
          typeof LOGIN_FALLBACK
        ).toBe(
          'object'
        );

      }
    );


    it(
      'should contain fallback content',
      () => {

        expect(
          Object.keys(
            LOGIN_FALLBACK
          ).length
        ).toBeGreaterThan(
          0
        );

      }
    );

  }
);