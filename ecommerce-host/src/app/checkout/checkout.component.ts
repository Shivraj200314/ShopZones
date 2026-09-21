import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;

  // API may contain either image or thumbnail//
  image?: string;
  thumbnail?: string;
}

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  // =========================================
  // CART
  // =========================================

  cartItems: CartItem[] = [];


  // =========================================
  // CUSTOMER DETAILS
  // =========================================

  customer = {
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  };


  // =========================================
  // PAYMENT
  // =========================================

  paymentMethod = 'cod';

  isPlacingOrder = false;


  constructor(
    private router: Router
  ) {}


  ngOnInit(): void {

    this.loadCart();

  }


  // =========================================
  // LOAD CART
  // =========================================

  loadCart(): void {

    const cart =
      localStorage.getItem('cartItems');

    if (cart) {

      this.cartItems =
        JSON.parse(cart);

    }

  }


  // =========================================
  // PRODUCT IMAGE
  // =========================================

  getProductImage(
    item: CartItem
  ): string {

    return (
      item.thumbnail ||
      item.image ||
      'https://placehold.co/100x100'
    );

  }


  // =========================================
  // ITEM TOTAL
  // =========================================

  getItemTotal(
    item: CartItem
  ): number {

    return (
      item.price *
      item.quantity
    );

  }


  // =========================================
  // SUBTOTAL
  // =========================================

  get subtotal(): number {

    return this.cartItems.reduce(
      (
        total,
        item
      ) => {

        return total +
          (
            item.price *
            item.quantity
          );

      },
      0
    );

  }


  // =========================================
  // DELIVERY
  // =========================================

  get deliveryCharge(): number {

    if (
      this.subtotal === 0 ||
      this.subtotal >= 999
    ) {

      return 0;

    }

    return 99;

  }


  // =========================================
  // GRAND TOTAL
  // =========================================

  get grandTotal(): number {

    return (
      this.subtotal +
      this.deliveryCharge
    );

  }


  // =========================================
  // VALIDATE CUSTOMER
  // =========================================

  validateForm(): boolean {

    if (
      !this.customer.fullName ||
      !this.customer.email ||
      !this.customer.phone ||
      !this.customer.address ||
      !this.customer.city ||
      !this.customer.state ||
      !this.customer.pincode
    ) {

      alert(
        'Please fill all delivery details.'
      );

      return false;

    }


    if (
      this.customer.phone.length !== 10
    ) {

      alert(
        'Please enter a valid 10 digit mobile number.'
      );

      return false;

    }


    if (
      this.customer.pincode.length !== 6
    ) {

      alert(
        'Please enter a valid 6 digit pincode.'
      );

      return false;

    }

    return true;

  }


  // =========================================
  // PLACE ORDER
  // =========================================

  placeOrder(): void {

    if (
      this.cartItems.length === 0
    ) {

      alert(
        'Your cart is empty.'
      );

      return;

    }


    if (
      !this.validateForm()
    ) {

      return;

    }


    this.isPlacingOrder = true;


    const order = {

      id:
        'ORD-' +
        Date.now(),

      customer:
        this.customer,

      items:
        this.cartItems,

      subtotal:
        this.subtotal,

      deliveryCharge:
        this.deliveryCharge,

      total:
        this.grandTotal,

      paymentMethod:
        this.paymentMethod,

      status:
        'Order Placed',

      orderDate:
        new Date().toISOString()

    };


    // =========================================
    // GET OLD ORDERS
    // =========================================

    const existingOrders =
      JSON.parse(
        localStorage.getItem(
          'orders'
        ) || '[]'
      );


    // =========================================
    // ADD NEW ORDER
    // =========================================

    existingOrders.push(
      order
    );


    localStorage.setItem(
      'orders',
      JSON.stringify(
        existingOrders
      )
    );


    // =========================================
    // CLEAR CART
    // =========================================

    localStorage.removeItem(
      'cartItems'
    );


    alert(
      'Order placed successfully!'
    );


    // =========================================
    // NAVIGATE ORDERS MFE
    // =========================================

    this.router.navigate([
      '/orders'
    ]);

  }


  // =========================================
  // BACK TO CART
  // =========================================

  goToCart(): void {

    this.router.navigate([
      '/cart'
    ]);

  }

}