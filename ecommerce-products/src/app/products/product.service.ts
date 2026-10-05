import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable,
  catchError,
  map,
  of,
  throwError
} from 'rxjs';

import {
  Product
} from './product';

import type {
  CartItem
} from '../cart/cart-item';

import {
  PRODUCT_FALLBACK
} from './core/constants/product-fallback.constants';


// =============================================
// DUMMY JSON PRODUCT INTERFACE
// =============================================

interface DummyJsonProduct {

  id: number;

  title: string;

  description: string;

  category: string;

  price: number;

  discountPercentage?: number;

  rating: number;

  stock: number;

  brand?: string;

  thumbnail?: string;

  // ADD
  image?: string;

  // ADD
  oldPrice?: number;

  reviews?: any;

}


// =============================================
// DUMMY JSON RESPONSE
// =============================================

interface DummyJsonProductResponse {

  products: DummyJsonProduct[];

  total: number;

  skip: number;

  limit: number;

}


@Injectable({
  providedIn: 'root'
})
export class ProductService {
  getRevampContent() {
    throw new Error('Method not implemented.');
  }

  // https://dummyjson.com/c/49b5-905a-4627-8869
  private readonly apiUrl =
    'https://dummyjson.com/c/49b5-905a-4627-8869';

    // https://dummyjson.com/c/374f-f022-4cb0-bd88
  private readonly cartKey =
    'https://dummyjson.com/c/374f-f022-4cb0-bd88';

  private readonly customProductsKey =
    'shopzone_custom_products';

  private readonly inventoryStockKey =
    'shopzone_inventory_stock';

  constructor(
    private http: HttpClient
  ) {}


  getProducts(): Observable<Product[]> {

  console.log(
    'Product API called'
  );

  return this.http
    .get<DummyJsonProductResponse | null>(
      this.apiUrl
    )
    .pipe(

      map(
        (
          response:
            DummyJsonProductResponse | null
        ) => {

          console.log(
            'Product API response:',
            response
          );

          if (
            !response ||
            !Array.isArray(
              response.products
            )
          ) {

            throw new Error(
              'Invalid or empty product API response'
            );

          }


        const apiProducts =
  response.products.map(
    product =>
      this.mapProduct(
        product
      )
  );

         const customProducts =
  this.getCustomProducts()
    .map(
      product =>
        this.mapProduct(
          product
        )
    );


          return [

            ...customProducts,

            ...apiProducts

          ];

        }
      ),


      catchError(
        error => {

          console.error(
            'Product API failed. Using PRODUCT_FALLBACK:',
            error
          );


         const fallbackProducts =
  PRODUCT_FALLBACK.products.map(
    (product: any) =>
      this.mapProduct(
        product
      )
  );


        const customProducts =
  this.getCustomProducts()
    .map(
      product =>
        this.mapProduct(
          product
        )
    );


          return of([

            ...customProducts,

            ...fallbackProducts

          ]);

        }
      )

    );

}


  // =============================================
  // GET PRODUCT BY ID
  // =============================================

  getProductById(
    id: number
  ): Observable<Product> {


    // =========================================
    // STEP 1
    // CHECK CUSTOM PRODUCTS FIRST
    // =========================================

    const customProduct =
      this.getCustomProducts()
        .find(
          product =>
            product.id === id
        );


    if (
      customProduct
    ) {

      console.log(
        'Custom Product Found:',
        customProduct
      );


      return of(
        this.mapProduct(
          customProduct
        )
      );

    }


    // =========================================
    // STEP 2
    // CHECK API PRODUCT
    // =========================================

    return this.http
      .get<DummyJsonProductResponse | null>(
        `${this.apiUrl}?limit=100`
      )
      .pipe(

        map(
          (
            response:
              DummyJsonProductResponse | null
          ) => {


            if (
              !response ||
              !Array.isArray(
                response.products
              )
            ) {

              throw new Error(
                'Invalid or empty product API response'
              );

            }


            const product =
              response.products.find(
                product =>
                  product.id === id
              );


            if (
              !product
            ) {

              throw new Error(
                `Product with id ${id} not found`
              );

            }


            return this.mapProduct(
              product
            );

          }
        ),


        // =====================================
        // FALLBACK PRODUCT
        // =====================================

        catchError(
          error => {

            console.error(
              'Product Details API Error:',
              error
            );


            const fallbackProduct =
              PRODUCT_FALLBACK.products.find(
                product =>
                  product.id === id
              );


            if (
              !fallbackProduct
            ) {

              return throwError(
                () =>
                  new Error(
                    `Product with id ${id} not found in fallback`
                  )
              );

            }


            return of(
              this.mapProduct(
                fallbackProduct
              )
            );

          }
        )

      );

  }


  // =============================================
  // MAP API PRODUCT
  // =============================================
private mapProduct(
  product: any
): Product {

  const stockOverrides =
    this.getInventoryStock();

  const price =
    Number(
      product.price ?? 0
    );


  const discountPercentage =
    Number(
      product.discountPercentage ?? 0
    );


  // ==========================================
  // OLD PRICE
  // ==========================================

  let oldPrice =
    price;


  // Custom product already has oldPrice
  if (
    product.oldPrice !== undefined &&
    product.oldPrice !== null &&
    Number(product.oldPrice) > 0
  ) {

    oldPrice =
      Number(
        product.oldPrice
      );

  }


  // API product uses discountPercentage
  else if (
    discountPercentage > 0
  ) {

    oldPrice =
      price /
      (
        1 -
        discountPercentage / 100
      );

  }


  // ==========================================
  // REVIEWS
  // ==========================================

  let reviewsCount =
    0;


  if (
    Array.isArray(
      product.reviews
    )
  ) {

    reviewsCount =
      product.reviews.length;

  }

  else {

    reviewsCount =
      Number(
        product.reviews ?? 0
      );

  }


  return {

    id:
      Number(
        product.id ?? 0
      ),

    title:
      product.title ??
      product.name ??
      '',

    brand:
      product.brand ??
      'Generic',

    category:
      product.category ??
      '',

    price:
      price,

    oldPrice:
      Number(
        oldPrice.toFixed(2)
      ),

    rating:
      Number(
        product.rating ?? 0
      ),

    reviews:
      reviewsCount,

    image:
      product.image ??
      product.thumbnail ??
      '',

    description:
      product.description ??
      '',

    stock:
      Number(
        stockOverrides[
          String(product.id ?? 0)
        ] ??
        product.stock ??
        0
      )

  };

}


  private getInventoryStock():
    Record<string, number> {

    const savedStock =
      localStorage.getItem(
        this.inventoryStockKey
      );


    if (
      !savedStock
    ) {

      return {};

    }


    try {

      const parsedStock =
        JSON.parse(
          savedStock
        );

      return parsedStock &&
        typeof parsedStock === 'object' &&
        !Array.isArray(parsedStock)
        ? parsedStock
        : {};

    }

    catch (
      error
    ) {

      console.error(
        'Error reading product inventory:',
        error
      );

      return {};

    }

  }


  // =============================================
  // GET CATEGORIES
  // =============================================

  getCategories(
    products: Product[]
  ): string[] {

    return [

      'All',

      ...Array.from(
        new Set(
          products.map(
            product =>
              product.category
          )
        )
      )

    ];

  }



  // =================================================
  // CUSTOM PRODUCT FUNCTIONALITY STARTS HERE
  // =================================================



  // =============================================
  // GET CUSTOM PRODUCTS
  // =============================================

  getCustomProducts(): Product[] {

    const data =
      localStorage.getItem(
        this.customProductsKey
      );


    if (
      !data
    ) {

      return [];

    }


    try {

      const products =
        JSON.parse(
          data
        );


      if (
        Array.isArray(
          products
        )
      ) {

        return products;

      }


      return [];

    }

    catch (
      error
    ) {

      console.error(
        'Error reading custom products:',
        error
      );


      return [];

    }

  }


  // =============================================
  // SAVE CUSTOM PRODUCTS
  // =============================================

  private saveCustomProducts(
    products: Product[]
  ): void {

    localStorage.setItem(

      this.customProductsKey,

      JSON.stringify(
        products
      )

    );

  }


  // =============================================
  // ADD CUSTOM PRODUCT
  // =============================================

addCustomProduct(
  product: Product
): void {

  const customProducts =
    this.getCustomProducts();

  customProducts.unshift(
    product
  );

  this.saveCustomProducts(
    customProducts
  );

}


  // =============================================
  // DELETE CUSTOM PRODUCT
  // OPTIONAL - USEFUL LATER
  // =============================================

  deleteCustomProduct(
    productId: number
  ): void {

    const customProducts =
      this.getCustomProducts()
        .filter(
          product =>
            product.id !==
            productId
        );


    this.saveCustomProducts(
      customProducts
    );

  }



  // =================================================
  // CUSTOM PRODUCT FUNCTIONALITY ENDS HERE
  // =================================================



  // =============================================
  // GET STORED CART
  // =============================================

  private getStoredCart():
    CartItem[] {

    const data =
      localStorage.getItem(
        this.cartKey
      );


    if (
      !data
    ) {

      return [];

    }


    try {

      const cart =
        JSON.parse(
          data
        );


      return Array.isArray(
        cart
      )
        ? cart
        : [];

    }

    catch (
      error
    ) {

      console.error(
        'Error reading cart:',
        error
      );


      return [];

    }

  }


  // =============================================
  // SAVE CART
  // =============================================

  private saveCart(
    items: CartItem[]
  ): void {

    localStorage.setItem(

      this.cartKey,

      JSON.stringify(
        items
      )

    );

  }


  // =============================================
  // ADD TO CART
  // =============================================

  addToCart(
    product: Product,
    quantity: number = 1
  ): void {

    const cartItems =
      this.getStoredCart();


    const existingItem =
      cartItems.find(
        item =>
          item.id ===
          product.id
      );


    // =========================================
    // PRODUCT ALREADY EXISTS
    // =========================================

    if (
      existingItem
    ) {

      existingItem.quantity +=
        quantity;


      if (
        existingItem.quantity >
        product.stock
      ) {

        existingItem.quantity =
          product.stock;

      }

    }


    // =========================================
    // NEW CART PRODUCT
    // =========================================

    else {

      cartItems.push({

        id:
          product.id,

        name:
          product.title,

        brand:
          product.brand,

        image:
          product.image ?? '',

        price:
          product.price,

        oldPrice:
          product.oldPrice,

        quantity:
          quantity,

        stock:
          product.stock

      });

    }


    this.saveCart(
      cartItems
    );

  }


  // =============================================
  // GET CART ITEMS
  // =============================================

  getCartItems():
    CartItem[] {

    return this.getStoredCart();

  }


  // =============================================
  // GET CART COUNT
  // =============================================

  getCartCount():
    number {

    return this
      .getStoredCart()
      .reduce(
        (
          total,
          item
        ) =>

          total +
          item.quantity,

        0
      );

  }


  // =============================================
  // REMOVE FROM CART
  // =============================================

  removeFromCart(
    productId: number
  ): void {

    const cartItems =
      this.getStoredCart()
        .filter(
          item =>
            item.id !==
            productId
        );


    this.saveCart(
      cartItems
    );

  }


  // =============================================
  // CLEAR CART
  // =============================================

  clearCart(): void {

    this.saveCart(
      []
    );

  }


  // =============================================
  // UPDATE CART QUANTITY
  // =============================================

  updateCartQuantity(
    productId: number,
    quantity: number
  ): void {

    const cartItems =
      this.getStoredCart();


    const item =
      cartItems.find(
        item =>
          item.id ===
          productId
      );


    if (
      !item
    ) {

      return;

    }


    if (
      quantity < 1
    ) {

      quantity = 1;

    }


    if (
      quantity >
      item.stock
    ) {

      quantity =
        item.stock;

    }


    item.quantity =
      quantity;


    this.saveCart(
      cartItems
    );

  }


  // =============================================
  // GET CART TOTAL
  // =============================================

  getCartTotal():
    number {

    return this
      .getStoredCart()
      .reduce(
        (
          total,
          item
        ) =>

          total +
          (
            item.price *
            item.quantity
          ),

        0
      );

  }

}