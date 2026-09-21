import {
  Component,
  OnInit,
  signal
} from '@angular/core';

import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  CheckoutRevampService
} from '../service/checkout-revamp.service';

import {
  CHECKOUT_FALLBACK
} from './core/constants/checkout-fallback.constants';


// ==========================================
// CART ITEM
// ==========================================

interface CartItem {

  id?: number;

  name: string;

  image: string;

  price: number;

  quantity: number;

}


// ==========================================
// ORDER
// ==========================================

interface Order {

  orderId: string;

  customer: any;

  items: CartItem[];

  subtotal: number;

  total: number;

  paymentMethod:
    'cod' | 'upi';

  upiId?: string;

  status: string;

  createdAt: string;

}


// ==========================================
// NO WHITESPACE VALIDATOR
// ==========================================

export function noWhitespaceValidator():
  ValidatorFn {

  return (
    control: AbstractControl
  ): ValidationErrors | null => {

    const value =
      control.value;


    if (
      typeof value === 'string' &&
      value.trim().length === 0
    ) {

      return {

        whitespace:
          true

      };

    }


    return null;

  };

}


@Component({

  selector:
    'app-checkout',

  templateUrl:
    './checkout.component.html',

  styleUrls: [
    './checkout.component.css'
  ]

})
export class CheckoutComponent
  implements OnInit {


  // ==========================================
  // REVAMP FALLBACK
  // ==========================================

  revampFallback =
    signal<any>(
      CHECKOUT_FALLBACK
    );


  // ==========================================
  // CHECKOUT FORM
  // ==========================================

  checkoutForm!:
    FormGroup;


  // ==========================================
  // CART ITEMS
  // ==========================================

  cartItems:
    CartItem[] = [];


  // ==========================================
  // PAYMENT ERROR
  // ==========================================

  paymentError =
    '';


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(

    private fb:
      FormBuilder,

    private checkoutRevampService:
      CheckoutRevampService,

    private router:
      Router

  ) {}


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.createCheckoutForm();

    this.loadCartItems();

    this.loadRevampContent();

  }


  // ==========================================
  // CREATE CHECKOUT FORM
  // ==========================================

  createCheckoutForm(): void {

    this.checkoutForm =
      this.fb.group({


        // ======================================
        // FULL NAME
        // ======================================

        fullName: [
          '',
          [

            Validators.required,

            noWhitespaceValidator(),

            Validators.minLength(
              3
            ),

            Validators.maxLength(
              60
            ),

            Validators.pattern(
              /^[A-Za-z][A-Za-z .'-]*$/
            )

          ]
        ],


        // ======================================
        // EMAIL
        // ======================================

        email: [
          '',
          [

            Validators.required,

              Validators.pattern(
      /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@(gmail\.com|yahoo\.com|yahoo\.in|outlook\.com|hotmail\.com|rediffmail\.com|icloud\.com|protonmail\.com)$/
    )

          ]
        ],

        phone: [
          '',
          [

            Validators.required,

            Validators.pattern(
              /^[6-9][0-9]{9}$/
            )

          ]
        ],


        // ======================================
        // ADDRESS
        // ======================================

        address: [
          '',
          [

            Validators.required,

            noWhitespaceValidator(),

            Validators.minLength(
              10
            ),

            Validators.maxLength(
              200
            )

          ]
        ],


        // ======================================
        // CITY
        // ======================================

        city: [
          '',
          [

            Validators.required,

            noWhitespaceValidator(),

            Validators.pattern(
              /^[A-Za-z][A-Za-z .'-]*$/
            )

          ]
        ],


        // ======================================
        // STATE
        // ======================================

        state: [
          '',
          [

            Validators.required,

            noWhitespaceValidator(),

            Validators.pattern(
              /^[A-Za-z][A-Za-z .'-]*$/
            )

          ]
        ],


        // ======================================
        // PINCODE
        // 6 DIGITS, CANNOT START WITH 0
        // ======================================

        pinCode: [
          '',
          [

            Validators.required,

            Validators.pattern(
              /^[1-9][0-9]{5}$/
            )

          ]
        ],


        // ======================================
        // PAYMENT METHOD
        // ======================================

        paymentMethod: [
          'cod',
          Validators.required
        ],


        // ======================================
        // UPI ID
        // VALIDATORS ADDED DYNAMICALLY
        // ======================================

        upiId: [
          ''
        ]

      });

  }


  // ==========================================
  // FORM CONTROLS
  // ==========================================

  get f() {

    return this
      .checkoutForm
      .controls;

  }


  // ==========================================
  // SELECT PAYMENT METHOD
  // ==========================================

  selectPaymentMethod(
    method: 'cod' | 'upi'
  ): void {

    this.paymentError =
      '';


    const paymentControl =
      this.checkoutForm
        .get(
          'paymentMethod'
        );


    const upiControl =
      this.checkoutForm
        .get(
          'upiId'
        );


    paymentControl
      ?.setValue(
        method
      );


    if (!upiControl) {

      return;

    }


    // ========================================
    // UPI SELECTED
    // ========================================

    if (
      method === 'upi'
    ) {

      upiControl
        .setValidators([

          Validators.required,

          noWhitespaceValidator(),

          Validators.pattern(
            /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+$/
          )

        ]);

    }


    // ========================================
    // COD SELECTED
    // ========================================

    else {

      upiControl
        .clearValidators();


      upiControl
        .setValue(
          ''
        );

    }


    upiControl
      .updateValueAndValidity();

  }


  // ==========================================
  // LOAD REVAMP CONTENT
  // ==========================================

  loadRevampContent(): void {

    this.checkoutRevampService
      .getRevampContent()
      .subscribe({

        next: (
          response: any
        ) => {

          this.revampFallback
            .set(
              response
            );

        },


        error: (
          error: any
        ) => {

          console.error(
            'Checkout Revamp Error:',
            error
          );


          this.revampFallback
            .set(
              CHECKOUT_FALLBACK
            );

        }

      });

  }


  // ==========================================
  // LOAD CART ITEMS
  // ==========================================

 loadCartItems(): void {

  try {

    // ==========================================
    // READ CHECKOUT CART
    // ==========================================

    const savedCart =
      localStorage.getItem(
        'checkout_cart'
      );


    console.log(
      'Checkout saved cart:',
      savedCart
    );


    // ==========================================
    // NO CHECKOUT DATA
    // ==========================================

    if (!savedCart) {

      this.cartItems = [];

      return;

    }


    // ==========================================
    // PARSE CHECKOUT DATA
    // ==========================================

    const checkoutData =
      JSON.parse(
        savedCart
      );


    console.log(
      'Checkout parsed data:',
      checkoutData
    );


    // ==========================================
    // GET ITEMS FROM OBJECT
    // ==========================================

    const items =
      checkoutData?.items;


    if (
      !Array.isArray(
        items
      )
    ) {

      console.error(
        'Checkout items are not an array'
      );

      this.cartItems = [];

      return;

    }


    // ==========================================
    // MAP CART ITEMS
    // ==========================================

    this.cartItems =
      items.map(
        (item: any) => {

          return {

            id:
              item.id,

            name:
              item.name ||
              item.title ||
              'Product',

            image:
              item.image ||
              item.thumbnail ||
              '',

            price:
              Number(
                item.price || 0
              ),

            quantity:
              Number(
                item.quantity || 1
              )

          };

        }
      );


    console.log(
      'Checkout cartItems:',
      this.cartItems
    );


    console.log(
      'Checkout total:',
      checkoutData?.totalAmount
    );

  }

  catch (error) {

    console.error(
      'Unable to load checkout cart:',
      error
    );

    this.cartItems = [];

  }

}


  // ==========================================
  // ITEM TOTAL
  // ==========================================

  getItemTotal(
    item: CartItem
  ): number {

    return (

      item.price *

      item.quantity

    );

  }


  // ==========================================
  // SUBTOTAL
  // ==========================================

  getSubtotal(): number {

    return this.cartItems
      .reduce(

        (
          total: number,
          item: CartItem
        ) => {

          return (

            total +

            this.getItemTotal(
              item
            )

          );

        },

        0

      );

  }


  // ==========================================
  // TOTAL
  // ==========================================

  getTotal(): number {

    return this.getSubtotal();

  }


  // ==========================================
  // BACK TO CART
  // ==========================================

  backToCart(): void {

    this.router.navigate([

      '/cart'

    ]);

  }


  // ==========================================
  // PLACE ORDER
  // ==========================================

  placeOrder(): void {

    this.paymentError =
      '';


    // ========================================
    // MARK ALL FIELDS TOUCHED
    // ========================================

    this.checkoutForm
      .markAllAsTouched();


    // ========================================
    // INVALID FORM
    // ========================================

    if (
      this.checkoutForm.invalid
    ) {

      console.log(
        'Checkout form invalid'
      );


      return;

    }


    // ========================================
    // EMPTY CART
    // ========================================

    if (
      this.cartItems.length === 0
    ) {

      console.log(
        'Cart is empty'
      );


      return;

    }


    // ========================================
    // GET FORM VALUES
    // ========================================

    const formValue =
      this.checkoutForm
        .getRawValue();


    const paymentMethod =
      formValue.paymentMethod as
        'cod' | 'upi';


    // ========================================
    // CREATE ORDER
    // ========================================

    const order:
      Order = {

        orderId:
          'ORD-' +
          Date.now(),


        customer: {

          fullName:
            formValue
              .fullName
              .trim(),

          email:
            formValue
              .email
              .trim(),

          phone:
            formValue
              .phone,

          address:
            formValue
              .address
              .trim(),

          city:
            formValue
              .city
              .trim(),

          state:
            formValue
              .state
              .trim(),

          pinCode:
            formValue
              .pinCode

        },


        items: [
          ...this.cartItems
        ],


        subtotal:
          this.getSubtotal(),


        total:
          this.getTotal(),


        paymentMethod:
          paymentMethod,


        upiId:

          paymentMethod ===
            'upi'

            ? formValue
                .upiId
                .trim()

            : '',


        status:
          'Placed',


        createdAt:
          new Date()
            .toISOString()

      };


    console.log(
      'Order:',
      order
    );


    // ========================================
    // READ EXISTING ORDERS
    // ========================================

    let existingOrders:
      Order[] = [];


    try {

      const savedOrders =
        localStorage.getItem(
          'shopzone_orders'
        );


      if (
        savedOrders
      ) {

        const parsedOrders =
          JSON.parse(
            savedOrders
          );


        if (
          Array.isArray(
            parsedOrders
          )
        ) {

          existingOrders =
            parsedOrders;

        }

      }

    }

    catch (error) {

      console.error(
        'Unable to read existing orders:',
        error
      );


      existingOrders =
        [];

    }


    // ========================================
    // ADD NEW ORDER
    // ========================================

    const updatedOrders = [

      order,

      ...existingOrders

    ];


    // ========================================
    // SAVE ORDERS
    // ========================================

    localStorage.setItem(

      'shopzone_orders',

      JSON.stringify(
        updatedOrders
      )

    );


    console.log(
      'Saved Orders:',
      updatedOrders
    );


    // ========================================
    // CLEAR CART STORAGE
    // ========================================

    localStorage.removeItem(
      'shopzone_cart'
    );

    localStorage.removeItem(
      'cartItems'
    );

    localStorage.removeItem(
      'cart'
    );

    localStorage.removeItem(
      'cart_items'
    );


    this.cartItems =
      [];


    // ========================================
    // RESET FORM
    // ========================================

    this.checkoutForm
      .reset({

        fullName:
          '',

        email:
          '',

        phone:
          '',

        address:
          '',

        city:
          '',

        state:
          '',

        pinCode:
          '',

        paymentMethod:
          'cod',

        upiId:
          ''

      });


    // ========================================
    // RESET UPI VALIDATION
    // ========================================

    this.selectPaymentMethod(
      'cod'
    );


    this.paymentError =
      '';


    // ========================================
    // SUCCESS
    // ========================================

    alert(
      'Order placed successfully!'
    );


    this.router
      .navigateByUrl(
        '/products'
      );

  }

}