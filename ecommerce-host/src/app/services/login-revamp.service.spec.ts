import { TestBed } from '@angular/core/testing';

import { LoginRevampService } from './login-revamp.service';

describe('LoginRevampService', () => {
  let service: LoginRevampService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginRevampService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
