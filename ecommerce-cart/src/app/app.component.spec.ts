import {
  AppComponent
} from './app.component';


describe(
  'AppComponent',
  () => {

    let component:
      AppComponent;


    beforeEach(
      () => {

        component =
          new AppComponent();

      }
    );


    it(
      'should create',
      () => {

        expect(
          component
        ).toBeTruthy();

      }
    );


    it(
      'should have ecommerce-cart title',
      () => {

        expect(
          component.title
        ).toBe(
          'ecommerce-cart'
        );

      }
    );

  }
);