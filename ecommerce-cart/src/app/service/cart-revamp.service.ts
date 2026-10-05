import {
  Injectable
} from '@angular/core';

import {
  HttpBackend,
  HttpClient
} from '@angular/common/http';

import {
  Observable,
  catchError,
  map,
  of
} from 'rxjs';

import {
  CART_FALLBACK
} from '../cart/core/constants/cart-fallback.constants';


@Injectable({
  providedIn: 'root'
})
export class CartRevampService {

  private http:
    HttpClient;
    
// https://dummyjson.com/c/374f-f022-4cb0-bd88
  private readonly apiUrl =
    'https://dummyjson.com/c/374f-f022-4cb0-bd88';

  constructor(
    httpBackend:
      HttpBackend
  ) {

    this.http =
      new HttpClient(
        httpBackend
      );

  }

  getRevampContent():
    Observable<any> {

    return this.http
      .get<any>(
        this.apiUrl
      )
      .pipe(

        map(response => {

          console.log(
            'Cart Revamp API Response:',
            response
          );

          const mergedResponse = {

            ...CART_FALLBACK,

            ...response,

            cart: {
              ...CART_FALLBACK.cart,
              ...(response?.cart || {})

            }

          };

          console.log(
            'Cart Revamp Merged Response:',
            mergedResponse
          );

          return mergedResponse;

        }),

        catchError(error => {
          console.error(
            'Cart Revamp API Failed. Using CART_FALLBACK:',
            error
          );

          return of(
            CART_FALLBACK
          );

        })

      );

  }

}