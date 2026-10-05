import {
  Injectable
} from '@angular/core';

import {
  Observable,
  catchError,
  defer,
  map,
  of
} from 'rxjs';

import {
  ORDER_FALLBACK
} from '../core/constants/order-fallback.constants';

import {
  mergeData
} from 'src/app/units/merge';


@Injectable({
  providedIn: 'root'
})
export class OrdersRevampService {

// https://dummyjson.com/c/19c6-da96-4b0d-87a1

  private readonly revampUrl =
    'https://dummyjson.com/c/19c6-da96-4b0d-87a1';

  getRevampContent():
    Observable<any> {

    return defer(
      async () => {

        const response =
          await fetch(
            this.revampUrl
          );

        console.log(
          'Orders Revamp HTTP Status:',
          response.status
        );

        if (
          !response.ok
        ) {

          throw new Error(
            `Orders API failed: ${response.status}`
          );

        }

        const responseText =
          await response.text();


        console.log(
          'Orders Raw API Response:',
          responseText
        );


        // =====================================
        // EMPTY RESPONSE
        // USE FALLBACK
        // =====================================

        if (
          !responseText ||
          responseText.trim() === ''
        ) {

          console.warn(
            'Orders API returned empty response'
          );


          return ORDER_FALLBACK;

        }


        // =====================================
        // CONVERT TEXT TO JSON
        // =====================================

        try {

          return JSON.parse(
            responseText
          );

        }

        catch (
          error
        ) {

          console.error(
            'Orders API returned invalid JSON:',
            responseText
          );


          throw error;

        }

      }
    )
      .pipe(


        // =====================================
        // MERGE API + CONSTANT
        // =====================================

        map(
          (
            apiData: any
          ) => {


            const finalData =
              mergeData(
                ORDER_FALLBACK,
                apiData
              );


            console.log(
              'Orders Final Merged Data:',
              finalData
            );


            return finalData;

          }
        ),


        // =====================================
        // API FAILS
        // =====================================

        catchError(
          (
            error: any
          ) => {


            console.error(
              'Orders revamp content failed:',
              error
            );


            return of(
              ORDER_FALLBACK
            );

          }
        )

      );

  }

}