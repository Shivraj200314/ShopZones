import {
  PRODUCTS
} from './product-data';


describe(
  'PRODUCTS',
  () => {


    // ==========================================
    // ARRAY EXISTS
    // ==========================================

    it(
      'should be defined',
      () => {

        expect(
          PRODUCTS
        ).toBeDefined();

      }
    );


    // ==========================================
    // SHOULD BE ARRAY
    // ==========================================

    it(
      'should be an array',
      () => {

        expect(
          Array.isArray(
            PRODUCTS
          )
        ).toBe(
          true
        );

      }
    );


    // ==========================================
    // TOTAL PRODUCTS
    // ==========================================

    it(
      'should contain 6 products',
      () => {

        expect(
          PRODUCTS.length
        ).toBe(
          6
        );

      }
    );


    // ==========================================
    // FIRST PRODUCT
    // ==========================================

    it(
      'should contain iPhone 15 as first product',
      () => {

        const product =
          PRODUCTS[0];


        expect(
          product.id
        ).toBe(
          1
        );


        expect(
          product.name
        ).toBe(
          'iPhone 15'
        );


        expect(
          product.brand
        ).toBe(
          'Apple'
        );


        expect(
          product.category
        ).toBe(
          'Mobiles'
        );


        expect(
          product.price
        ).toBe(
          69999
        );


        expect(
          product.stock
        ).toBe(
          15
        );

      }
    );


    // ==========================================
    // SECOND PRODUCT
    // ==========================================

    it(
      'should contain Samsung Galaxy S24',
      () => {

        const product =
          PRODUCTS.find(
            item =>
              item.id === 2
          );


        expect(
          product
        ).toBeDefined();


        expect(
          product?.name
        ).toBe(
          'Samsung Galaxy S24'
        );


        expect(
          product?.brand
        ).toBe(
          'Samsung'
        );

      }
    );


    // ==========================================
    // THIRD PRODUCT
    // ==========================================

    it(
      'should contain MacBook Air M3',
      () => {

        const product =
          PRODUCTS.find(
            item =>
              item.id === 3
          );


        expect(
          product
        ).toBeDefined();


        expect(
          product?.name
        ).toBe(
          'MacBook Air M3'
        );


        expect(
          product?.category
        ).toBe(
          'Laptops'
        );

      }
    );


    // ==========================================
    // FOURTH PRODUCT
    // ==========================================

    it(
      'should contain Dell XPS 15',
      () => {

        const product =
          PRODUCTS.find(
            item =>
              item.id === 4
          );


        expect(
          product
        ).toBeDefined();


        expect(
          product?.name
        ).toBe(
          'Dell XPS 15'
        );


        expect(
          product?.brand
        ).toBe(
          'Dell'
        );

      }
    );


    // ==========================================
    // FIFTH PRODUCT
    // ==========================================

    it(
      'should contain Sony WH-1000XM5',
      () => {

        const product =
          PRODUCTS.find(
            item =>
              item.id === 5
          );


        expect(
          product
        ).toBeDefined();


        expect(
          product?.name
        ).toBe(
          'Sony WH-1000XM5'
        );


        expect(
          product?.category
        ).toBe(
          'Headphones'
        );

      }
    );


    // ==========================================
    // SIXTH PRODUCT
    // ==========================================

    it(
      'should contain Apple Watch Series 9',
      () => {

        const product =
          PRODUCTS.find(
            item =>
              item.id === 6
          );


        expect(
          product
        ).toBeDefined();


        expect(
          product?.name
        ).toBe(
          'Apple Watch Series 9'
        );


        expect(
          product?.category
        ).toBe(
          'Smart Watches'
        );

      }
    );


    // ==========================================
    // UNIQUE IDS
    // ==========================================

    it(
      'should contain unique product ids',
      () => {

        const ids =
          PRODUCTS.map(
            product =>
              product.id
          );


        const uniqueIds =
          new Set(
            ids
          );


        expect(
          uniqueIds.size
        ).toBe(
          PRODUCTS.length
        );

      }
    );


    // ==========================================
    // REQUIRED FIELDS
    // ==========================================

    it(
      'should contain required fields for every product',
      () => {

        PRODUCTS.forEach(
          product => {

            expect(
              product.id
            ).toBeDefined();


            expect(
              product.name
            ).toBeTruthy();


            expect(
              product.brand
            ).toBeTruthy();


            expect(
              product.category
            ).toBeTruthy();


            expect(
              product.price
            ).toBeGreaterThan(
              0
            );


            expect(
              product.oldPrice
            ).toBeGreaterThan(
              0
            );


            expect(
              product.image
            ).toBeTruthy();


            expect(
              product.description
            ).toBeTruthy();


            expect(
              product.stock
            ).toBeGreaterThan(
              0
            );

          }
        );

      }
    );


    // ==========================================
    // OLD PRICE >= CURRENT PRICE
    // ==========================================

    it(
      'should have old price greater than or equal to current price',
      () => {

        PRODUCTS.forEach(
          product => {

            expect(
              product.oldPrice
            ).toBeGreaterThanOrEqual(
              product.price
            );

          }
        );

      }
    );


    // ==========================================
    // VALID RATINGS
    // ==========================================

    it(
      'should have ratings between 0 and 5',
      () => {

        PRODUCTS.forEach(
          product => {

            expect(
              product.rating
            ).toBeGreaterThanOrEqual(
              0
            );


            expect(
              product.rating
            ).toBeLessThanOrEqual(
              5
            );

          }
        );

      }
    );


    // ==========================================
    // REVIEWS NON-NEGATIVE
    // ==========================================

    it(
      'should have non negative review count',
      () => {

        PRODUCTS.forEach(
          product => {

            expect(
              product.reviews
            ).toBeGreaterThanOrEqual(
              0
            );

          }
        );

      }
    );


    // ==========================================
    // IMAGE URL
    // ==========================================

    it(
      'should have image URL for every product',
      () => {

        PRODUCTS.forEach(
          product => {

            expect(
              product.image
            ).toContain(
              'https://'
            );

          }
        );

      }
    );


    // ==========================================
    // APPLE PRODUCTS
    // ==========================================

    it(
      'should contain 3 Apple products',
      () => {

        const appleProducts =
          PRODUCTS.filter(
            product =>
              product.brand ===
              'Apple'
          );


        expect(
          appleProducts.length
        ).toBe(
          3
        );

      }
    );


    // ==========================================
    // MOBILE PRODUCTS
    // ==========================================

    it(
      'should contain 2 mobile products',
      () => {

        const mobileProducts =
          PRODUCTS.filter(
            product =>
              product.category ===
              'Mobiles'
          );


        expect(
          mobileProducts.length
        ).toBe(
          2
        );

      }
    );


    // ==========================================
    // LAPTOP PRODUCTS
    // ==========================================

    it(
      'should contain 2 laptop products',
      () => {

        const laptopProducts =
          PRODUCTS.filter(
            product =>
              product.category ===
              'Laptops'
          );


        expect(
          laptopProducts.length
        ).toBe(
          2
        );

      }
    );

  }
);