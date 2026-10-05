import {Injectable} from '@angular/core';

import {HttpClient} from '@angular/common/http';

import {Observable,catchError,map, of} from 'rxjs';

import {CHECKOUT_FALLBACK} from '../checkout/core/constants/checkout-fallback.constants';

@Injectable()
export class CheckoutRevampService {

  private readonly apiUrl =
    'http://localhost:4203/assets/em/checkout-content.json';

  constructor(
    private http: HttpClient
  ) {}

  getRevampContent():
    Observable<any> {

    return this.http
      .get<any>(
        this.apiUrl
      )
      .pipe(

        map(
          (response: any) => {

            const apiContent: any = {};

            const fallback: any =
              CHECKOUT_FALLBACK;

            response?.content?.forEach(
              (screen: any) => {

                screen?.screenContent?.forEach(
                  (item: any) => {

                    if (!item?.key) {

                      return;

                    }

                    apiContent[item.key] = {

                      ...(
                        fallback[item.key] ||
                        {}
                      ),

                      ...item

                    };

                  }
                );

              }
            );

            return {

              ...fallback,

              ...apiContent

            };

          }
        ),

        catchError(
          (error: any) => {

            console.error(
              'Checkout Revamp API failed. Using fallback:',
              error
            );

            return of(
              CHECKOUT_FALLBACK
            );

          }
        )

      );

  }

}