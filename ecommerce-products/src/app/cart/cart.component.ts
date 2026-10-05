import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CartItem } from './cart-item';
import { ProductService } from '../products/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  cartItems: CartItem[] = [];

  constructor(
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cartItems =
      this.productService.getCartItems();
  }

  getItemTotal(item: CartItem): number {
    return item.price * item.quantity;
  }

  getSubtotal(): number {
    return this.cartItems.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );
  }

  getTotal(): number {
    return this.getSubtotal();
  }

  increaseQuantity(item: CartItem): void {

    if (item.quantity < item.stock) {

      this.productService.updateCartQuantity(
        item.id,
        item.quantity + 1
      );

      this.loadCart();
    }
  }

  decreaseQuantity(item: CartItem): void {

    if (item.quantity > 1) {

      this.productService.updateCartQuantity(
        item.id,
        item.quantity - 1
      );

      this.loadCart();
    }
  }

  removeItem(item: CartItem): void {

    this.productService.removeFromCart(
      item.id
    );

    this.loadCart();
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  checkout(): void {

    if (this.cartItems.length === 0) {
      return;
    }

    this.router.navigate(['/checkout']);
  }
}