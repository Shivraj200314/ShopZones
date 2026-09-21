import {
  AppRoutingModule
} from './app-routing.module';


describe(
  'AppRoutingModule',
  () => {

    it(
      'should create',
      () => {

        const module =
          new AppRoutingModule();


        expect(
          module
        ).toBeTruthy();

      }
    );

  }
);