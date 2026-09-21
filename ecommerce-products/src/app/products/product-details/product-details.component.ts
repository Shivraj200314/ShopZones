import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Location
} from '@angular/common';

import {
  Product
} from '../product';

import {
  ProductService
} from '../product.service';

import {
  PRODUCT_FALLBACK
} from '../core/constants/product-fallback.constants';


@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent
  implements OnInit {

  revampFallback =
    signal<any>(
      PRODUCT_FALLBACK
    );


  product!: Product;

  productId!: number;


  quantity: number = 1;

  cartCount: number = 0;

  isLoading: boolean = false;

  errorMessage: string = '';


  constructor(

    private route: ActivatedRoute,

    private router: Router,

    private location: Location,

    private productService: ProductService

  ) {}

  ngOnInit(): void {

    // Get product id from URL
    this.productId =
      Number(
        this.route
          .snapshot
          .paramMap
          .get('id')
      );


    // Get product from API
    this.getProduct();


    // Get cart count
    this.updateCartCount();

  }

  getProduct(): void {

    this.isLoading = true;

    this.errorMessage = '';


    this.productService
      .getProductById(
        this.productId
      )
      .subscribe({

        next: (
          product: Product
        ) => {

          this.product =
            product;


          console.log(
            'Product Details:',
            product
          );


          this.isLoading =
            false;

        },

        error: (error) => {

          console.error(
            'Product Details API Error:',
            error
          );


          this.errorMessage =
            'Unable to load product details.';


          this.isLoading =
            false;

        }

      });

  }

  increaseQuantity(): void {

    if (!this.product) {

      return;

    }


    if (
      this.quantity <
      this.product.stock
    ) {

      this.quantity++;

    }

  }

  decreaseQuantity(): void {

    if (
      this.quantity > 1
    ) {

      this.quantity--;

    }

  }

  getTotalPrice(): number {

    if (!this.product) {

      return 0;

    }


    return (

      this.product.price *
      this.quantity

    );

  }

  addToCart(): void {

    if (!this.product) {

      return;

    }


    this.productService
      .addToCart(
        this.product,
        this.quantity
      );


    // Update cart count
    this.updateCartCount();


    console.log(
      'Added to cart:',
      this.product.title,
      'Quantity:',
      this.quantity
    );


    alert(
      `${this.product.title} added to cart`
    );

  }

  updateCartCount(): void {

    this.cartCount =
      this.productService
        .getCartCount();

  }


buyNow(): void {

  if (!this.product) {
    return;
  }


  console.log(
    'Buy Now Product:',
    this.product
  );


  // ==========================================
  // CURRENT PRODUCT ONLY
  // ==========================================

  const buyNowItem = {

    id:
      this.product.id,

    name:
      this.product.title,

    brand:
      this.product.brand,

    image:
      this.product.image ?? '',

    price:
      Number(
        this.product.price || 0
      ),

    oldPrice:
      Number(
        this.product.oldPrice ||
        this.product.price ||
        0
      ),

    quantity:
      this.quantity,

    stock:
      this.product.stock

  };


  // ==========================================
  // CHECKOUT DATA
  // ==========================================

  const checkoutData = {

    items: [
      buyNowItem
    ],

    totalItems:
      this.quantity,

    totalAmount:
      Number(
        (
          this.product.price *
          this.quantity
        ).toFixed(2)
      ),

    createdAt:
      new Date()
        .toISOString()

  };


  // ==========================================
  // IMPORTANT:
  // REMOVE OLD CHECKOUT DATA
  // ==========================================

  localStorage.removeItem(
    'checkout_cart'
  );


  // ==========================================
  // SAVE CURRENT PRODUCT
  // ==========================================

  localStorage.setItem(
    'checkout_cart',
    JSON.stringify(
      checkoutData
    )
  );


  console.log(
    'BUY NOW CHECKOUT DATA:',
    checkoutData
  );


  // ==========================================
  // GO TO CHECKOUT
  // ==========================================

  this.router.navigate(
    [
      '/checkout'
    ]
  );

}


  goBack(): void {

    this.location.back();

  }

}