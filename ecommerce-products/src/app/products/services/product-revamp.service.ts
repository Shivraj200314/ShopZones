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
    'https://dummyjson.com/c/49b5-905a-4627-8869';
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