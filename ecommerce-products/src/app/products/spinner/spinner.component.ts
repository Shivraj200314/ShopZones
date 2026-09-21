import {
  Component,
  signal
} from '@angular/core';


import {
  PRODUCT_FALLBACK
} from '../core/constants/product-fallback.constants';
import { LoaderService } from '../loader.service';


@Component({
  selector: 'app-spinner',

  templateUrl: './spinner.component.html',

  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {

  // Loader Observable
  loading$ =
    this.loaderService.loading$;


  // Revamp fallback
  revampFallback =
    signal(PRODUCT_FALLBACK);


  constructor(
    private loaderService: LoaderService
  ) {}

}