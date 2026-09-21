import {
  Component,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  FormControl
} from '@angular/forms';

import {
  combineLatest,
  Subject
} from 'rxjs';

import {
  debounceTime,
  startWith,
  takeUntil
} from 'rxjs/operators';

import {
  Order
} from '../models/order.model';

import {
  OrderItem
} from '../models/order-item.model';

import {
  ORDER_FALLBACK
} from '../core/constants/order-fallback.constants';

import {
  OrdersRevampService
} from '../services/orders-revamp.service';


@Component({
  selector:
    'app-orders',

  templateUrl:
    './orders.component.html',

  styleUrls: [
    './orders.component.css'
  ]
})
export class OrdersComponent
  implements OnInit, OnDestroy {


  // ==========================================
  // REVAMP
  // ==========================================

  revampFallback =
    signal<any>(
      ORDER_FALLBACK
    );


  // ==========================================
  // DISPLAY ORDERS
  // ==========================================

  orders:
    Order[] = [];


  // ==========================================
  // ORIGINAL ORDERS
  // ==========================================

  private allOrders:
    Order[] = [];


  // ==========================================
  // SEARCH
  // ==========================================

  searchControl =
    new FormControl(
      '',
      {
        nonNullable:
          true
      }
    );


  // ==========================================
  // STATUS FILTER
  // ==========================================

  statusControl =
    new FormControl(
      'All',
      {
        nonNullable:
          true
      }
    );


  // ==========================================
  // SORT
  // ==========================================

  sortControl =
    new FormControl(
      'latest',
      {
        nonNullable:
          true
      }
    );


  // ==========================================
  // DESTROY
  // ==========================================

  private destroy$ =
    new Subject<void>();


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(

    private ordersRevampService:
      OrdersRevampService,

    private router:
      Router

  ) {}


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    this.loadRevampContent();

    this.loadOrders();

    this.setupFilters();

  }


  // ==========================================
  // LOAD REVAMP
  // ==========================================

  loadRevampContent(): void {

    this.ordersRevampService
      .getRevampContent()

      .pipe(
        takeUntil(
          this.destroy$
        )
      )

      .subscribe({

        next: (
          content: any
        ) => {

          console.log(
            'Orders revamp content:',
            content
          );


          this.revampFallback
            .set(
              content ||
              ORDER_FALLBACK
            );

        },


        error: (
          error: any
        ) => {

          console.error(
            'Orders revamp error:',
            error
          );


          this.revampFallback
            .set(
              ORDER_FALLBACK
            );

        }

      });

  }


  // ==========================================
  // LOAD ORDERS
  // ==========================================

  loadOrders(): void {

    try {

      const savedOrders =
        localStorage.getItem(
          'shopzone_orders'
        );


      console.log(
        'Orders saved:',
        savedOrders
      );


      if (
        !savedOrders
      ) {

        this.allOrders = [];

        this.orders = [];

        return;

      }


      const parsedOrders =
        JSON.parse(
          savedOrders
        );


      if (
        !Array.isArray(
          parsedOrders
        )
      ) {

        this.allOrders = [];

        this.orders = [];

        return;

      }


      this.allOrders =
        parsedOrders as Order[];


      // Latest order first
      this.allOrders.sort(
        (
          first: Order,
          second: Order
        ) => {

          return (

            new Date(
              this.getCreatedDate(
                second
              )
            ).getTime()

            -

            new Date(
              this.getCreatedDate(
                first
              )
            ).getTime()

          );

        }
      );


      this.orders = [
        ...this.allOrders
      ];


      console.log(
        'Loaded orders:',
        this.orders
      );

    }

    catch (
      error
    ) {

      console.error(
        'Order loading failed:',
        error
      );


      this.allOrders = [];

      this.orders = [];

    }

  }


  // ==========================================
  // SEARCH + FILTER + SORT
  // ==========================================

  setupFilters(): void {

    combineLatest([

      this.searchControl
        .valueChanges
        .pipe(
          startWith(
            this.searchControl.value
          )
        ),

      this.statusControl
        .valueChanges
        .pipe(
          startWith(
            this.statusControl.value
          )
        ),

      this.sortControl
        .valueChanges
        .pipe(
          startWith(
            this.sortControl.value
          )
        )

    ])

      .pipe(

        debounceTime(
          200
        ),

        takeUntil(
          this.destroy$
        )

      )

      .subscribe(
        ([
          search,
          status,
          sort
        ]) => {

          this.applyFilters(
            search,
            status,
            sort
          );

        }
      );

  }


  // ==========================================
  // APPLY FILTERS
  // ==========================================

  applyFilters(
    searchText:
      string =
        this.searchControl.value,

    status:
      string =
        this.statusControl.value,

    sort:
      string =
        this.sortControl.value

  ): void {

    const search =
      searchText
        .trim()
        .toLowerCase();


    let filteredOrders = [
      ...this.allOrders
    ];


    // ========================================
    // SEARCH
    // ========================================

    if (
      search
    ) {

      filteredOrders =
        filteredOrders.filter(
          (
            order: Order
          ) => {


            const orderId =
              this.getOrderId(
                order
              )
                .toLowerCase();


            const orderStatus =
              this.getOrderStatus(
                order
              )
                .toLowerCase();


            const payment =
              this.getPaymentMethod(
                order
              )
                .toLowerCase();


            const customer =
              this.getCustomerName(
                order
              )
                .toLowerCase();


            const city =
              this.getCustomerCity(
                order
              )
                .toLowerCase();


            const productMatch =
              this.getOrderItems(
                order
              )
                .some(
                  (
                    item: OrderItem
                  ) => {

                    return (
                      item.name ||
                      ''
                    )
                      .toLowerCase()
                      .includes(
                        search
                      );

                  }
                );


            return (

              orderId.includes(
                search
              )

              ||

              orderStatus.includes(
                search
              )

              ||

              payment.includes(
                search
              )

              ||

              customer.includes(
                search
              )

              ||

              city.includes(
                search
              )

              ||

              productMatch

            );

          }
        );

    }


    // ========================================
    // STATUS FILTER
    // ========================================

    if (
      status !==
      'All'
    ) {

      filteredOrders =
        filteredOrders.filter(
          (
            order: Order
          ) =>

            this.getOrderStatus(
              order
            )
              .toLowerCase() ===
            status.toLowerCase()
        );

    }


    // ========================================
    // SORT
    // ========================================

    filteredOrders.sort(
      (
        first: Order,
        second: Order
      ) => {


        switch (
          sort
        ) {


          // OLDEST FIRST
          case 'oldest':

            return (

              new Date(
                this.getCreatedDate(
                  first
                )
              ).getTime()

              -

              new Date(
                this.getCreatedDate(
                  second
                )
              ).getTime()

            );


          // HIGH TOTAL
          case 'high':

            return (

              this.getOrderTotal(
                second
              )

              -

              this.getOrderTotal(
                first
              )

            );


          // LOW TOTAL
          case 'low':

            return (

              this.getOrderTotal(
                first
              )

              -

              this.getOrderTotal(
                second
              )

            );


          // LATEST FIRST
          default:

            return (

              new Date(
                this.getCreatedDate(
                  second
                )
              ).getTime()

              -

              new Date(
                this.getCreatedDate(
                  first
                )
              ).getTime()

            );

        }

      }
    );


    this.orders =
      filteredOrders;

  }


  // ==========================================
  // CLEAR SEARCH
  // ==========================================

  clearSearch(): void {

    this.searchControl
      .setValue(
        ''
      );

  }


  // ==========================================
  // CLEAR ALL FILTERS
  // ==========================================

  clearFilters(): void {

    this.searchControl
      .setValue(
        '',
        {
          emitEvent:
            false
        }
      );


    this.statusControl
      .setValue(
        'All',
        {
          emitEvent:
            false
        }
      );


    this.sortControl
      .setValue(
        'latest',
        {
          emitEvent:
            false
        }
      );


    this.applyFilters();

  }


  // ==========================================
  // ACTIVE FILTER CHECK
  // ==========================================

  get hasActiveFilters():
    boolean {

    return (

      !!this.searchControl.value

      ||

      this.statusControl.value !==
      'All'

      ||

      this.sortControl.value !==
      'latest'

    );

  }


  // ==========================================
  // TOTAL ORDERS
  // ==========================================

  get totalOrders():
    number {

    return this.allOrders.length;

  }


  // ==========================================
  // PLACED COUNT
  // ==========================================

  get placedOrders():
    number {

    return this
      .allOrders
      .filter(
        order =>

          this.getOrderStatus(
            order
          )
            .toLowerCase() ===
          'placed'
      )
      .length;

  }


  // ==========================================
  // DELIVERED COUNT
  // ==========================================

  get deliveredOrders():
    number {

    return this
      .allOrders
      .filter(
        order =>

          this.getOrderStatus(
            order
          )
            .toLowerCase() ===
          'delivered'
      )
      .length;

  }


  // ==========================================
  // CANCELLED COUNT
  // ==========================================

  get cancelledOrders():
    number {

    return this
      .allOrders
      .filter(
        order => {

          const status =
            this.getOrderStatus(
              order
            )
              .toLowerCase();


          return (

            status ===
              'cancelled'

            ||

            status ===
              'canceled'

          );

        }
      )
      .length;

  }


  // ==========================================
  // TOTAL SPENT
  // ==========================================

  get totalSpent():
    number {

    return this
      .allOrders
      .filter(
        order => {

          const status =
            this.getOrderStatus(
              order
            )
              .toLowerCase();


          return (

            status !==
              'cancelled'

            &&

            status !==
              'canceled'

          );

        }
      )
      .reduce(
        (
          total: number,
          order: Order
        ) =>

          total +
          this.getOrderTotal(
            order
          ),

        0
      );

  }


  // ==========================================
  // ORDER ID
  // ==========================================

  getOrderId(
    order: Order
  ): string {

    const currentOrder =
      order as any;


    if (
      currentOrder.orderId
    ) {

      return String(
        currentOrder.orderId
      );

    }


    if (
      currentOrder.id !==
        undefined
    ) {

      return String(
        currentOrder.id
      );

    }


    return '';

  }


  // ==========================================
  // STATUS
  // ==========================================

  getOrderStatus(
    order: Order
  ): string {

    return (

      (order as any)
        .status

      ||

      'Placed'

    );

  }


  // ==========================================
  // STATUS CLASS
  // ==========================================

  getStatusClass(
    order: Order
  ): string {

    const status =
      this.getOrderStatus(
        order
      )
        .toLowerCase();


    if (
      status ===
      'placed'
    ) {

      return 'placed';

    }


    if (
      status ===
      'delivered'
    ) {

      return 'delivered';

    }


    if (
      status ===
      'pending'
    ) {

      return 'pending';

    }


    if (
      status ===
        'cancelled'

      ||

      status ===
        'canceled'
    ) {

      return 'cancelled';

    }


    return 'default-status';

  }


  // ==========================================
  // ORDER ITEMS
  // ==========================================

  getOrderItems(
    order: Order
  ): OrderItem[] {

    const items =
      (order as any)
        .items;


    return Array.isArray(
      items
    )
      ? items
      : [];

  }


  // ==========================================
  // CUSTOMER NAME
  // ==========================================

  getCustomerName(
    order: Order
  ): string {

    const customer =
      (order as any)
        .customer;


    if (
      !customer
    ) {

      return '';

    }


    if (
      customer.fullName
    ) {

      return customer.fullName;

    }


    return (

      `${
        customer.firstName ||
        ''
      } ${
        customer.lastName ||
        ''
      }`

    )
      .trim();

  }


  // ==========================================
  // CITY
  // ==========================================

  getCustomerCity(
    order: Order
  ): string {

    return (

      (order as any)
        .customer
        ?.city

      ||

      ''

    );

  }


  // ==========================================
  // PAYMENT
  // ==========================================

  getPaymentMethod(
    order: Order
  ): string {

    const currentOrder =
      order as any;


    const method =
      (

        currentOrder
          .paymentMethod

        ||

        currentOrder
          .payment
          ?.method

        ||

        currentOrder
          .customer
          ?.paymentMethod

        ||

        ''

      )
        .toString()
        .trim()
        .toLowerCase();


    if (
      method === 'cod' ||
      method === 'cash' ||
      method ===
        'cash on delivery'
    ) {

      return 'Cash on Delivery';

    }


    if (
      method === 'upi'
    ) {

      return 'UPI';

    }


    if (
      method ===
        'credit-card' ||
      method ===
        'credit_card' ||
      method ===
        'credit card'
    ) {

      return 'Credit Card';

    }


    if (
      method ===
        'debit-card' ||
      method ===
        'debit_card' ||
      method ===
        'debit card'
    ) {

      return 'Debit Card';

    }


    if (
      method === 'card'
    ) {

      return 'Card Payment';

    }


    if (
      method ===
        'netbanking' ||
      method ===
        'net banking'
    ) {

      return 'Net Banking';

    }


    return (
      method ||
      'Not Available'
    );

  }


  // ==========================================
  // CREATED DATE
  // ==========================================

  getCreatedDate(
    order: Order
  ): string {

    return (

      (order as any)
        .createdAt

      ||

      ''

    );

  }


  // ==========================================
  // FORMAT DATE
  // ==========================================

  formatDate(
    date: string
  ): string {

    if (
      !date
    ) {

      return '';

    }


    return new Date(
      date
    )
      .toLocaleDateString(
        'en-IN',
        {
          day:
            '2-digit',

          month:
            'short',

          year:
            'numeric'
        }
      );

  }


  // ==========================================
  // TOTAL ITEMS
  // ==========================================

  getTotalItems(
    order: Order
  ): number {

    return this
      .getOrderItems(
        order
      )
      .reduce(
        (
          total: number,
          item: OrderItem
        ) =>

          total +
          Number(
            item.quantity ||
            0
          ),

        0
      );

  }


  // ==========================================
  // ITEM TOTAL
  // ==========================================

  getItemTotal(
    item: OrderItem
  ): number {

    return (

      Number(
        item.price ||
        0
      )

      *

      Number(
        item.quantity ||
        0
      )

    );

  }


  // ==========================================
  // ORDER TOTAL
  // ==========================================

  getOrderTotal(
    order: Order
  ): number {

    const currentOrder =
      order as any;


    if (
      currentOrder.total !==
        undefined &&
      currentOrder.total !==
        null
    ) {

      return Number(
        currentOrder.total
      );

    }


    if (
      currentOrder.totalAmount !==
        undefined &&
      currentOrder.totalAmount !==
        null
    ) {

      return Number(
        currentOrder.totalAmount
      );

    }


    return this
      .getOrderItems(
        order
      )
      .reduce(
        (
          total: number,
          item: OrderItem
        ) =>

          total +
          this.getItemTotal(
            item
          ),

        0
      );

  }


  // ==========================================
  // CAN CANCEL
  // ==========================================

  canCancel(
    order: Order
  ): boolean {

    const status =
      this.getOrderStatus(
        order
      )
        .toLowerCase();


    return (

      status ===
        'placed'

      ||

      status ===
        'pending'

    );

  }


  // ==========================================
  // CANCEL ORDER
  // ==========================================

  cancelOrder(
    order: Order
  ): void {

    const orderId =
      this.getOrderId(
        order
      );


    const confirmed =
      window.confirm(
        `Cancel order #${orderId}?`
      );


    if (
      !confirmed
    ) {

      return;

    }


    const targetOrder =
      this.allOrders.find(
        currentOrder =>

          this.getOrderId(
            currentOrder
          ) ===
          orderId
      );


    if (
      !targetOrder
    ) {

      return;

    }


    (
      targetOrder as any
    ).status =
      'Cancelled';


    this.saveOrders();


    this.applyFilters();

  }


  // ==========================================
  // REORDER
  // ==========================================
reorder(
  order: Order
): void {

  const orderItems =
    this.getOrderItems(
      order
    );


  if (
    !orderItems ||
    orderItems.length === 0
  ) {

    console.error(
      'No products found for reorder'
    );

    return;

  }


  const cartItems =
    orderItems.map(
      (item: any) => {

        return {

          id:
            Number(
              item.id
            ),

          name:
            item.name ||
            item.title ||
            'Product',

          brand:
            item.brand ||
            '',

          image:
            item.image ||
            item.thumbnail ||
            '',

          price:
            Number(
              item.price ||
              0
            ),

          oldPrice:
            Number(
              item.oldPrice ||
              item.price ||
              0
            ),

          quantity:
            Number(
              item.quantity ||
              1
            ),

          stock:
            Number(
              item.stock ||
              99
            )

        };

      }
    );


  // ==========================================
  // REPLACE CART WITH REORDER PRODUCTS
  // ==========================================

  localStorage.setItem(
    'shopzone_cart',
    JSON.stringify(
      cartItems
    )
  );


  console.log(
    'REORDER SAVED CART:',
    localStorage.getItem(
      'shopzone_cart'
    )
  );


  this.router.navigate([
    '/cart'
  ]);

}


  // ==========================================
  // SAVE ORDERS
  // ==========================================

  private saveOrders():
    void {

    localStorage.setItem(
      'shopzone_orders',
      JSON.stringify(
        this.allOrders
      )
    );

  }


  // ==========================================
  // VIEW DETAILS
  // ==========================================

  viewOrderDetails(
    order: Order
  ): void {

    const orderId =
      this.getOrderId(
        order
      );


    if (
      !orderId
    ) {

      return;

    }


    this.router.navigate([
      '/orders',
      orderId
    ]);

  }

  ngOnDestroy(): void {

    this.destroy$
      .next();


    this.destroy$
      .complete();

  }

}