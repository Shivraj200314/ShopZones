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
import { LOGIN_FALLBACK } from '../core/constants/login-fallback.constants';

@Injectable({
  providedIn: 'root'
})
export class LoginRevampService {

  // https://dummyjson.com/c/5cbc-9038-457a-a6ae
  
  private readonly revampUrl =
    'https://dummyjson.com/c/5cbc-9038-457a-a6ae';

  getRevampContent():
    Observable<any> {

    return defer(
      () => {

        return fetch(
          this.revampUrl
        )
          .then(
            response => {

              if (
                !response.ok
              ) {

                throw new Error(
                  `User API failed: ${response.status}`
                );

              }


              return response.json();

            }
          );

      }
    )
      .pipe(

        map(
          response => {

            console.log(
              'User API Response:',
              response
            );


            return this
              .mergeWithFallback(
                response
              );

          }
        ),


        catchError(
          error => {

            console.error(
              'Login Revamp API Error:',
              error
            );


            return of(
              LOGIN_FALLBACK
            );

          }
        )

      );
  }
  private mergeWithFallback(
    response: any
  ): any {

    return {

      ...LOGIN_FALLBACK,

      ...response,


      'login': {

        ...LOGIN_FALLBACK[
          'login'
        ],

        ...response?.[
          'login'
        ]

      }

    };

  }

}