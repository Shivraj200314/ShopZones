import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private cartItems: any[] = [];

  private cartSubject =
    new BehaviorSubject<any[]>([]);

  cart$ =
    this.cartSubject.asObservable();


  addToCart(product: any, quantity: number = 1): void {

    const existingProduct =
      this.cartItems.find(
        item => item.id === product.id
      );

    if (existingProduct) {

      existingProduct.quantity += quantity;

    } else {

      this.cartItems.push({
        ...product,
        quantity: quantity
      });

    }

    this.cartSubject.next(
      [...this.cartItems]
    );
  }


  getCart(): any[] {

    return [...this.cartItems];

  }


  removeFromCart(id: number): void {

    this.cartItems =
      this.cartItems.filter(
        item => item.id !== id
      );

    this.cartSubject.next(
      [...this.cartItems]
    );
  }


  clearCart(): void {

    this.cartItems = [];

    this.cartSubject.next([]);

  }

}