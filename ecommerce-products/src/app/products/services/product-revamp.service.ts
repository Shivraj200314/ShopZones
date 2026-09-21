import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';


@Injectable()
export class ProductRevampService {

  private readonly apiUrl =
    'https://dummyjson.com/c/8ae3-0be2-4473-8a0c';


  constructor(
    private http:
      HttpClient
  ) { }


  getRevampContent():
    Observable<any> {

    return this.http.get<any>(
      this.apiUrl
    );

  }

}