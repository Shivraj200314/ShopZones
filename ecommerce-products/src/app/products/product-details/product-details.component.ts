import {
  Component,
  HostListener,
  OnInit,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  Location
} from '@angular/common';
import {
  Product
} from '../product';
import {
  ProductService
} from '../product.service';
import {
  PRODUCT_FALLBACK
} from '../core/constants/product-fallback.constants';
import { AuthService } from 'src/app/auth.service';
@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent
  implements OnInit {
  revampFallback =
    signal<any>(
      PRODUCT_FALLBACK
    );
  product!: Product;
  productId!: number;
  quantity: number = 1;
  cartCount: number = 0;
  isLoading: boolean = false;
  errorMessage: string = '';

  @HostListener(
    'window:shopzone-inventory-updated'
  )
  onInventoryUpdated(): void {

    this.getProduct();

  }

  @HostListener(
    'window:storage',
    ['$event']
  )
  onStorageChange(
    event: StorageEvent
  ): void {

    if (
      event.key === 'shopzone_inventory_stock'
    ) {

      this.getProduct();

    }

  }

  get canShop(): boolean {

    const role =
      this.authService.getUserRole();

    return role === 'CUSTOMER' ||
      role === 'OWNER';

  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private productService: ProductService,
  private authService: AuthService
 ) {}
  ngOnInit(): void {
    this.productId =
      Number(
        this.route
          .snapshot
          .paramMap
          .get('id')
      );
    this.getProduct();
    this.updateCartCount();
  }
  getProduct(): void {
    this.isLoading = true;
    this.errorMessage = '';
    this.productService
      .getProductById(
        this.productId
      )
      .subscribe({
        next: (
          product: Product
        ) => {
          this.product =
            product;
          console.log(
            'Product Details:',
            product
          );
          this.isLoading =
            false;
        },
        error: (error) => {
          console.error(
            'Product Details API Error:',
            error
          );
          this.errorMessage =
            'Unable to load product details.';
          this.isLoading =
            false;
        }
      });
  }
  increaseQuantity(): void {
    if (!this.product) {
      return;
    }
    if (
      this.quantity <
      this.product.stock
    ) {
      this.quantity++;
    }
  }
  decreaseQuantity(): void {
    if (
      this.quantity > 1
    ) {
      this.quantity--;
    }
  }
  getTotalPrice(): number {
    if (!this.product) {
      return 0;
    }
    return (
      this.product.price *
      this.quantity
    );
  }
 addToCart(): void {

  if (
    !this.authService.isLoggedIn()
  ) {

    this.router.navigate(
      ['/login'],
      {
        queryParams: {
          returnUrl:
            this.router.url
        }
      }
    );

    return;

  }


  if (
    !this.canShop
  ) {

    return;

  }

  this.productService.addToCart(
    this.product,
    this.quantity
  );

}
  updateCartCount(): void {
    this.cartCount =
      this.productService
        .getCartCount();
  }
buyNow(): void {

  if (!this.authService.isLoggedIn()) {

    this.router.navigate(
      ['/login'],
      {
        queryParams: {
          returnUrl: '/checkout'
        }
      }
    );

    return;
  }


  // ==========================================
  // 2. CHECK WHETHER USER CAN SHOP
  // ==========================================

  if (!this.canShop) {
    return;
  }


  // ==========================================
  // 3. VALIDATE PRODUCT
  // ==========================================

  if (!this.product) {
    console.error('Product not available');
    return;
  }


  // ==========================================
  // 4. ADD PRODUCT TO CART
  // ==========================================

  this.productService.addToCart(
    this.product,
    this.quantity
  );


  // ==========================================
  // 5. NAVIGATE TO ORDER FORM
  // ==========================================

  this.router.navigate(['/checkout']);
}
  goBack(): void {
    this.location.back();
  }
}