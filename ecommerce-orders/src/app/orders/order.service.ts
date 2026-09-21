
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { Order } from './models/order.model';


@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private ordersSubject =
    new BehaviorSubject<Order[]>([]);

  orders$: Observable<Order[]> =
    this.ordersSubject.asObservable();

  constructor() {
    this.loadOrders();
  }

  loadOrders(): void {

    of(localStorage.getItem('shopzone_orders'))
      .pipe(

        map((data: string | null): Order[] => {

          if (!data) {
            return [];
          }

          try {
            return JSON.parse(data) as Order[];
          } catch (error) {

            console.error(
              'Error parsing orders:',
              error
            );

            return [];
          }
        }),

        tap((orders: Order[]) => {
          this.ordersSubject.next(orders);
        }),

        catchError(error => {

          console.error(
            'Error loading orders:',
            error
          );

          this.ordersSubject.next([]);

          return of([]);
        })

      )
      .subscribe();
  }

  // =========================
  // GET ORDERS
  // =========================

  getOrders(): Observable<Order[]> {

    return this.orders$.pipe(

      map((orders: Order[]) => {

        return orders.sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime()
        );

      })

    );
  }

  // =========================
  // ADD ORDER
  // =========================

  addOrder(order: Order): Observable<Order> {

    return of(order).pipe(

      map((newOrder: Order) => {

        const currentOrders =
          this.ordersSubject.value;

        return [
          newOrder,
          ...currentOrders
        ];

      }),

      tap((orders: Order[]) => {

        localStorage.setItem(
          'shopzone_orders',
          JSON.stringify(orders)
        );

        this.ordersSubject.next(orders);

      }),

      map((orders: Order[]) => orders[0]),

      catchError(error => {

        console.error(
          'Error adding order:',
          error
        );

        throw error;
      })

    );
  }

  // =========================
  // GET ORDER BY ID
  // =========================

  getOrderById(id: number): Observable<Order | undefined> {

    return this.orders$.pipe(

      map((orders: Order[]) =>
        orders.find(
          order => order.id === id
        )
      )

    );
  }

  // =========================
  // DELETE ORDER
  // =========================

// =========================
// DELETE ORDER
// =========================

deleteOrder(
  id: number
): Observable<Order[]> {

  return this.orders$
    .pipe(

      // IMPORTANT:
      // Only take current BehaviorSubject value.
      //
      // Without take(1), calling
      // ordersSubject.next() below causes
      // this same observable to execute again.
      take(1),

      map(
        (
          orders: Order[]
        ) => {

          return orders.filter(
            order =>
              order.id !== id
          );

        }
      ),

      tap(
        (
          orders: Order[]
        ) => {

          localStorage.setItem(
            'shopzone_orders',
            JSON.stringify(
              orders
            )
          );


          this.ordersSubject
            .next(
              orders
            );

        }
      )

    );

}

  // =========================
  // CLEAR ORDERS
  // =========================

  clearOrders(): Observable<void> {

    return of(null).pipe(

      tap(() => {

        localStorage.removeItem(
          'shopzone_orders'
        );

        this.ordersSubject.next([]);

      }),

      map(() => undefined)

    );
  }

}
