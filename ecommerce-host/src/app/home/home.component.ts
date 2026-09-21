import {
  Component,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  Subject,
  takeUntil
} from 'rxjs';
import { SHELL_FALLBACK } from '../core/constants/shell-fallback.constants';
import { ShellRevampService } from '../services/shell-revamp.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent
  implements OnInit, OnDestroy {


  // ==========================================
  // REVAMP FALLBACK
  // ==========================================

  revampFallback =
    signal<any>(
      SHELL_FALLBACK
    );


  // ==========================================
  // DESTROY SUBJECT
  // ==========================================

  private destroy$ =
    new Subject<void>();


  // ==========================================
  // CONSTRUCTOR
  // ==========================================

  constructor(

    private router:
      Router,

    private shellRevampService:
      ShellRevampService,
      

  ) {}


  // ==========================================
  // INIT
  // ==========================================

  ngOnInit(): void {
    this.loadRevampContent();

  }
// ==========================================
// BACK
// ==========================================


  // ==========================================
  // LOAD REVAMP
  // ==========================================

  loadRevampContent(): void {

    this.shellRevampService
      .getRevampContent()

      .pipe(

        takeUntil(
          this.destroy$
        )

      )

      .subscribe({

        // ======================================
        // SUCCESS
        // ======================================

        next: (
          content
        ) => {

          console.log(
            'Shell revamp content:',
            content
          );


          this.revampFallback
            .set(
              content
            );

        },


        // ======================================
        // ERROR
        // ======================================

        error: (
          error
        ) => {

          console.error(
            'Shell revamp content error:',
            error
          );


          this.revampFallback
            .set(
              SHELL_FALLBACK
            );

        }

      });

  }


  // ==========================================
  // ALL PRODUCTS
  // ==========================================

  goToProducts(): void {

    this.router.navigate([

      '/products'

    ]);

  }


  // ==========================================
  // CATEGORY
  // ==========================================

  goToCategory(
    category: string
  ): void {

    this.router.navigate(

      [
        '/products'
      ],

      {

        queryParams: {

          category:
            category

        }

      }

    );

  }


  // ==========================================
  // CART
  // ==========================================

  goToCart(): void {

    this.router.navigate([

      '/cart'

    ]);

  }


  // ==========================================
  // ORDERS
  // ==========================================

  goToOrders(): void {

    this.router.navigate([

      '/orders'

    ]);

  }


  // ==========================================
  // DESTROY
  // ==========================================

  ngOnDestroy(): void {

    this.destroy$
      .next();


    this.destroy$
      .complete();

  }

}