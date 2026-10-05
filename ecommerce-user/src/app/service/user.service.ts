import {
  Injectable
} from '@angular/core';
export interface User {
  id?: number;
  fullName: string;
  email: string;
  phone?: string;
  role: string;
}@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly tokenKey =
    'access_token';
  private readonly userKey =
    'shopzone_user';
  private readonly profileKey =
    'shopzone_profile';
  login(
    email: string,
    password: string
  ): boolean {
    if (
      !email.trim() ||
      !password.trim()
    ) {
      return false;
    }
    const cleanEmail =
      email
        .trim()
        .toLowerCase();
    const emailName =
      cleanEmail
        .split('@')[0];
    const generatedName =
      emailName
        .charAt(0)
        .toUpperCase() +
      emailName
        .slice(1);
    let savedProfile:
      User | null = null;
    try {
      const profile =
        localStorage.getItem(
          this.profileKey
        );
      if (
        profile
      ) {
        savedProfile =
          JSON.parse(
            profile
          );
      }
    }
    catch (error) {

      console.error(
        'Profile parse error:',
        error
      );
    }
    const sameUser =
      savedProfile?.email
        ?.toLowerCase() ===
      cleanEmail;
    const user:
      User = {
      id:
        sameUser
          ? savedProfile?.id
          : 1,
      fullName:
        sameUser &&
          savedProfile?.fullName
          ? savedProfile.fullName
          : generatedName,
      email:
        cleanEmail,
      phone:
        sameUser
          ? savedProfile?.phone || ''
          : '',
      role:
        sameUser &&
          savedProfile?.role
          ? savedProfile.role
          : 'CUSTOMER'
    };
    localStorage.setItem(
      this.tokenKey,
      'shopzone-demo-token'
    );
    localStorage.setItem(
      this.userKey,
      JSON.stringify(
        user
      )
    );
    localStorage.setItem(
      this.profileKey,
      JSON.stringify(
        user
      )
    );
    this.notifyUserChanged();
    return true;
  }
  getUser():
    User | null {
    try {
      const savedUser =
        localStorage.getItem(
          this.userKey
        );
      if (!savedUser) {
        return null;
      }
      return JSON.parse(
        savedUser
      );
    }
    catch (error) {
      console.error(
        'User parse error:',
        error
      );
      return null;
    }
  }
  isLoggedIn(): boolean {
    return !!localStorage
      .getItem(
        this.tokenKey
      );
  }
  updateUser(
    user: User
  ): void {
    localStorage.setItem(
      'shopzone_user',
      JSON.stringify(
        user
      )
    );
    localStorage.setItem(
      'shopzone_profile',
      JSON.stringify(
        user
      )
    );
    window.dispatchEvent(
      new CustomEvent(
        'shopzone-user-updated'
      )
    );
  }
  logout(): void {
    localStorage.removeItem(
      'access_token'
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
  private notifyUserChanged(): void {
    window.dispatchEvent(
      new CustomEvent(
        'shopzone-user-updated'
      )
    );
  }
}