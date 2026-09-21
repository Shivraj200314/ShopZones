import {
  Injectable
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShellRevampService {

  // https://dummyjson.com/c/383d-6396-4dce-a071
  private readonly revampUrl =
    'https://dummyjson.com/c/383d-6396-4dce-a071';

  constructor(
    private http:
      HttpClient
  ) { }

  getRevampContent():
    Observable<any> {

    console.log(
      'Shell Revamp API Called'
    );

    return this.http
      .get<any>(
        this.revampUrl
      );

  }

}