import {
  Injectable
} from '@angular/core';

import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  finalize
} from 'rxjs/operators';
import { LoaderService } from '../loader.service';



@Injectable()
export class LoaderInterceptor
  implements HttpInterceptor {


  constructor(
    private loaderService:
      LoaderService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Show spinner before API starts
    this.loaderService.show();
    return next
      .handle(request)
      .pipe(
        finalize(() => {
          // Hide spinner after
          this.loaderService.hide();
        })
      );
  }
}