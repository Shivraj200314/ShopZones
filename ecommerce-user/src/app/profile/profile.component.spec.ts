import {
  of
} from 'rxjs';

import {
  ProfileComponent
} from './profile.component';

import {
  USER_FALLBACK
} from '../users/core/constants/user-fallback.constants';


describe(
  'ProfileComponent',
  () => {

    let component:
      ProfileComponent;

    let userRevampServiceMock: {
      getRevampContent: jest.Mock;
    };

    let consoleErrorSpy:
      jest.SpyInstance;


    // =========================================
    // BEFORE EACH
    // =========================================

    beforeEach(
      () => {

        localStorage.clear();


        userRevampServiceMock = {

          getRevampContent:
            jest.fn()
              .mockReturnValue(
                of(
                  USER_FALLBACK
                )
              )

        };


        consoleErrorSpy =
          jest
            .spyOn(
              console,
              'error'
            )
            .mockImplementation();


        component =
          new ProfileComponent(
            userRevampServiceMock as any
          );

      }
    );


    // =========================================
    // AFTER EACH
    // =========================================

    afterEach(
      () => {

        localStorage.clear();

        jest.restoreAllMocks();

      }
    );


    // =========================================
    // CREATE
    // =========================================

    it(
      'should create',
      () => {

        expect(
          component
        ).toBeTruthy();

      }
    );


    // =========================================
    // DEFAULT FALLBACK
    // =========================================

    it(
      'should initialize revampFallback with USER_FALLBACK',
      () => {

        expect(
          component.revampFallback()
        ).toEqual(
          USER_FALLBACK
        );

      }
    );


    // =========================================
    // INITIAL USER
    // =========================================

    it(
      'should initialize user with empty values',
      () => {

        expect(
          component.user
        ).toEqual({

          name:
            '',

          email:
            '',

          phone:
            ''

        });

      }
    );


    // =========================================
    // NG ON INIT
    // =========================================

    it(
      'should call loadRevampContent and loadUser on ngOnInit',
      () => {

        const revampSpy =
          jest
            .spyOn(
              component,
              'loadRevampContent'
            )
            .mockImplementation();


        const loadUserSpy =
          jest
            .spyOn(
              component,
              'loadUser'
            )
            .mockImplementation();


        component.ngOnInit();


        expect(
          revampSpy
        ).toHaveBeenCalledTimes(
          1
        );


        expect(
          loadUserSpy
        ).toHaveBeenCalledTimes(
          1
        );

      }
    );


    // =========================================
    // REVAMP CONTENT
    // =========================================

    it(
      'should load revamp content',
      () => {

        const apiResponse = {

          profile: {

            title:
              'Profile From API'

          }

        };


        userRevampServiceMock
          .getRevampContent
          .mockReturnValue(
            of(
              apiResponse
            )
          );


        component
          .loadRevampContent();


        expect(
          userRevampServiceMock
            .getRevampContent
        ).toHaveBeenCalled();


        expect(
          component.revampFallback()
        ).toEqual(
          apiResponse
        );

      }
    );


    // =========================================
    // NO USER IN STORAGE
    // =========================================

    it(
      'should return without changing user when localStorage has no user',
      () => {

        component.user = {

          name:
            'Original User',

          email:
            'original@gmail.com',

          phone:
            '1234567890'

        };


        localStorage.removeItem(
          'user'
        );


        component.loadUser();


        expect(
          component.user.name
        ).toBe(
          'Original User'
        );

      }
    );


    // =========================================
    // VALID USER FROM STORAGE
    // =========================================

    it(
      'should load user from localStorage',
      () => {

        const storedUser = {

          name:
            'Rohit Yewale',

          email:
            'rohit@gmail.com',

          phone:
            '9876543210'

        };


        localStorage.setItem(

          'user',

          JSON.stringify(
            storedUser
          )

        );


        component.loadUser();


        expect(
          component.user
        ).toEqual(
          storedUser
        );

      }
    );


    // =========================================
    // INVALID JSON
    // =========================================

    it(
      'should handle invalid user JSON from localStorage',
      () => {

        localStorage.setItem(
          'user',
          'invalid-json'
        );


        component.loadUser();


        expect(
          consoleErrorSpy
        ).toHaveBeenCalled();


        expect(
          consoleErrorSpy
        ).toHaveBeenCalledWith(
          'Unable to read user:',
          expect.anything()
        );

      }
    );


    // =========================================
    // EDIT
    // =========================================

    it(
      'should enable edit mode',
      () => {

        expect(
          component.isEdit
        ).toBe(
          false
        );


        component.editProfile();


        expect(
          component.isEdit
        ).toBe(
          true
        );

      }
    );


    // =========================================
    // SAVE PROFILE
    // =========================================

    it(
      'should save profile to localStorage and disable edit mode',
      () => {

        component.user = {

          name:
            'Rohit Yewale',

          email:
            'rohit@gmail.com',

          phone:
            '9876543210'

        };


        component.isEdit =
          true;


        component.saveProfile();


        const storedUser =
          JSON.parse(

            localStorage.getItem(
              'user'
            ) as string

          );


        expect(
          storedUser
        ).toEqual(
          component.user
        );


        expect(
          component.isEdit
        ).toBe(
          false
        );

      }
    );


    // =========================================
    // CANCEL
    // =========================================

    it(
      'should restore stored user and disable edit mode on cancel',
      () => {

        const originalUser = {

          name:
            'Rohit Yewale',

          email:
            'rohit@gmail.com',

          phone:
            '9876543210'

        };


        localStorage.setItem(

          'user',

          JSON.stringify(
            originalUser
          )

        );


        // Simulate edited values
        component.user = {

          name:
            'Changed Name',

          email:
            'changed@gmail.com',

          phone:
            '1111111111'

        };


        component.isEdit =
          true;


        component.cancel();


        expect(
          component.user
        ).toEqual(
          originalUser
        );


        expect(
          component.isEdit
        ).toBe(
          false
        );

      }
    );


    // =========================================
    // CANCEL CALLS LOAD USER
    // =========================================

    it(
      'should call loadUser when cancel is called',
      () => {

        const spy =
          jest
            .spyOn(
              component,
              'loadUser'
            )
            .mockImplementation();


        component.isEdit =
          true;


        component.cancel();


        expect(
          spy
        ).toHaveBeenCalledTimes(
          1
        );


        expect(
          component.isEdit
        ).toBe(
          false
        );

      }
    );

  }
);