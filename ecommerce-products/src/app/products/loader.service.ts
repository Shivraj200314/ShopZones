import {
  Injectable
} from '@angular/core';

import {
  BehaviorSubject
} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoaderService {

  // =========================
  // LOADER STATE
  // =========================

  private loadingSubject =
    new BehaviorSubject<boolean>(false);


  loading$ =
    this.loadingSubject.asObservable();


  // =========================
  // REQUEST COUNTER
  // =========================

  private requestCount = 0;


  // =========================
  // SHOW LOADER
  // =========================

  show(): void {

    this.requestCount++;

    this.loadingSubject.next(true);

  }


  // =========================
  // HIDE LOADER
  // =========================

  hide(): void {

    if (this.requestCount > 0) {

      this.requestCount--;

    }


    if (this.requestCount === 0) {

      this.loadingSubject.next(false);

    }

  }

}