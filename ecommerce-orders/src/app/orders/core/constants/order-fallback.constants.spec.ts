import {
  ORDER_FALLBACK
} from './order-fallback.constants';


describe(
  'ORDER_FALLBACK',
  () => {

    // ==========================================
    // FALLBACK EXISTS
    // ==========================================

    it(
      'should be defined',
      () => {

        expect(
          ORDER_FALLBACK
        ).toBeDefined();

      }
    );


    // ==========================================
    // ORDER LIST
    // ==========================================

    it(
      'should contain order-list configuration',
      () => {

        expect(
          ORDER_FALLBACK[
            'order-list'
          ]
        ).toBeDefined();


        expect(
          ORDER_FALLBACK[
            'order-list'
          ].key
        ).toBe(
          'order-list'
        );


        expect(
          ORDER_FALLBACK[
            'order-list'
          ].title
        ).toBe(
          'My Orders'
        );


        expect(
          ORDER_FALLBACK[
            'order-list'
          ].device
        ).toBe(
          'both'
        );

      }
    );


    // ==========================================
    // ORDER DETAIL
    // ==========================================

    it(
      'should contain order-detail configuration',
      () => {

        expect(
          ORDER_FALLBACK[
            'order-detail'
          ]
        ).toBeDefined();


        expect(
          ORDER_FALLBACK[
            'order-detail'
          ].key
        ).toBe(
          'order-detail'
        );


        expect(
          ORDER_FALLBACK[
            'order-detail'
          ].title
        ).toBe(
          'Order Details'
        );


        expect(
          ORDER_FALLBACK[
            'order-detail'
          ].device
        ).toBe(
          'both'
        );

      }
    );


    // ==========================================
    // LOADER
    // ==========================================

    it(
      'should contain orders-loader configuration',
      () => {

        expect(
          ORDER_FALLBACK[
            'orders-loader'
          ]
        ).toBeDefined();


        expect(
          ORDER_FALLBACK[
            'orders-loader'
          ].key
        ).toBe(
          'orders-loader'
        );


        expect(
          ORDER_FALLBACK[
            'orders-loader'
          ].title
        ).toBe(
          'Loading Orders'
        );


        expect(
          ORDER_FALLBACK[
            'orders-loader'
          ].device
        ).toBe(
          'both'
        );

      }
    );


    // ==========================================
    // ALL SECTIONS
    // ==========================================

    it(
      'should contain all required fallback sections',
      () => {

        expect(
          Object.keys(
            ORDER_FALLBACK
          )
        ).toEqual([

          'order-list',

          'order-detail',

          'orders-loader'

        ]);

      }
    );

  }
);