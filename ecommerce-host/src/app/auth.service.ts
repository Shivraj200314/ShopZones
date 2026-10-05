import {
  Injectable
} from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // ==========================================
  // LOCAL STORAGE KEYS
  // ==========================================

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
    password: string,
    role: string = 'CUSTOMER'
  ): boolean {

    const cleanEmail =
      email
        .trim()
        .toLowerCase();


    const cleanPassword =
      password
        .trim();


    const cleanRole =
      role
        .trim()
        .toUpperCase();


    // ========================================
    // VALIDATION
    // ========================================

    if (
      !cleanEmail ||
      !cleanPassword ||
      !['CUSTOMER', 'SELLER', 'OWNER']
        .includes(cleanRole)
    ) {

      return false;

    }


    // ========================================
    // GET EXISTING PROFILE
    // ========================================

    const profileData =
      localStorage.getItem(
        this.profileKey
      );


    let profile: any = null;


    if (
      profileData
    ) {

      try {

        profile =
          JSON.parse(
            profileData
          );

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


    let user: any;


    // ========================================
    // EXISTING USER
    // ========================================

    if (
      profile &&
      String(profile.email || '')
        .trim()
        .toLowerCase() === cleanEmail
    ) {

      // ====================================
      // KEEP PROFILE DETAILS AND APPLY
      // THE SELECTED DEMO ROLE
      // ====================================

      user = {

        ...profile,

        email:
          cleanEmail,

        role:
          cleanRole

      };

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

        // ------------------------------------
        // DEFAULT ROLE
        // ------------------------------------

        role:
          cleanRole

      };


    }


    localStorage.setItem(

      this.profileKey,

      JSON.stringify(
        user
      )

    );


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
    // UPDATE NAVBAR / OTHER MFEs
    // ========================================

    window.dispatchEvent(

      new CustomEvent(
        'shopzone-user-updated'
      )

    );


    return true;

  }


  // ==========================================
  // GET CURRENT USER
  // ==========================================

  getCurrentUser(): any {

    const userData =
      localStorage.getItem(
        this.userKey
      );


    // ----------------------------------------
    // NO USER
    // ----------------------------------------

    if (!userData) {

      return null;

    }


    try {

      return JSON.parse(
        userData
      );

    }

    catch (
      error
    ) {

      console.error(
        'User parse error:',
        error
      );


      return null;

    }

  }


  // ==========================================
  // GET USER ROLE
  // ==========================================

  getUserRole(): string | null {

    const user =
      this.getCurrentUser();


    if (
      !user?.role
    ) {

      return null;

    }


    return String(
      user.role
    )
      .trim()
      .toUpperCase();

  }


  // ==========================================
  // CHECK ROLE
  // ==========================================

  hasRole(
    role: string
  ): boolean {

    const currentRole =
      this.getUserRole();


    if (
      !currentRole ||
      !role
    ) {

      return false;

    }


    return currentRole ===
      role
        .trim()
        .toUpperCase();

  }


  // ==========================================
  // CUSTOMER
  // ==========================================

  isCustomer(): boolean {

    return this.hasRole(
      'CUSTOMER'
    );

  }


  // ==========================================
  // SELLER
  // ==========================================

  isSeller(): boolean {

    return this.hasRole(
      'SELLER'
    );

  }


  // ==========================================
  // OWNER
  // ==========================================

  isOwner(): boolean {

    return this.hasRole(
      'OWNER'
    );

  }


  // ==========================================
  // CAN ADD PRODUCT
  // SELLER + OWNER
  // ==========================================

  canAddProduct(): boolean {

    return (
      this.isSeller() ||
      this.isOwner()
    );

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
// UPDATE USER PROFILE
// ==========================================

updateUserProfile(
  updatedUser: any
): void {

  // ========================================
  // NORMALIZE ROLE
  // ========================================

  const user = {

    ...updatedUser,

    role:
      updatedUser?.role
        ?.trim()
        .toUpperCase()

  };


  // ========================================
  // UPDATE PROFILE
  // ========================================

  localStorage.setItem(

    this.profileKey,

    JSON.stringify(
      user
    )

  );


  // ========================================
  // UPDATE CURRENT SESSION USER
  // ========================================

  localStorage.setItem(

    this.userKey,

    JSON.stringify(
      user
    )

  );


  // ========================================
  // NOTIFY OTHER COMPONENTS / MFEs
  // ========================================

  window.dispatchEvent(

    new CustomEvent(
      'shopzone-user-updated'
    )

  );

}

  logout(): void {

    // ----------------------------------------
    // REMOVE SESSION TOKEN
    // ----------------------------------------

    localStorage.removeItem(
      this.tokenKey
    );


    // ----------------------------------------
    // REMOVE LOGGED-IN USER
    // ----------------------------------------

    localStorage.removeItem(
      this.userKey
    );


    // ----------------------------------------
    // PROFILE IS NOT REMOVED
    // ----------------------------------------
    // This means the user's saved role,
    // name, email etc. remain available
    // for the next login.

    // ========================================
    // UPDATE NAVBAR / OTHER MFEs
    // ========================================

    window.dispatchEvent(

      new CustomEvent(
        'shopzone-user-updated'
      )

    );

  }

}