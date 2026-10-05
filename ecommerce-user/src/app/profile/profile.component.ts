import {
  Component,
  OnDestroy,
  OnInit,
  signal
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {
  Router
} from '@angular/router';
import {
  Subject,
  takeUntil
} from 'rxjs';
import {
  User,
  UserService
} from '../service/user.service';
import {
  UserRevampService
} from '../service/user-revamp.service';
import {
  USER_FALLBACK
} from '../core/constants/user-fallback.constants';
import {
  Location
} from '@angular/common';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: [
    './profile.component.css',
    './profile-theme.component.css'
  ]
})
export class ProfileComponent
  implements OnInit, OnDestroy {
  revampFallback =
    signal<any>(
      USER_FALLBACK
    );
  user:
    User | null = null;
  profileForm!:
    FormGroup;
  isEditMode =
    false;
  isSaving =
    false;
  readonly roleOptions = [
    'CUSTOMER',
    'SELLER',
    'OWNER'
  ];
  successMessage =
    '';
  errorMessage =
    '';
  private destroy$ =
    new Subject<void>();
  constructor(
    private fb:
      FormBuilder,
    private userService:
      UserService,
    private userRevampService:
      UserRevampService,
    private router:
      Router,
        private location:
    Location
  ) {}
  ngOnInit(): void {
    this.loadRevampContent();
    const userLoaded =
      this.loadUser();
    if (
      !userLoaded
    ) {
      return;
    }
this.createForm();
  }
goBack(): void {
  this.location.back();
}
  loadRevampContent(): void {
    this.userRevampService
      .getRevampContent()
      .pipe(
        takeUntil(
          this.destroy$
        )
      )
      .subscribe({
        next: (
          response: any
        ) => {
          this.revampFallback
            .set(
              response
            );
        },
        error: (
          error
        ) => {
          console.error(
            'Profile revamp error:',
            error
          );
          this.revampFallback
            .set(
              USER_FALLBACK
            );
        }
      });
    }
  loadUser(): boolean {
    this.user =
      this.userService
        .getUser();
    if (
      !this.user
    ) {
      this.router.navigate([
        '/login'
      ]);
      return false;
    }
    return true;
  }
  createForm(): void {
    this.profileForm =
      this.fb.group({
        fullName: [
          this.user?.fullName || '',
          [
            Validators.required,
            this.noWhitespaceValidator(),
            Validators.minLength(
              3
            ),
            Validators.maxLength(
              50
            ),
            Validators.pattern(
              /^[A-Za-z][A-Za-z .'-]*$/
            )
          ]
        ],
        email: [
          this.user?.email || '',
          [
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com|in|org|net|edu|gov|co\.in)$/
            )
          ]
        ],
        phone: [
          this.user?.phone || '',
          [
            Validators.pattern(
              /^[6-9][0-9]{9}$/
            )
          ]
        ],
        role: [
          this.user?.role || 'CUSTOMER',
          Validators.required
        ]
      });
    this.profileForm
      .disable();

  }


  // ==========================================
  // FORM CONTROLS
  // ==========================================

  get f() {

    return this.profileForm
      .controls;

  }


  // ==========================================
  // USER INITIAL
  // ==========================================

  get userInitial():
    string {

    if (
      !this.user?.fullName
    ) {

      return 'U';

    }


    return this.user
      .fullName
      .charAt(0)
      .toUpperCase();

  }


  // ==========================================
  // EDIT PROFILE
  // ==========================================

editProfile(): void {

  this.successMessage = '';

  this.errorMessage = '';

  this.isEditMode = true;

  this.profileForm.enable();

}


  // ==========================================
  // CANCEL EDIT
  // ==========================================

 cancelEdit(): void {

  this.successMessage = '';

  this.errorMessage = '';

  this.isEditMode = false;


  this.profileForm.reset({

    fullName:
      this.user?.fullName || '',

    email:
      this.user?.email || '',

    phone:
      this.user?.phone || '',

    role:
      this.user?.role || 'CUSTOMER'

  });


  this.profileForm.disable();

}


  // ==========================================
  // SAVE PROFILE
  // ==========================================

  saveProfile(): void {

    this.successMessage =
      '';


    this.errorMessage =
      '';


    // ========================================
    // TOUCH ALL FIELDS
    // ========================================

    this.profileForm
      .markAllAsTouched();


    // ========================================
    // INVALID FORM
    // ========================================

    if (
      this.profileForm.invalid
    ) {

      this.errorMessage =
        'Please correct the highlighted fields.';


      return;

    }


    if (
      !this.user
    ) {

      this.errorMessage =
        'User information is not available.';


      return;

    }


    this.isSaving =
      true;


    // ========================================
    // OLD VALUES
    // ========================================

    const oldEmail =
      this.user.email
        ?.trim()
        .toLowerCase() ||
      '';


    // ========================================
    // FORM VALUES
    // ========================================

    const value =
      this.profileForm
        .getRawValue();


    const fullName =
      value.fullName
        .trim();


    const newEmail =
      value.email
        .trim()
        .toLowerCase();


    const phone =
      value.phone
        ?.trim() ||
      '';

    const role =
      value.role ||
      'CUSTOMER';


    // ========================================
    // CHECK CHANGES
    // ========================================

    const nameChanged =
      this.user.fullName
        .trim() !==
      fullName;


    const emailChanged =
      oldEmail !==
      newEmail;


    const phoneChanged =
      (
        this.user.phone || ''
      ).trim() !==
      phone;

    const roleChanged =
      this.user.role !==
      role;


    // ========================================
    // NO CHANGES
    // ========================================

    if (
      !nameChanged &&
      !emailChanged &&
      !phoneChanged &&
      !roleChanged
    ) {

      this.isSaving =
        false;


      this.isEditMode =
        false;


      this.profileForm
        .disable();


      this.successMessage =
        'No changes to save.';


      return;

    }


    // ========================================
    // CREATE UPDATED USER
    // ========================================

    const updatedUser:
      User = {

        id:
          this.user.id,

        fullName:
          fullName,

        email:
          newEmail,

        phone:
          phone,

        role:
          role

      };


    // ========================================
    // UPDATE USER
    // ========================================

    this.userService
      .updateUser(
        updatedUser
      );


    // Update local component value
    this.user =
      updatedUser;


    // ========================================
    // EMAIL CHANGED
    // ========================================

    if (
      emailChanged
    ) {

      this.handleEmailChange(
        newEmail
      );


      return;

    }


    // ========================================
    // NORMAL SAVE
    // ========================================

    this.profileForm
      .reset({

        fullName:
          updatedUser.fullName,

        email:
          updatedUser.email,

        phone:
          updatedUser.phone ||
          '',

        role:
          updatedUser.role

      });


    this.profileForm
      .disable();


    this.isEditMode =
      false;


    this.isSaving =
      false;


    this.successMessage =

      this.revampFallback()
        ?.['profile']
        ?.['success-message']

      ||

      'Profile updated successfully.';

  }


  // ==========================================
  // HANDLE EMAIL CHANGE
  // ==========================================

  private handleEmailChange(
    newEmail: string
  ): void {

    // ========================================
    // KEEP NEW EMAIL FOR LOGIN FORM
    // ========================================

    localStorage.setItem(
      'shopzone_login_email',
      newEmail
    );


    // ========================================
    // REMOVE OLD SESSION
    // ========================================

    localStorage.removeItem(
      'access_token'
    );


    localStorage.removeItem(
      'shopzone_user'
    );


    // IMPORTANT:
    // shopzone_profile is NOT removed.
    //
    // UserService.updateUser()
    // already saved the latest profile there.


    // ========================================
    // INFORM HOST NAVBAR
    // ========================================

    window.dispatchEvent(

      new CustomEvent(
        'shopzone-user-updated'
      )

    );


    this.isSaving =
      false;

    this.router.navigate(
      [
        '/login'
      ],
      {

        queryParams: {

          emailChanged:
            'true'

        }

      }
    );

  }

  logout(): void {

    this.successMessage =
      '';


    this.errorMessage =
      '';


    this.userService
      .logout();


    this.router.navigate([
      '/login'
    ]);

  }

  private noWhitespaceValidator():
    ValidatorFn {

    return (
      control:
        AbstractControl
    ): ValidationErrors | null => {

      const value =
        control.value;

      if (
        typeof value !==
        'string'
      ) {

        return null;

      }


      if (
        value.trim().length ===
        0
      ) {

        return {

          whitespace:
            true

        };

      }


      return null;

    };

  }

  getFullNameError():
    string {

    const control =
      this.f['fullName'];


    if (
      !control ||
      !control.touched ||
      !control.errors
    ) {

      return '';

    }


    if (
      control.hasError(
        'required'
      )
    ) {

      return 'Full name is required.';

    }


    if (
      control.hasError(
        'whitespace'
      )
    ) {

      return 'Full name cannot contain only spaces.';

    }


    if (
      control.hasError(
        'minlength'
      )
    ) {

      return 'Full name must contain at least 3 characters.';

    }


    if (
      control.hasError(
        'maxlength'
      )
    ) {

      return 'Full name cannot exceed 50 characters.';

    }


    if (
      control.hasError(
        'pattern'
      )
    ) {

      return 'Full name can contain letters, spaces, apostrophes and hyphens only.';

    }


    return '';

  }

  getEmailError():
    string {

    const control =
      this.f['email'];


    if (
      !control ||
      !control.touched ||
      !control.errors
    ) {

      return '';

    }


    if (
      control.hasError(
        'required'
      )
    ) {

      return 'Email address is required.';

    }


    if (
      control.hasError(
        'pattern'
      )
    ) {

      return 'Enter a valid email address, for example user@gmail.com.';

    }


    return '';

  }

  getPhoneError():
    string {

    const control =
      this.f['phone'];


    if (
      !control ||
      !control.touched ||
      !control.errors
    ) {

      return '';

    }


    if (
      control.hasError(
        'pattern'
      )
    ) {

      return 'Enter a valid 10 digit Indian mobile number.';

    }


    return '';

  }

  isInvalid(
    controlName: string
  ): boolean {

    const control =
      this.profileForm
        ?.get(
          controlName
        );


    return !!(
      control &&
      control.invalid &&
      control.touched
    );

  }

  isValid(
    controlName: string
  ): boolean {

    const control =
      this.profileForm
        ?.get(
          controlName
        );


    return !!(
      control &&
      control.valid &&
      control.touched &&
      this.isEditMode
    );

  }

  ngOnDestroy(): void {

    this.destroy$
      .next();


    this.destroy$
      .complete();

  }

}