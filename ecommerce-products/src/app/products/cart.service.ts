import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../cart/cart-item';


export class CartService {

  private items: CartItem[] = [];

  private cartSubject =
    new BehaviorSubject<CartItem[]>([]);

  cartItems$ =
    this.cartSubject.asObservable();


  addToCart(product: CartItem): void {

    const existing =
      this.items.find(
        item => item.id === product.id
      );

    if (existing) {

      if (existing.quantity < existing.stock) {
        existing.quantity++;
      }

    } else {

      this.items.push({
        ...product,
        quantity: 1
      });

    }

    this.emit();

  }


  removeFromCart(id: number): void {

    this.items =
      this.items.filter(
        item => item.id !== id
      );

    this.emit();

  }


  increaseQuantity(id: number): void {

    const item =
      this.items.find(
        item => item.id === id
      );

    if (
      item &&
      item.quantity < item.stock
    ) {

      item.quantity++;

      this.emit();

    }

  }


  decreaseQuantity(id: number): void {

    const item =
      this.items.find(
        item => item.id === id
      );

    if (!item) {
      return;
    }

    if (item.quantity > 1) {

      item.quantity--;

      this.emit();

    }

  }


  getItems(): CartItem[] {

    return [...this.items];

  }


  getTotalItems(): number {

    return this.items.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  }


  getSubtotal(): number {

    return this.items.reduce(
      (total, item) =>
        total +
        item.price * item.quantity,
      0
    );

  }


  clearCart(): void {

    this.items = [];

    this.emit();

  }


  private emit(): void {

    this.cartSubject.next(
      [...this.items]
    );

  }

}