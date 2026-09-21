import {
  AppModule
} from './app.module';


describe(
  'AppModule',
  () => {

    it(
      'should create',
      () => {

        const module =
          new AppModule();


        expect(
          module
        ).toBeTruthy();

      }
    );

  }
);