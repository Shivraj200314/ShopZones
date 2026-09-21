import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  mobileMenuOpen = false;

  cartCount = 0;

  toggleMobileMenu(): void {

    this.mobileMenuOpen =
      !this.mobileMenuOpen;

  }

  closeMobileMenu(): void {

    this.mobileMenuOpen = false;

  }

}