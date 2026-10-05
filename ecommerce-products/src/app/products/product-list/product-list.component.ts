import {
  Component,
  HostListener,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Subject,
  takeUntil
} from 'rxjs';

import {
  Product
} from '../product';

import {
  ProductService
} from '../product.service';

import {
  PRODUCT_FALLBACK
} from '../core/constants/product-fallback.constants';

import {
  ProductRevampService
} from '../services/product-revamp.service';

import {
  mergeData
} from 'src/app/units/marge';

import {
  ProductLanguageService
} from '../services/product-language.service';
import { AuthService } from 'src/app/auth.service';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent
  implements OnInit, OnDestroy {


  // ==========================================
  // REVAMP FALLBACK
  // ==========================================

  revampFallback =
    signal<any>(
      PRODUCT_FALLBACK
    );


  // ==========================================
  // ALL PRODUCTS
  // ==========================================

  allProducts:
    Product[] = [];


  // ==========================================
  // FILTERED PRODUCTS
  // ==========================================

  products:
    Product[] = [];


  // ==========================================
  // SELECTED CATEGORY
  // ==========================================

  selectedCategory:
    string = 'All';


  // ==========================================
  // PRODUCT CATEGORIES
  // ==========================================

  categories:
    string[] = [

      'beauty',

      'fragrances',

      'groceries'

    ];


  // ==========================================
  // SEARCH TEXT
  // ==========================================

  searchText:
    string = '';


  // ==========================================
  // CART COUNT
  // ==========================================

  cartCount:
    number = 0;


  // ==========================================
  // CART MESSAGE
  // ==========================================

  cartMessage:
    string = '';


  // ==========================================
  // ERROR MESSAGE
  // ==========================================

  errorMessage:
    string = '';


  // ==========================================
  // ADD PRODUCT FORM VISIBILITY
  // ==========================================

  showAddProductForm:
    boolean = false;


  // ==========================================
  // ADD PRODUCT FORM
  // ==========================================

  addProductForm!:
    FormGroup;


  // ==========================================
  // CURRENT USER ROLE
  // ==========================================

  userRole:
    string = '';


  // ==========================================
  // DESTROY SUBJECT
  // ==========================================

  private readonly destroy$ =
    new Subject<void>();


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(

    private productService:
      ProductService,

    private router:
      Router,

    private route:
      ActivatedRoute,

    private fb:
      FormBuilder,

    private productRevampService:
      ProductRevampService,

    private productLanguageService:
      ProductLanguageService,

       private authService:
    AuthService

  ) {}


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    // ========================================
    // CREATE ADD PRODUCT FORM
    // ========================================

    this.createAddProductForm();


    // ========================================
    // READ CATEGORY FROM URL
    // ========================================

    this.readCategoryFromUrl();


    // ========================================
    // LOAD USER ROLE
    // ========================================

    this.loadUserRole();


    // ========================================
    // LOAD PRODUCTS
    // ========================================

    this.loadProducts();


    // ========================================
    // LOAD REVAMP CONTENT
    // ========================================

    this.loadRevampData();


    // ========================================
    // UPDATE CART COUNT
    // ========================================

    this.updateCartCount();


    // ========================================
    // LOAD LANGUAGE
    // ========================================

    const language =
      localStorage.getItem(
        'shopzones-language'
      ) === 'mr'
        ? 'mr'
        : 'en';


    this.productLanguageService
      .loadLanguage(language)
      .pipe(
        takeUntil(
          this.destroy$
        )
      )
      .subscribe();

  }


  // ==========================================
  // LOAD CURRENT USER ROLE
  // ==========================================

  loadUserRole(): void {

    const userData =
      localStorage.getItem(
        'shopzone_user'
      );


    // ========================================
    // USER NOT LOGGED IN
    // ========================================

    if (!userData) {

      this.userRole = '';

      return;

    }


    // ========================================
    // PARSE USER DATA
    // ========================================

    try {

      const user =
        JSON.parse(
          userData
        );


      this.userRole =
        user?.role
          ?.trim()
          .toUpperCase()
          ?? '';

    }

    catch (
      error
    ) {

      console.error(
        'User data parse error:',
        error
      );


      this.userRole =
        '';

    }

  }


  // ==========================================
  // CHECK CAN ADD PRODUCT
  // ==========================================

  get canAddProduct(): boolean {

    return (

      this.userRole ===
        'SELLER'

      ||

      this.userRole ===
        'OWNER'

    );

  }


  get canAddToCart(): boolean {

    return (
      this.userRole === 'CUSTOMER' ||
      this.userRole === 'OWNER'
    );

  }


  @HostListener(
    'window:shopzone-inventory-updated'
  )
  onInventoryUpdated(): void {

    this.refreshInventory();

  }


  @HostListener(
    'window:storage',
    ['$event']
  )
  onStorageChange(
    event: StorageEvent
  ): void {

    if (
      event.key === 'shopzone_inventory_stock'
    ) {

      this.refreshInventory();

    }

  }


  refreshInventory(): void {

    const savedStock =
      localStorage.getItem(
        'shopzone_inventory_stock'
      );


    if (
      !savedStock
    ) {

      return;

    }


    try {

      const stockOverrides =
        JSON.parse(
          savedStock
        ) as Record<string, number>;


      this.allProducts =
        this.allProducts.map(
          product => ({
            ...product,
            stock: Number(
              stockOverrides[String(product.id)] ??
              product.stock
            )
          })
        );

      this.applyFilters();

    }

    catch {

      return;

    }

  }


  // ==========================================
  // LOAD REVAMP CONTENT
  // ==========================================

  loadRevampData(): void {

    this.productRevampService
      .getRevampContent()

      .pipe(
        takeUntil(
          this.destroy$
        )
      )

      .subscribe({

        // ======================================
        // SUCCESS
        // ======================================

        next: (
          response: any
        ) => {

          console.log(
            'RAW REVAMP API:',
            response
          );


          // ====================================
          // GET API DATA
          // ====================================

          const apiData =
            response?.data
              ? response.data
              : response;


          console.log(
            'API EYEBROW:',
            apiData
              ?.['product-list']
              ?.['eyebrow']
          );


          // ====================================
          // MERGE FALLBACK + API
          // ====================================

          const finalData =
            mergeData(
              PRODUCT_FALLBACK,
              apiData
            );


          console.log(
            'FINAL EYEBROW:',
            finalData
              ?.['product-list']
              ?.['eyebrow']
          );


          // ====================================
          // UPDATE SIGNAL
          // ====================================

          this.revampFallback.set(
            finalData
          );

        },


        // ======================================
        // ERROR
        // ======================================

        error: (
          error: any
        ) => {

          console.error(
            'Product Revamp API Error:',
            error
          );


          this.revampFallback.set(
            PRODUCT_FALLBACK
          );

        }

      });

  }


  // ==========================================
  // NORMALIZE REVAMP DATA
  // ==========================================

  private normalizeRevampData(
    response: any
  ): any {

    // ========================================
    // EMPTY RESPONSE
    // ========================================

    if (!response) {

      return {};

    }


    // ========================================
    // CASE 1
    // API ALREADY MATCHES FALLBACK
    // ========================================

    if (

      response['product-list']

      ||

      response['product-detail']

      ||

      response['products-loader']

    ) {

      return response;

    }


    // ========================================
    // CASE 2
    // API RETURNS { data: {...} }
    // ========================================

    if (
      response.data
    ) {

      return this.normalizeRevampData(
        response.data
      );

    }


    // ========================================
    // CASE 3
    // API RETURNS screenContent ARRAY
    // ========================================

    if (

      Array.isArray(
        response.screenContent
      )

    ) {

      return this.convertKeyArrayToObject(
        response.screenContent
      );

    }


    // ========================================
    // CASE 4
    // AEM / EM STYLE
    // ========================================

    if (

      Array.isArray(
        response.content
      )

    ) {

      const finalData:
        any = {};


      response.content.forEach(
        (
          screen: any
        ) => {

          if (

            Array.isArray(
              screen?.screenContent
            )

          ) {

            const screenData =
              this.convertKeyArrayToObject(
                screen.screenContent
              );


            Object.assign(
              finalData,
              screenData
            );

          }

        }
      );


      return finalData;

    }


    // ========================================
    // CASE 5
    // DIRECT ARRAY
    // ========================================

    if (

      Array.isArray(
        response
      )

    ) {

      return this.convertKeyArrayToObject(
        response
      );

    }


    // ========================================
    // DEFAULT
    // ========================================

    return response;

  }


  // ==========================================
  // CONVERT KEY ARRAY TO OBJECT
  // ==========================================

  private convertKeyArrayToObject(
    items: any[]
  ): any {

    const result:
      any = {};


    items.forEach(
      (
        item: any
      ) => {

        if (

          !item

          ||

          !item.key

        ) {

          return;

        }


        result[
          item.key
        ] = {

          ...item

        };

      }
    );


    return result;

  }


  // ==========================================
  // GET REVAMP PRODUCT
  // ==========================================

  getRevampProduct(
    productId: number
  ): any {

    return (

      this.revampFallback()
        ?.['products']
        ?.find(
          (
            item: any
          ) =>
            item.id ===
            productId
        )

      ||

      {}

    );

  }


  // ==========================================
  // CREATE ADD PRODUCT FORM
  // ==========================================

  createAddProductForm(): void {

    this.addProductForm =
      this.fb.group({

        name: [

          '',

          Validators.required

        ],

        brand: [

          '',

          Validators.required

        ],

        category: [

          '',

          Validators.required

        ],

        price: [

          '',

          [

            Validators.required,

            Validators.min(1)

          ]

        ],

        oldPrice: [

          ''

        ],

        stock: [

          '',

          [

            Validators.required,

            Validators.min(1)

          ]

        ],

        image: [

          '',

          Validators.required

        ],

        description: [

          '',

          Validators.required

        ]

      });

  }


  // ==========================================
  // ADD PRODUCT FORM CONTROLS
  // ==========================================

  get addProductControls() {

    return this.addProductForm.controls;

  }


  // ==========================================
  // READ CATEGORY FROM URL
  // ==========================================

  readCategoryFromUrl(): void {

    this.route
      .queryParamMap

      .pipe(
        takeUntil(
          this.destroy$
        )
      )

      .subscribe(
        params => {

          const category =
            params.get(
              'category'
            );


          // ====================================
          // VALID CATEGORY
          // ====================================

          if (

            category

            &&

            this.categories.includes(
              category.toLowerCase()
            )

          ) {

            this.selectedCategory =
              category.toLowerCase();

          }


          // ====================================
          // ALL PRODUCTS
          // ====================================

          else {

            this.selectedCategory =
              'All';

          }


          this.applyFilters();

        }
      );

  }


  // ==========================================
  // LOAD PRODUCTS
  // ==========================================

  loadProducts(): void {

    this.errorMessage =
      '';


    this.productService
      .getProducts()

      .pipe(
        takeUntil(
          this.destroy$
        )
      )

      .subscribe({

        // ======================================
        // SUCCESS
        // ======================================

        next: (
          response: Product[]
        ) => {

          this.allProducts =
            response || [];


          this.applyFilters();

        },


        // ======================================
        // ERROR
        // ======================================

        error: (
          error: any
        ) => {

          console.error(
            'Product List Error:',
            error
          );


          this.errorMessage =
            'Unable to load products.';

        }

      });

  }


  // ==========================================
  // SEARCH PRODUCTS
  // ==========================================

  searchProducts(): void {

    this.applyFilters();

  }


  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  clearSearch(): void {

    this.searchText =
      '';


    this.applyFilters();

  }


  // ==========================================
  // SELECT CATEGORY
  // ==========================================

  selectCategory(
    category: string
  ): void {

    this.selectedCategory =
      category;


    this.router.navigate(
      [],

      {

        relativeTo:
          this.route,

        queryParams: {

          category:

            category ===
            'All'

              ?

            null

              :

            category

        },

        queryParamsHandling:
          'merge'

      }
    );


    this.applyFilters();

  }


  // ==========================================
  // APPLY FILTERS
  // ==========================================

  applyFilters(): void {

    const search =
      this.searchText
        .trim()
        .toLowerCase();


    this.products =
      this.allProducts.filter(

        (
          product: Product
        ) => {

          // ==================================
          // CATEGORY MATCH
          // ==================================

          const categoryMatch =

            this.selectedCategory ===
            'All'

            ||

            product.category
              ?.toLowerCase() ===
            this.selectedCategory
              .toLowerCase();


          // ==================================
          // SEARCH MATCH
          // ==================================

          const searchMatch =

            !search

            ||

            product.title
              ?.toLowerCase()
              .includes(
                search
              )

            ||

            product.brand
              ?.toLowerCase()
              .includes(
                search
              )

            ||

            product.category
              ?.toLowerCase()
              .includes(
                search
              );


          return (

            categoryMatch

            &&

            searchMatch

          );

        }

      );

  }


  // ==========================================
  // GET CATEGORY COUNT
  // ==========================================

  getCategoryCount(
    category: string
  ): number {

    if (
      category ===
      'All'
    ) {

      return this.allProducts.length;

    }


    return this.allProducts
      .filter(
        product =>

          product.category
            ?.toLowerCase() ===

          category
            .toLowerCase()

      )
      .length;

  }


  // ==========================================
  // CATEGORY ICON
  // ==========================================

  getCategoryIcon(
    category: string
  ): string {

    switch (
      category.toLowerCase()
    ) {

      case 'beauty':

        return '💄';


      case 'fragrances':

        return '🌸';


      case 'groceries':

        return '🛒';


      default:

        return '🛍️';

    }

  }


  // ==========================================
  // CATEGORY DISPLAY NAME
  // ==========================================

  getCategoryName(
    category: string
  ): string {

    if (
      !category
    ) {

      return '';

    }


    return (

      category
        .charAt(0)
        .toUpperCase()

      +

      category.slice(1)

    );

  }


  // ==========================================
  // VIEW ALL PRODUCTS
  // ==========================================

  viewAllProducts(): void {

    this.searchText =
      '';


    this.selectedCategory =
      'All';


    this.router.navigate(
      [],

      {

        relativeTo:
          this.route,

        queryParams: {

          category:
            null

        },

        queryParamsHandling:
          'merge'

      }
    );


    this.applyFilters();

  }


  // ==========================================
  // VIEW PRODUCT DETAILS
  // ==========================================

  viewDetails(
    productId: number
  ): void {

    this.router.navigate(
      [
        '/products',
        productId
      ]
    );

  }


  // ==========================================
  // ADD TO CART
  // ==========================================

// ==========================================
// ADD TO CART
// ==========================================

addToCart(
  product: Product,
  event: Event
): void {

  // ========================================
  // STOP PRODUCT CARD CLICK
  // ========================================

  event.stopPropagation();


  // ========================================
  // CHECK USER LOGIN
  // ========================================

  if (
    !this.authService.isLoggedIn()
  ) {

    // ======================================
    // USER IS NOT LOGGED IN
    // ======================================

    this.router.navigate(
      ['/login'],
      {
        queryParams: {
          returnUrl:
            this.router.url
        }
      }
    );

    return;

  }


  if (
    !this.canAddToCart
  ) {

    return;

  }


  // ========================================
  // USER IS LOGGED IN
  // ========================================

  this.productService.addToCart(
    product,
    1
  );


  // ========================================
  // UPDATE CART COUNT
  // ========================================

  this.updateCartCount();


  // ========================================
  // SUCCESS MESSAGE
  // ========================================

  this.cartMessage =
    `${product.title} added to cart`;


  // ========================================
  // CLEAR MESSAGE
  // ========================================

  setTimeout(
    () => {

      this.cartMessage = '';

    },
    2000
  );

}


  // ==========================================
  // UPDATE CART COUNT
  // ==========================================

  updateCartCount(): void {

    this.cartCount =
      this.productService
        .getCartCount();

  }


  // ==========================================
  // GO TO CART
  // ==========================================

  goToCart(): void {

    this.router.navigate(
      [
        '/cart'
      ]
    );

  }


  // ==========================================
  // OPEN ADD PRODUCT FORM
  // ==========================================

  openAddProductForm(): void {

    if (
      !this.canAddProduct
    ) {

      return;

    }

    this.showAddProductForm =
      true;

  }


  // ==========================================
  // CLOSE ADD PRODUCT FORM
  // ==========================================

  closeAddProductForm(): void {

    this.showAddProductForm =
      false;


    this.addProductForm.reset();

  }


  // ==========================================
  // ADD NEW PRODUCT
  // ==========================================

  addProduct(): void {

    if (
      !this.canAddProduct
    ) {

      return;

    }

    // ========================================
    // SHOW VALIDATION ERRORS
    // ========================================

    this.addProductForm
      .markAllAsTouched();


    if (
      this.addProductForm.invalid
    ) {

      return;

    }


    // ========================================
    // FORM VALUE
    // ========================================

    const formValue =
      this.addProductForm.value;


    // ========================================
    // CREATE NEW PRODUCT
    // ========================================

    const newProduct:
      Product = {

      id:
        Date.now(),

      title:
        formValue.name.trim(),

      brand:
        formValue.brand.trim(),

      category:
        formValue.category,

      price:
        Number(
          formValue.price
        ),

      oldPrice:
        formValue.oldPrice
          ? Number(
            formValue.oldPrice
          )
          : Number(
            formValue.price
          ),

      rating:
        0,

      reviews:
        0,

      image:
        formValue.image.trim(),

      description:
        formValue.description.trim(),

      stock:
        Number(
          formValue.stock
        )

    };


    // ========================================
    // SAVE PRODUCT
    // ========================================

    this.productService
      .addCustomProduct(
        newProduct
      );


    // ========================================
    // UPDATE PRODUCT LIST
    // ========================================

    this.allProducts = [

      newProduct,

      ...this.allProducts

    ];


    // ========================================
    // SHOW ALL PRODUCTS
    // ========================================

    this.selectedCategory =
      'All';


    // ========================================
    // CLEAR SEARCH
    // ========================================

    this.searchText =
      '';


    this.applyFilters();


    // ========================================
    // REMOVE CATEGORY FROM URL
    // ========================================

    this.router.navigate(
      [],

      {

        relativeTo:
          this.route,

        queryParams: {

          category:
            null

        },

        queryParamsHandling:
          'merge'

      }
    );


    console.log(
      'New Product Added:',
      newProduct
    );


    // ========================================
    // CLOSE MODAL
    // ========================================

    this.closeAddProductForm();

  }


  // ==========================================
  // COMPONENT DESTROY
  // ==========================================

  ngOnDestroy(): void {

    this.destroy$
      .next();


    this.destroy$
      .complete();

  }

}