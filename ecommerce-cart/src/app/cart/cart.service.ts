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

  private readonly cartKey =
    'https://dummyjson.com/c/374f-f022-4cb0-bd88';

  getCartItems():
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

      const parsedData =
        JSON.parse(
          data
        );


      if (
        Array.isArray(
          parsedData
        )
      ) {

        return parsedData;

      }


      return [];

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

  increaseQuantity(
    productId: number
  ): CartItem[] {

    const cartItems =
      this.getCartItems();


    const item =
      cartItems.find(
        currentItem =>
          currentItem.id ===
          productId
      );


    if (
      item &&
      item.quantity <
      item.stock
    ) {

      item.quantity +=
        1;

    }


    this.saveCart(
      cartItems
    );


    return cartItems;

  }

  decreaseQuantity(
    productId: number
  ): CartItem[] {

    const cartItems =
      this.getCartItems();


    const item =
      cartItems.find(
        currentItem =>
          currentItem.id ===
          productId
      );


    if (
      item &&
      item.quantity > 1
    ) {

      item.quantity -=
        1;

    }


    this.saveCart(
      cartItems
    );


    return cartItems;

  }

  removeItem(
    productId: number
  ): CartItem[] {

    const cartItems =
      this.getCartItems()
        .filter(
          item =>
            item.id !==
            productId
        );


    this.saveCart(
      cartItems
    );


    return cartItems;

  }

  clearCart(): void {

    localStorage.removeItem(
      this.cartKey
    );

  }

  getTotal():
    number {

    return this
      .getCartItems()
      .reduce(
        (
          total,
          item
        ) => {

          return (
            total +
            (
              Number(
                item.price ||
                0
              )
              *
              Number(
                item.quantity ||
                0
              )
            )
          );
        },
        0
      );
  }
}