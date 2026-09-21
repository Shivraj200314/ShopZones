import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  CartItem
} from './cart-item';

import {
  CartService
} from './cart.service';

import {
  CART_FALLBACK
} from './core/constants/cart-fallback.constants';

import {
  CartRevampService
} from '../service/cart-revamp.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent
  implements OnInit {


  // =========================================
  // REVAMP FALLBACK
  // =========================================

  revampFallback =
    signal<any>(
      CART_FALLBACK
    );


  // =========================================
  // CART ITEMS
  // =========================================

  cartItems:
    CartItem[] = [];


  // =========================================
  // TOTAL
  // =========================================

  total: number =
    0;


  constructor(

    private cartService:
      CartService,

    private router:
      Router,

    private cartRevampService:
      CartRevampService

  ) { }


  // =========================================
  // INIT
  // =========================================

  ngOnInit(): void {

    this.loadCart();

    this.loadRevampContent();

  }


  // =========================================
  // LOAD REVAMP CONTENT
  // =========================================

  loadRevampContent(): void {

    this.cartRevampService
      .getRevampContent()
      .subscribe({

        next: (response) => {

          console.log(
            'Cart Revamp Response:',
            response
          );


          this.revampFallback.set(
            response
          );

        },

        error: (error) => {

          console.error(
            'Cart Revamp Error:',
            error
          );


          this.revampFallback.set(
            CART_FALLBACK
          );

        }

      });

  }


  // =========================================
  // LOAD CART
  // =========================================

  loadCart(): void {

    this.cartItems =
      this.cartService
        .getCartItems();


    this.calculateTotal();


    console.log(
      'Cart MFE items:',
      this.cartItems
    );

  }


  // =========================================
  // INCREASE
  // =========================================

  increase(
    productId: number
  ): void {

    this.cartItems =
      this.cartService
        .increaseQuantity(
          productId
        );


    this.calculateTotal();

  }


  // =========================================
  // DECREASE
  // =========================================

  decrease(
    productId: number
  ): void {

    this.cartItems =
      this.cartService
        .decreaseQuantity(
          productId
        );


    this.calculateTotal();

  }

  remove(
    productId: number
  ): void {

    this.cartItems =
      this.cartService
        .removeItem(
          productId
        );


    this.calculateTotal();

  }


  // =========================================
  // TOTAL
  // =========================================

  calculateTotal(): void {

    this.total =
      this.cartItems
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


  // =========================================
  // CHECKOUT
  // =========================================

proceedToCheckout(): void {

  if (
    !this.cartItems ||
    this.cartItems.length === 0
  ) {

    return;

  }


  const checkoutData = {

    items:
      this.cartItems,

    totalItems:
      this.cartItems.reduce(
        (
          total: number,
          item: any
        ) =>
          total +
          Number(
            item.quantity || 1
          ),
        0
      ),

    totalAmount:
      this.cartItems.reduce(
        (
          total: number,
          item: any
        ) =>
          total +
          (
            Number(
              item.price || 0
            )
            *
            Number(
              item.quantity || 1
            )
          ),
        0
      ),

    createdAt:
      new Date()
        .toISOString()

  };


  localStorage.setItem(
    'checkout_cart',
    JSON.stringify(
      checkoutData
    )
  );


  console.log(
    'Checkout saved cart:',
    checkoutData
  );


  this.router.navigate(
    [
      '/checkout'
    ]
  );

}


  // =========================================
  // PRODUCTS
  // =========================================

  continueShopping(): void {

    this.router.navigate([
      '/products'
    ]);

  }

}