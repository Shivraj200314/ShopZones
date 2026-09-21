import {
  Component,
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
  Product
} from '../product';

import {
  ProductService
} from '../product.service';

import {
  PRODUCT_FALLBACK
} from '../core/constants/product-fallback.constants';
import { ProductRevampService } from '../services/product-revamp.service';
import { mergeData } from 'src/app/units/marge';


@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent
  implements OnInit {


  // ==========================================
  // REVAMP FALLBACK
  // ==========================================

  revampFallback =
    signal<any>(
      PRODUCT_FALLBACK
    );

  allProducts: Product[] = [];

  products: Product[] = [];


  // ==========================================
  // CATEGORY
  // ==========================================

  selectedCategory:
    string = 'All';


  categories: string[] = [
    'beauty',
    'fragrances',
    'groceries'
  ];


  // ==========================================
  // SEARCH
  // ==========================================

  searchText:
    string = '';

  cartCount:
    number = 0;


  cartMessage:
    string = '';


  // ==========================================
  // ERROR
  // ==========================================

  errorMessage:
    string = '';


  // ==========================================
  // ADD PRODUCT
  // ==========================================

  showAddProductForm:
    boolean = false;


  addProductForm!:
    FormGroup;


 constructor(
  private productService:
    ProductService,

  private router:
    Router,

  private route:
    ActivatedRoute,

  private fb:
    FormBuilder,

    private productRevampService:ProductRevampService

    
) { }


 ngOnInit(): void {

  this.createAddProductForm();

  // Constant already loaded first

  this.readCategoryFromUrl();
  this.loadProducts();
this.loadRevampData();
  this.updateCartCount();

}
loadRevampData(): void {

  this.productRevampService
    .getRevampContent()
    .subscribe({

      next: (response: any) => {

        console.log(
          'RAW REVAMP API:',
          response
        );

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


        this.revampFallback.set(
          finalData
        );

      },

      error: (error: any) => {

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

viewAllProducts(): void {

  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  this.searchText = '';


  // ==========================================
  // SELECT ALL PRODUCTS
  // ==========================================

  this.selectedCategory =
    'All';


  // ==========================================
  // REMOVE CATEGORY FROM URL
  // ==========================================

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


  // ==========================================
  // SHOW ALL PRODUCTS
  // ==========================================

  this.applyFilters();

}



private normalizeRevampData(
  response: any
): any {


  if (!response) {

    return {};

  }


  // ==========================================
  // CASE 1
  // API ALREADY MATCHES FALLBACK
  //
  // {
  //   "product-list": {...}
  // }
  // ==========================================

  if (
    response['product-list'] ||
    response['product-detail'] ||
    response['products-loader']
  ) {

    return response;

  }


  // ==========================================
  // CASE 2
  // API RETURNS { data: {...} }
  // ==========================================

  if (
    response.data
  ) {

    return this.normalizeRevampData(
      response.data
    );

  }


  // ==========================================
  // CASE 3
  // API RETURNS screenContent ARRAY
  // ==========================================

  if (
    Array.isArray(
      response.screenContent
    )
  ) {

    return this.convertKeyArrayToObject(
      response.screenContent
    );

  }


  // ==========================================
  // CASE 4
  // EM / AEM STYLE
  //
  // {
  //   content: [
  //     {
  //       screenIdentifier: "...",
  //       screenContent: [...]
  //     }
  //   ]
  // }
  // ==========================================

  if (
    Array.isArray(
      response.content
    )
  ) {

    const finalData: any = {};


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


  // ==========================================
  // CASE 5
  // DIRECT ARRAY
  //
  // [
  //   {
  //     key: 'product-list',
  //     ...
  //   }
  // ]
  // ==========================================

  if (
    Array.isArray(
      response
    )
  ) {

    return this.convertKeyArrayToObject(
      response
    );

  }


  return response;

}
private convertKeyArrayToObject(
  items: any[]
): any {

  const result: any = {};


  items.forEach(
    (
      item: any
    ) => {

      if (
        !item ||
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


getRevampProduct(
  productId: number
): any {

  return (
    this.revampFallback()
      ?.['products']
      ?.find(
        (item: any) =>
          item.id === productId
      )
    || {}
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
      .subscribe(
        params => {

          const category =
            params.get(
              'category'
            );


          if (
            category &&
            this.categories.includes(
              category.toLowerCase()
            )
          ) {

            this.selectedCategory =
              category.toLowerCase();

          }

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

    this.errorMessage = '';


    this.productService
      .getProducts()
      .subscribe({

        next: (
          response: Product[]
        ) => {

          this.allProducts =
            response || [];


          this.applyFilters();

        },


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
  // SEARCH
  // ==========================================

  searchProducts(): void {

    this.applyFilters();

  }


  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  clearSearch(): void {

    this.searchText = '';

    this.applyFilters();

  }

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
            category === 'All'
              ? null
              : category

        },

        queryParamsHandling:
          'merge'

      }
    );


    this.applyFilters();

  }

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


          // CATEGORY
          const categoryMatch =

            this.selectedCategory ===
            'All'

            ||

            product.category
              ?.toLowerCase() ===
            this.selectedCategory
              .toLowerCase();


          // SEARCH
          const searchMatch =

            !search

            ||

            product.title
              ?.toLowerCase()
              .includes(search)

            ||

            product.brand
              ?.toLowerCase()
              .includes(search)

            ||

            product.category
              ?.toLowerCase()
              .includes(search);


          return (
            categoryMatch &&
            searchMatch
          );

        }
      );

  }

  getCategoryCount(
    category: string
  ): number {

    if (
      category === 'All'
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

    if (!category) {

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
  // VIEW DETAILS
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

  addToCart(
    product: Product,
    event: Event
  ): void {

    event.stopPropagation();


    this.productService
      .addToCart(
        product,
        1
      );


    this.updateCartCount();


    this.cartMessage =
      `${product.title} added to cart`;


    setTimeout(
      () => {

        this.cartMessage = '';

      },
      2000
    );

  }


  // ==========================================
  // CART COUNT
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
      ['/cart']
    );

  }


  // ==========================================
  // OPEN ADD PRODUCT FORM
  // ==========================================

  openAddProductForm(): void {

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

    // Show validation errors
    this.addProductForm
      .markAllAsTouched();


    if (
      this.addProductForm.invalid
    ) {

      return;

    }


    const formValue =
      this.addProductForm.value;


    // ========================================
    // CREATE NEW PRODUCT
    // ========================================

    const newProduct: Product = {

      // Unique local product id
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
    // SAVE IN LOCAL STORAGE THROUGH SERVICE
    // ========================================

    this.productService
      .addCustomProduct(
        newProduct
      );


    // ========================================
    // UPDATE PRODUCT LIST IMMEDIATELY
    // ========================================

    this.allProducts = [

      newProduct,

      ...this.allProducts

    ];


    // Show all products after adding
    this.selectedCategory =
      'All';


    // Clear search
    this.searchText =
      '';


    this.applyFilters();


    // Remove category from URL
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


    // Close modal
    this.closeAddProductForm();

  }

}