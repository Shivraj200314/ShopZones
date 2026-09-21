import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  name = '';
  email = '';
  password = '';
  confirmPassword = '';

  isLoading = false;

  constructor(
    private router: Router
  ) { }

  signup(): void {

    if (
      !this.name ||
      !this.email ||
      !this.password ||
      !this.confirmPassword
    ) {
      alert('Please fill all fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    this.isLoading = true;

    // Simulate signup API
    setTimeout(() => {

      this.isLoading = false;

      alert('Account created successfully!');

      // Go to login page
      this.router.navigate(['/login']);

    }, 1500);

  }
}
