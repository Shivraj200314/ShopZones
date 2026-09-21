import {
  SHELL_FALLBACK
} from './shell-fallback.constants';


describe(
  'SHELL_FALLBACK',
  () => {

    it(
      'should be defined',
      () => {

        expect(
          SHELL_FALLBACK
        ).toBeDefined();

      }
    );


    it(
      'should be an object',
      () => {

        expect(
          typeof SHELL_FALLBACK
        ).toBe(
          'object'
        );

      }
    );

  }
);