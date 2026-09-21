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
  USER_FALLBACK
} from '../core/constants/user-fallback.constants';


@Injectable({
  providedIn: 'root'
})
export class UserRevampService {

// https://dummyjson.com/c/d239-eeb0-4b66-88a1

  private readonly revampUrl =
    'https://dummyjson.com/c/d239-eeb0-4b66-88a1';

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

            return this
              .mergeWithFallback(
                response
              );

          }
        ),


        catchError(
          error => {

            console.error(
              'User Revamp API Error:',
              error
            );


            return of(
              USER_FALLBACK
            );

          }
        )

      );

  }

  private mergeWithFallback(
    response: any
  ): any {

    return {

      ...USER_FALLBACK,

      ...response,


      'login': {

        ...USER_FALLBACK[
          'login'
        ],

        ...response?.[
          'login'
        ]

      },


      'profile': {

        ...USER_FALLBACK[
          'profile'
        ],

        ...response?.[
          'profile'
        ]

      }

    };

  }

}