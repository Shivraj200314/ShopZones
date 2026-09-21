import {
  FormBuilder
} from '@angular/forms';

import {
  ActivatedRoute,
  convertToParamMap,
  Router
} from '@angular/router';

import {
  BehaviorSubject,
  of,
  throwError
} from 'rxjs';

import {
  ProductListComponent
} from './product-list.component';

import {
  ProductService
} from '../product.service';

import {
  Product
} from '../product';

import {
  PRODUCT_FALLBACK
} from '../core/constants/product-fallback.constants';


describe(
  'ProductListComponent',
  () => {

    let component:
      ProductListComponent;


    let productServiceMock: {

      getProducts:
        jest.Mock;

      getCartCount:
        jest.Mock;

      addToCart:
        jest.Mock;

      addCustomProduct:
        jest.Mock;

    };


    let routerMock: {

      navigate:
        jest.Mock;

    };


    let queryParamMapSubject:
      BehaviorSubject<any>;


    // ==========================================
    // MOCK PRODUCTS
    // ==========================================

    const beautyProduct:
      Product = {

        id: 1,

        name:
          'Beauty Cream',

        brand:
          'Glow',

        category:
          'beauty',

        price:
          100,

        oldPrice:
          120,

        rating:
          4.5,

        reviews:
          10,

        image:
          'beauty.jpg',

        description:
          'Beauty cream',

        stock:
          10

      };


    const fragranceProduct:
      Product = {

        id: 2,

        name:
          'Rose Perfume',

        brand:
          'Luxury',

        category:
          'fragrances',

        price:
          500,

        oldPrice:
          550,

        rating:
          4,

        reviews:
          5,

        image:
          'perfume.jpg',

        description:
          'Rose perfume',

        stock:
          5

      };


    const groceryProduct:
      Product = {

        id: 3,

        name:
          'Fresh Apple',

        brand:
          'Farm Fresh',

        category:
          'groceries',

        price:
          50,

        oldPrice:
          60,

        rating:
          4.2,

        reviews:
          8,

        image:
          'apple.jpg',

        description:
          'Fresh apple',

        stock:
          20

      };


    const mockProducts:
      Product[] = [

        beautyProduct,

        fragranceProduct,

        groceryProduct

      ];


    // ==========================================
    // BEFORE EACH
    // ==========================================

    beforeEach(
      () => {

        productServiceMock = {

          getProducts:
            jest.fn(),

          getCartCount:
            jest.fn(),

          addToCart:
            jest.fn(),

          addCustomProduct:
            jest.fn()

        };


        routerMock = {

          navigate:
            jest.fn()

        };


        queryParamMapSubject =
          new BehaviorSubject(
            convertToParamMap({})
          );


        const activatedRouteMock = {

          queryParamMap:
            queryParamMapSubject.asObservable()

        };


    component =
  new ProductListComponent(

    productServiceMock as unknown as ProductService,

    routerMock as unknown as Router,

    activatedRouteMock as unknown as ActivatedRoute,

    new FormBuilder()

  );

      }
    );


    // ==========================================
    // AFTER EACH
    // ==========================================

    afterEach(
      () => {

        jest.useRealTimers();

        jest.restoreAllMocks();

        jest.clearAllMocks();

      }
    );


    // ==========================================
    // CREATE
    // ==========================================

    it(
      'should create',
      () => {

        expect(
          component
        ).toBeTruthy();

      }
    );


    // ==========================================
    // FALLBACK
    // ==========================================

    it(
      'should initialize revamp fallback',
      () => {

        expect(
          component.revampFallback()
        ).toEqual(
          PRODUCT_FALLBACK
        );

      }
    );


    // ==========================================
    // DEFAULT VALUES
    // ==========================================

    it(
      'should initialize default values',
      () => {

        expect(
          component.allProducts
        ).toEqual(
          []
        );


        expect(
          component.products
        ).toEqual(
          []
        );


        expect(
          component.selectedCategory
        ).toBe(
          'All'
        );


        expect(
          component.searchText
        ).toBe(
          ''
        );


        expect(
          component.cartCount
        ).toBe(
          0
        );


        expect(
          component.cartMessage
        ).toBe(
          ''
        );


        expect(
          component.errorMessage
        ).toBe(
          ''
        );


        expect(
          component.showAddProductForm
        ).toBe(
          false
        );

      }
    );


    // ==========================================
    // NG ON INIT
    // ==========================================

    it(
      'should initialize component',
      () => {

        const createFormSpy =
          jest
            .spyOn(
              component,
              'createAddProductForm'
            )
            .mockImplementation(
              () => {}
            );


        const readCategorySpy =
          jest
            .spyOn(
              component,
              'readCategoryFromUrl'
            )
            .mockImplementation(
              () => {}
            );


        const loadProductsSpy =
          jest
            .spyOn(
              component,
              'loadProducts'
            )
            .mockImplementation(
              () => {}
            );


        const updateCartSpy =
          jest
            .spyOn(
              component,
              'updateCartCount'
            )
            .mockImplementation(
              () => {}
            );


        component.ngOnInit();


        expect(
          createFormSpy
        ).toHaveBeenCalledTimes(
          1
        );


        expect(
          readCategorySpy
        ).toHaveBeenCalledTimes(
          1
        );


        expect(
          loadProductsSpy
        ).toHaveBeenCalledTimes(
          1
        );


        expect(
          updateCartSpy
        ).toHaveBeenCalledTimes(
          1
        );

      }
    );


    // ==========================================
    // CREATE PRODUCT FORM
    // ==========================================

    it(
      'should create add product form',
      () => {

        component.createAddProductForm();


        expect(
          component.addProductForm
        ).toBeDefined();


        expect(
          component.addProductForm.contains(
            'name'
          )
        ).toBe(
          true
        );


        expect(
          component.addProductForm.contains(
            'brand'
          )
        ).toBe(
          true
        );


        expect(
          component.addProductForm.contains(
            'category'
          )
        ).toBe(
          true
        );


        expect(
          component.addProductForm.contains(
            'price'
          )
        ).toBe(
          true
        );


        expect(
          component.addProductForm.contains(
            'oldPrice'
          )
        ).toBe(
          true
        );


        expect(
          component.addProductForm.contains(
            'stock'
          )
        ).toBe(
          true
        );


        expect(
          component.addProductForm.contains(
            'image'
          )
        ).toBe(
          true
        );


        expect(
          component.addProductForm.contains(
            'description'
          )
        ).toBe(
          true
        );

      }
    );


    // ==========================================
    // FORM VALIDATION
    // ==========================================

    it(
      'should make form invalid when required fields are empty',
      () => {

        component.createAddProductForm();


        expect(
          component.addProductForm.invalid
        ).toBe(
          true
        );

      }
    );


    // ==========================================
    // PRICE MIN VALIDATOR
    // ==========================================

    it(
      'should make price invalid when price is less than 1',
      () => {

        component.createAddProductForm();


        component
          .addProductForm
          .get('price')
          ?.setValue(
            0
          );


        expect(
          component
            .addProductForm
            .get('price')
            ?.hasError(
              'min'
            )
        ).toBe(
          true
        );

      }
    );


    // ==========================================
    // STOCK MIN VALIDATOR
    // ==========================================

    it(
      'should make stock invalid when stock is less than 1',
      () => {

        component.createAddProductForm();


        component
          .addProductForm
          .get('stock')
          ?.setValue(
            0
          );


        expect(
          component
            .addProductForm
            .get('stock')
            ?.hasError(
              'min'
            )
        ).toBe(
          true
        );

      }
    );


    // ==========================================
    // FORM CONTROLS GETTER
    // ==========================================

    it(
      'should return add product form controls',
      () => {

        component.createAddProductForm();


        expect(
          component.addProductControls
        ).toBe(
          component.addProductForm.controls
        );

      }
    );


    // ==========================================
    // CATEGORY FROM URL - VALID
    // ==========================================

    it(
      'should read valid category from URL',
      () => {

        queryParamMapSubject.next(
          convertToParamMap({

            category:
              'BEAUTY'

          })
        );


        const applyFiltersSpy =
          jest.spyOn(
            component,
            'applyFilters'
          );


        component.readCategoryFromUrl();


        expect(
          component.selectedCategory
        ).toBe(
          'beauty'
        );


        expect(
          applyFiltersSpy
        ).toHaveBeenCalled();

      }
    );


    // ==========================================
    // CATEGORY FROM URL - INVALID
    // ==========================================

    it(
      'should use All when URL category is invalid',
      () => {

        queryParamMapSubject.next(
          convertToParamMap({

            category:
              'electronics'

          })
        );


        component.readCategoryFromUrl();


        expect(
          component.selectedCategory
        ).toBe(
          'All'
        );

      }
    );


    // ==========================================
    // CATEGORY FROM URL - MISSING
    // ==========================================

    it(
      'should use All when category query param is missing',
      () => {

        queryParamMapSubject.next(
          convertToParamMap({})
        );


        component.readCategoryFromUrl();


        expect(
          component.selectedCategory
        ).toBe(
          'All'
        );

      }
    );


    // ==========================================
    // LOAD PRODUCTS SUCCESS
    // ==========================================

    it(
      'should load products successfully',
      () => {

        productServiceMock
          .getProducts
          .mockReturnValue(
            of(
              mockProducts
            )
          );


        component.errorMessage =
          'Previous error';


        component.loadProducts();


        expect(
          component.errorMessage
        ).toBe(
          ''
        );


        expect(
          productServiceMock.getProducts
        ).toHaveBeenCalled();


        expect(
          component.allProducts
        ).toEqual(
          mockProducts
        );


        expect(
          component.products
        ).toEqual(
          mockProducts
        );

      }
    );


    // ==========================================
    // LOAD PRODUCTS - NULL / EMPTY RESPONSE
    // ==========================================

    it(
      'should use empty array when product response is empty',
      () => {

      productServiceMock
  .getProducts
  .mockReturnValue(
    of(
      null
    )
  );


        component.loadProducts();


        expect(
          component.allProducts
        ).toEqual(
          []
        );


        expect(
          component.products
        ).toEqual(
          []
        );

      }
    );


    // ==========================================
    // LOAD PRODUCTS ERROR
    // ==========================================

    it(
      'should set error message when product loading fails',
      () => {

        const error =
          new Error(
            'API failed'
          );


        productServiceMock
          .getProducts
          .mockReturnValue(
            throwError(
              () =>
                error
            )
          );


        const consoleErrorSpy =
          jest
            .spyOn(
              console,
              'error'
            )
            .mockImplementation(
              () => {}
            );


        component.loadProducts();


        expect(
          consoleErrorSpy
        ).toHaveBeenCalledWith(
          'Product List Error:',
          error
        );


        expect(
          component.errorMessage
        ).toBe(
          'Unable to load products.'
        );

      }
    );


    // ==========================================
    // SEARCH PRODUCTS
    // ==========================================

    it(
      'should apply filters when searchProducts is called',
      () => {

        const applyFiltersSpy =
          jest
            .spyOn(
              component,
              'applyFilters'
            )
            .mockImplementation(
              () => {}
            );


        component.searchProducts();


        expect(
          applyFiltersSpy
        ).toHaveBeenCalledTimes(
          1
        );

      }
    );


    // ==========================================
    // CLEAR SEARCH
    // ==========================================

    it(
      'should clear search and apply filters',
      () => {

        component.searchText =
          'phone';


        const applyFiltersSpy =
          jest
            .spyOn(
              component,
              'applyFilters'
            )
            .mockImplementation(
              () => {}
            );


        component.clearSearch();


        expect(
          component.searchText
        ).toBe(
          ''
        );


        expect(
          applyFiltersSpy
        ).toHaveBeenCalledTimes(
          1
        );

      }
    );


    // ==========================================
    // SELECT SPECIFIC CATEGORY
    // ==========================================

    it(
      'should select category and update URL',
      () => {

        const applyFiltersSpy =
          jest
            .spyOn(
              component,
              'applyFilters'
            )
            .mockImplementation(
              () => {}
            );


        component.selectCategory(
          'beauty'
        );


        expect(
          component.selectedCategory
        ).toBe(
          'beauty'
        );


        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith(
          [],
          expect.objectContaining({

            queryParams: {

              category:
                'beauty'

            },

            queryParamsHandling:
              'merge'

          })
        );


        expect(
          applyFiltersSpy
        ).toHaveBeenCalled();

      }
    );


    // ==========================================
    // SELECT ALL CATEGORY
    // ==========================================

    it(
      'should remove category query param when All is selected',
      () => {

        component.selectCategory(
          'All'
        );


        expect(
          component.selectedCategory
        ).toBe(
          'All'
        );


        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith(
          [],
          expect.objectContaining({

            queryParams: {

              category:
                null

            },

            queryParamsHandling:
              'merge'

          })
        );

      }
    );


    // ==========================================
    // APPLY FILTER - ALL + NO SEARCH
    // ==========================================

    it(
      'should return all products when category is All and search is empty',
      () => {

        component.allProducts =
          mockProducts;


        component.selectedCategory =
          'All';


        component.searchText =
          '   ';


        component.applyFilters();


        expect(
          component.products
        ).toEqual(
          mockProducts
        );

      }
    );


    // ==========================================
    // APPLY FILTER - CATEGORY
    // ==========================================

    it(
      'should filter products by category',
      () => {

        component.allProducts =
          mockProducts;


        component.selectedCategory =
          'beauty';


        component.searchText =
          '';


        component.applyFilters();


        expect(
          component.products
        ).toEqual(
          [
            beautyProduct
          ]
        );

      }
    );


    // ==========================================
    // APPLY FILTER - SEARCH BY NAME
    // ==========================================

    it(
      'should search products by name',
      () => {

        component.allProducts =
          mockProducts;


        component.selectedCategory =
          'All';


        component.searchText =
          'rose';


        component.applyFilters();


        expect(
          component.products
        ).toEqual(
          [
            fragranceProduct
          ]
        );

      }
    );


    // ==========================================
    // APPLY FILTER - SEARCH BY BRAND
    // ==========================================

    it(
      'should search products by brand',
      () => {

        component.allProducts =
          mockProducts;


        component.selectedCategory =
          'All';


        component.searchText =
          'farm';


        component.applyFilters();


        expect(
          component.products
        ).toEqual(
          [
            groceryProduct
          ]
        );

      }
    );


    // ==========================================
    // APPLY FILTER - SEARCH BY CATEGORY
    // ==========================================

    it(
      'should search products by category',
      () => {

        component.allProducts =
          mockProducts;


        component.selectedCategory =
          'All';


        component.searchText =
          'groceries';


        component.applyFilters();


        expect(
          component.products
        ).toEqual(
          [
            groceryProduct
          ]
        );

      }
    );


    // ==========================================
    // APPLY FILTER - CATEGORY + SEARCH
    // ==========================================

    it(
      'should apply category and search together',
      () => {

        component.allProducts =
          mockProducts;


        component.selectedCategory =
          'fragrances';


        component.searchText =
          'rose';


        component.applyFilters();


        expect(
          component.products
        ).toEqual(
          [
            fragranceProduct
          ]
        );

      }
    );


    // ==========================================
    // APPLY FILTER - NO MATCH
    // ==========================================

    it(
      'should return empty array when search does not match',
      () => {

        component.allProducts =
          mockProducts;


        component.selectedCategory =
          'All';


        component.searchText =
          'something-not-found';


        component.applyFilters();


        expect(
          component.products
        ).toEqual(
          []
        );

      }
    );


    // ==========================================
    // OPTIONAL PRODUCT VALUES
    // ==========================================

    it(
      'should safely handle missing product name brand and category',
      () => {

     const productWithMissingValues: any = {

  id: 99,

  name: undefined,

  brand: undefined,

  category: undefined,

  price: 10,

  oldPrice: 10,

  rating: 0,

  reviews: 0,

  image: '',

  description: '',

  stock: 1

};


        component.allProducts = [

          productWithMissingValues

        ];


        component.selectedCategory =
          'beauty';


        component.searchText =
          'missing';


        expect(
          () =>
            component.applyFilters()
        ).not.toThrow();


        expect(
          component.products
        ).toEqual(
          []
        );

      }
    );


    // ==========================================
    // CATEGORY COUNT - ALL
    // ==========================================

    it(
      'should return all product count for All',
      () => {

        component.allProducts =
          mockProducts;


        expect(
          component.getCategoryCount(
            'All'
          )
        ).toBe(
          3
        );

      }
    );


    // ==========================================
    // CATEGORY COUNT - SPECIFIC
    // ==========================================

    it(
      'should return specific category count',
      () => {

        component.allProducts =
          mockProducts;


        expect(
          component.getCategoryCount(
            'beauty'
          )
        ).toBe(
          1
        );

      }
    );


    // ==========================================
    // CATEGORY COUNT - CASE INSENSITIVE
    // ==========================================

    it(
      'should count category case insensitively',
      () => {

        component.allProducts =
          mockProducts;


        expect(
          component.getCategoryCount(
            'BEAUTY'
          )
        ).toBe(
          1
        );

      }
    );


    // ==========================================
    // CATEGORY COUNT - MISSING CATEGORY
    // ==========================================

    it(
      'should ignore product with missing category',
      () => {

        component.allProducts = [

          {
            ...beautyProduct,

            id:
              50,

            category:
              undefined

          } as unknown as Product

        ];


        expect(
          component.getCategoryCount(
            'beauty'
          )
        ).toBe(
          0
        );

      }
    );


    // ==========================================
    // CATEGORY ICON - BEAUTY
    // ==========================================

    it(
      'should return beauty icon',
      () => {

        expect(
          component.getCategoryIcon(
            'beauty'
          )
        ).toBe(
          '💄'
        );

      }
    );


    // ==========================================
    // CATEGORY ICON - FRAGRANCES
    // ==========================================

    it(
      'should return fragrances icon',
      () => {

        expect(
          component.getCategoryIcon(
            'fragrances'
          )
        ).toBe(
          '🌸'
        );

      }
    );


    // ==========================================
    // CATEGORY ICON - GROCERIES
    // ==========================================

    it(
      'should return groceries icon',
      () => {

        expect(
          component.getCategoryIcon(
            'groceries'
          )
        ).toBe(
          '🛒'
        );

      }
    );


    // ==========================================
    // CATEGORY ICON - DEFAULT
    // ==========================================

    it(
      'should return default category icon',
      () => {

        expect(
          component.getCategoryIcon(
            'electronics'
          )
        ).toBe(
          '🛍️'
        );

      }
    );


    // ==========================================
    // CATEGORY NAME - EMPTY
    // ==========================================

    it(
      'should return empty category name for empty value',
      () => {

        expect(
          component.getCategoryName(
            ''
          )
        ).toBe(
          ''
        );

      }
    );


    // ==========================================
    // CATEGORY NAME
    // ==========================================

    it(
      'should capitalize category name',
      () => {

        expect(
          component.getCategoryName(
            'beauty'
          )
        ).toBe(
          'Beauty'
        );

      }
    );


    // ==========================================
    // VIEW DETAILS
    // ==========================================

    it(
      'should navigate to product details',
      () => {

        component.viewDetails(
          25
        );


        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith(
          [
            '/products',
            25
          ]
        );

      }
    );


    // ==========================================
    // ADD TO CART
    // ==========================================

  it(
  'should add product to cart and show temporary message',
  () => {

    jest.useFakeTimers();


    const eventMock = {

      stopPropagation:
        jest.fn()

    };


    productServiceMock
      .getCartCount
      .mockReturnValue(
        3
      );


    component.addToCart(

      beautyProduct,

      eventMock as unknown as Event

    );


    expect(
      eventMock.stopPropagation
    ).toHaveBeenCalledTimes(
      1
    );


    expect(
      productServiceMock.addToCart
    ).toHaveBeenCalledWith(
      beautyProduct,
      1
    );


    expect(
      component.cartCount
    ).toBe(
      3
    );


    expect(
      component.cartMessage
    ).toBe(
      'Beauty Cream added to cart'
    );


    jest.advanceTimersByTime(
      2000
    );


    expect(
      component.cartMessage
    ).toBe(
      ''
    );

  }
);


    // ==========================================
    // UPDATE CART COUNT
    // ==========================================

    it(
      'should update cart count',
      () => {

        productServiceMock
          .getCartCount
          .mockReturnValue(
            7
          );


        component.updateCartCount();


        expect(
          productServiceMock.getCartCount
        ).toHaveBeenCalled();


        expect(
          component.cartCount
        ).toBe(
          7
        );

      }
    );


    // ==========================================
    // GO TO CART
    // ==========================================

    it(
      'should navigate to cart',
      () => {

        component.goToCart();


        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith(
          [
            '/cart'
          ]
        );

      }
    );


    // ==========================================
    // OPEN ADD PRODUCT FORM
    // ==========================================

    it(
      'should open add product form',
      () => {

        component.openAddProductForm();


        expect(
          component.showAddProductForm
        ).toBe(
          true
        );

      }
    );


    // ==========================================
    // CLOSE ADD PRODUCT FORM
    // ==========================================

    it(
      'should close and reset add product form',
      () => {

        component.createAddProductForm();


        component.showAddProductForm =
          true;


        component
          .addProductForm
          .patchValue({

            name:
              'Test'

          });


        component.closeAddProductForm();


        expect(
          component.showAddProductForm
        ).toBe(
          false
        );


        expect(
          component.addProductForm
            .get('name')
            ?.value
        ).toBeNull();

      }
    );


    // ==========================================
    // ADD PRODUCT - INVALID FORM
    // ==========================================

    it(
      'should not add product when form is invalid',
      () => {

        component.createAddProductForm();


        component.addProduct();


        expect(
          component.addProductForm.touched
        ).toBe(
          true
        );


        expect(
          productServiceMock.addCustomProduct
        ).not.toHaveBeenCalled();


        expect(
          routerMock.navigate
        ).not.toHaveBeenCalled();

      }
    );


    // ==========================================
    // ADD PRODUCT - WITH OLD PRICE
    // ==========================================

    it(
      'should add valid product with provided old price',
      () => {

        component.createAddProductForm();


        component.allProducts = [

          beautyProduct

        ];


        component.selectedCategory =
          'beauty';


        component.searchText =
          'cream';


        component.showAddProductForm =
          true;


        component
          .addProductForm
          .setValue({

            name:
              '  New Phone  ',

            brand:
              '  Test Brand  ',

            category:
              'beauty',

            price:
              '1000',

            oldPrice:
              '1200',

            stock:
              '15',

            image:
              '  phone.jpg  ',

            description:
              '  New phone description  '

          });


        jest
          .spyOn(
            Date,
            'now'
          )
          .mockReturnValue(
            123456
          );


        const consoleLogSpy =
          jest
            .spyOn(
              console,
              'log'
            )
            .mockImplementation(
              () => {}
            );


        component.addProduct();


        const expectedProduct:
          Product = {

            id:
              123456,

            name:
              'New Phone',

            brand:
              'Test Brand',

            category:
              'beauty',

            price:
              1000,

            oldPrice:
              1200,

            rating:
              0,

            reviews:
              0,

            image:
              'phone.jpg',

            description:
              'New phone description',

            stock:
              15

          };


        expect(
          productServiceMock.addCustomProduct
        ).toHaveBeenCalledWith(
          expectedProduct
        );


        expect(
          component.allProducts[0]
        ).toEqual(
          expectedProduct
        );


        expect(
          component.selectedCategory
        ).toBe(
          'All'
        );


        expect(
          component.searchText
        ).toBe(
          ''
        );


        expect(
          component.products
        ).toEqual(
          component.allProducts
        );


        expect(
          routerMock.navigate
        ).toHaveBeenCalledWith(
          [],
          expect.objectContaining({

            queryParams: {

              category:
                null

            },

            queryParamsHandling:
              'merge'

          })
        );


        expect(
          consoleLogSpy
        ).toHaveBeenCalledWith(
          'New Product Added:',
          expectedProduct
        );


        expect(
          component.showAddProductForm
        ).toBe(
          false
        );

      }
    );


    // ==========================================
    // ADD PRODUCT - WITHOUT OLD PRICE
    // ==========================================

    it(
      'should use product price as oldPrice when oldPrice is empty',
      () => {

        component.createAddProductForm();


        component
          .addProductForm
          .setValue({

            name:
              'Apple',

            brand:
              'Farm',

            category:
              'groceries',

            price:
              '200',

            oldPrice:
              '',

            stock:
              '5',

            image:
              'apple.jpg',

            description:
              'Fresh apple'

          });


        jest
          .spyOn(
            Date,
            'now'
          )
          .mockReturnValue(
            999
          );


        jest
          .spyOn(
            console,
            'log'
          )
          .mockImplementation(
            () => {}
          );


        component.addProduct();


        expect(
          productServiceMock.addCustomProduct
        ).toHaveBeenCalledWith(
          expect.objectContaining({

            id:
              999,

            price:
              200,

            oldPrice:
              200

          })
        );

      }
    );

  }
);