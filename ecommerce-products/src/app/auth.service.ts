import {
  Injectable
} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly tokenKey =
    'access_token';

  isLoggedIn(): boolean {

    return !!localStorage.getItem(
      this.tokenKey
    );

  }

  getCurrentUser(): any {

    const userData =
      localStorage.getItem(
        'shopzone_user'
      );

    if (!userData) {

      return null;

    }

    try {

      return JSON.parse(
        userData
      );

    }

    catch (error) {

      console.error(
        'User data parse error:',
        error
      );

      return null;

    }

  }

  getUserRole(): string {

    const user =
      this.getCurrentUser();

    return (
      user?.role
        ?.trim()
        .toUpperCase()
      || ''
    );

  }

  isCustomer(): boolean {

    return (
      this.getUserRole()
      === 'CUSTOMER'
    );

  }

  isSeller(): boolean {

    return (
      this.getUserRole()
      === 'SELLER'
    );

  }

  isOwner(): boolean {

    return (
      this.getUserRole()
      === 'OWNER'
    );

  }

  logout(): void {

    localStorage.removeItem(
      this.tokenKey
    );

    localStorage.removeItem(
      'shopzone_user'
    );

    window.dispatchEvent(
      new CustomEvent(
        'shopzone-user-updated'
      )
    );

  }

}