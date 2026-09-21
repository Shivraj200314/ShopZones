import {
  Injectable
} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private readonly tokenKey =
    'access_token';


  private readonly userKey =
    'shopzone_user';


  private readonly profileKey =
    'shopzone_profile';


  // ==========================================
  // LOGIN
  // ==========================================

  login(
    email: string,
    password: string
  ): boolean {

    const cleanEmail =
      email
        .trim()
        .toLowerCase();


    const cleanPassword =
      password
        .trim();


    if (
      !cleanEmail ||
      !cleanPassword
    ) {

      return false;

    }


    // ========================================
    // GET SAVED PROFILE
    // ========================================

    const profileData =
      localStorage.getItem(
        this.profileKey
      );


    let user: any;


    // ========================================
    // EXISTING USER
    // ========================================

    if (
      profileData
    ) {

      try {

        const profile =
          JSON.parse(
            profileData
          );


        // ====================================
        // EMAIL MUST MATCH UPDATED EMAIL
        // ====================================

        if (
          profile.email
            ?.toLowerCase() !==
          cleanEmail
        ) {

          return false;

        }


        user = {

          ...profile,

          email:
            cleanEmail

        };

      }

      catch (
        error
      ) {

        console.error(
          'Profile parse error:',
          error
        );


        return false;

      }

    }


    // ========================================
    // FIRST LOGIN
    // ========================================

    else {

      const username =
        cleanEmail
          .split('@')[0];


      const fullName =

        username
          .charAt(0)
          .toUpperCase()

        +

        username
          .slice(1);

      user = {

        id:
          1,

        fullName:
          fullName,

        email:
          cleanEmail,

        phone:
          '',

        role:
          'CUSTOMER'

      };


      localStorage.setItem(

        this.profileKey,

        JSON.stringify(
          user
        )

      );

    }


    // ========================================
    // CREATE SESSION
    // ========================================

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


    // ========================================
    // UPDATE NAVBAR
    // ========================================

    window.dispatchEvent(

      new CustomEvent(
        'shopzone-user-updated'
      )

    );


    return true;

  }


  // ==========================================
  // LOGGED IN
  // ==========================================

  isLoggedIn(): boolean {

    return !!localStorage
      .getItem(
        this.tokenKey
      );

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  logout(): void {

    localStorage.removeItem(
      this.tokenKey
    );


    localStorage.removeItem(
      this.userKey
    );


    window.dispatchEvent(

      new CustomEvent(
        'shopzone-user-updated'
      )

    );

  }

}