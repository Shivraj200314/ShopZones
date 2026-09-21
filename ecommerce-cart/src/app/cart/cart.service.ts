import {
  Injectable
} from '@angular/core';

import {
  CartItem
} from './cart-item';


@Injectable({
  providedIn: 'root'
})
export class CartService {

  // SAME KEY AS PRODUCT MFE
  private readonly cartKey =
    'https://dummyjson.com/c/374f-f022-4cb0-bd88';

  getCartItems(): CartItem[] {

    const data =
      localStorage.getItem(
        this.cartKey
      );


    if (!data) {

      return [];

    }


    try {

      return JSON.parse(
        data
      );

    } catch (error) {

      console.error(
        'Unable to read cart:',
        error
      );

      return [];

    }

  }


  // =========================================
  // SAVE CART
  // =========================================

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


  // =========================================
  // INCREASE
  // =========================================

  increaseQuantity(
    productId: number
  ): CartItem[] {

    const cartItems =
      this.getCartItems();


    const item =
      cartItems.find(
        item =>
          item.id === productId
      );


    if (
      item &&
      item.quantity < item.stock
    ) {

      item.quantity++;

    }


    this.saveCart(
      cartItems
    );


    return cartItems;

  }


  // =========================================
  // DECREASE
  // =========================================

  decreaseQuantity(
    productId: number
  ): CartItem[] {

    const cartItems =
      this.getCartItems();


    const item =
      cartItems.find(
        item =>
          item.id === productId
      );


    if (
      item &&
      item.quantity > 1
    ) {

      item.quantity--;

    }


    this.saveCart(
      cartItems
    );


    return cartItems;

  }


  // =========================================
  // REMOVE
  // =========================================

  removeItem(
    productId: number
  ): CartItem[] {

    const cartItems =
      this.getCartItems()
        .filter(
          item =>
            item.id !== productId
        );


    this.saveCart(
      cartItems
    );


    return cartItems;

  }


  // =========================================
  // CLEAR
  // =========================================

  clearCart(): void {

    localStorage.removeItem(
      this.cartKey
    );

  }


  // =========================================
  // TOTAL
  // =========================================

  getTotal(): number {

    return this
      .getCartItems()
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