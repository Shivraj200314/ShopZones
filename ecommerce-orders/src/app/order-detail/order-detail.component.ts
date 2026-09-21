import {
  Component,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Subject,
  takeUntil
} from 'rxjs';

import {
  Order
} from '../orders/models/order.model';

import {
  ORDER_FALLBACK
} from '../orders/core/constants/order-fallback.constants';

import {
  OrdersRevampService
} from '../orders/services/orders-revamp.service';


@Component({
  selector:
    'app-order-detail',

  templateUrl:
    './order-detail.component.html',

  styleUrls: [
    './order-detail.component.css'
  ]
})
export class OrderDetailComponent
  implements OnInit, OnDestroy {


  // ==========================================
  // REVAMP FALLBACK
  // ==========================================

  revampFallback =
    signal<any>(
      ORDER_FALLBACK
    );


  // ==========================================
  // ORDER
  // ==========================================

  order:
    Order | null = null;


  // ==========================================
  // ORDER ID
  // ==========================================

  orderId =
    '';


  // ==========================================
  // DESTROY
  // ==========================================

  private destroy$ =
    new Subject<void>();


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(

    private route:
      ActivatedRoute,

    private router:
      Router,

    private ordersRevampService:
      OrdersRevampService

  ) {}


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {

    // Load revamp content
    this.loadRevampContent();


    // Get order ID
    this.route
      .paramMap

      .pipe(

        takeUntil(
          this.destroy$
        )

      )

      .subscribe(
        params => {

          this.orderId =
            params.get(
              'id'
            ) || '';


          this.loadOrder();

        }
      );

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
          content
        ) => {

          console.log(
            'Order detail revamp content:',
            content
          );


          this.revampFallback
            .set(
              content
            );

        },


        error: (
          error
        ) => {

          console.error(
            'Order detail revamp failed:',
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
  // LOAD ORDER
  // ==========================================

  loadOrder(): void {

    try {

      const savedOrders =
        localStorage.getItem(
          'shopzone_orders'
        );


      if (
        !savedOrders
      ) {

        this.order =
          null;

        return;

      }


      const orders:
        Order[] =
        JSON.parse(
          savedOrders
        );


      if (
        !Array.isArray(
          orders
        )
      ) {

        this.order =
          null;

        return;

      }


      const selectedOrder =
        orders.find(
          order => {

            const currentOrder =
              order as any;


            const id =

              currentOrder.orderId ??

              currentOrder.id;


            return (

              String(
                id
              ) ===

              String(
                this.orderId
              )

            );

          }
        );


      this.order =
        selectedOrder ||
        null;

    }

    catch (
      error
    ) {

      console.error(
        'Order detail load error:',
        error
      );


      this.order =
        null;

    }

  }


  // ==========================================
  // GET ORDER ITEMS
  // ==========================================

  getOrderItems():
    any[] {

    const currentOrder =
      this.order as any;


    if (
      !currentOrder
    ) {

      return [];

    }


    return Array.isArray(
      currentOrder.items
    )

      ? currentOrder.items

      : [];

  }


  // ==========================================
  // TOTAL ITEMS
  // ==========================================

  getTotalItems():
    number {

    return this
      .getOrderItems()
      .reduce(

        (
          total: number,
          item: any
        ) => {

          return (

            total +

            Number(
              item.quantity || 0
            )

          );

        },

        0

      );

  }


  // ==========================================
  // ITEM TOTAL
  // ==========================================

  getItemTotal(
    item: any
  ): number {

    return (

      Number(
        item.price || 0
      )

      *

      Number(
        item.quantity || 0
      )

    );

  }


  // ==========================================
  // ORDER ID
  // ==========================================

  getOrderId():
    string {

    const currentOrder =
      this.order as any;


    if (
      !currentOrder
    ) {

      return '';

    }


    return String(

      currentOrder.orderId ??

      currentOrder.id ??

      ''

    );

  }


  // ==========================================
  // STATUS
  // ==========================================

  getOrderStatus():
    string {

    const currentOrder =
      this.order as any;


    return (

      currentOrder?.status ||

      this.revampFallback()
        ['order-detail']
        ['status-default']

    );

  }


  // ==========================================
  // PAYMENT METHOD
  // ==========================================

  getPaymentMethod():
    string {

    const currentOrder =
      this.order as any;


    const paymentMethod = (

      currentOrder?.paymentMethod ||

      currentOrder?.payment?.method ||

      currentOrder?.customer
        ?.paymentMethod ||

      ''

    )
      .toString()
      .trim()
      .toLowerCase();


    if (
      paymentMethod === 'cod' ||
      paymentMethod === 'cash' ||
      paymentMethod === 'cash on delivery'
    ) {

      return 'Cash on Delivery';

    }


    if (
      paymentMethod === 'upi'
    ) {

      return 'UPI';

    }


    if (
      paymentMethod === 'card'
    ) {

      return 'Card Payment';

    }


    if (
      paymentMethod === 'credit-card' ||
      paymentMethod === 'credit_card' ||
      paymentMethod === 'credit card'
    ) {

      return 'Credit Card';

    }


    if (
      paymentMethod === 'debit-card' ||
      paymentMethod === 'debit_card' ||
      paymentMethod === 'debit card'
    ) {

      return 'Debit Card';

    }


    if (
      paymentMethod === 'netbanking' ||
      paymentMethod === 'net-banking' ||
      paymentMethod === 'net banking'
    ) {

      return 'Net Banking';

    }


    return this.revampFallback()
      ['order-detail']
      ['payment-not-available'];

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
  // BACK
  // ==========================================

  goBack(): void {

    this.router.navigate([
      '/orders'
    ]);

  }


  // ==========================================
  // DESTROY
  // ==========================================

  ngOnDestroy(): void {

    this.destroy$
      .next();


    this.destroy$
      .complete();

  }

}