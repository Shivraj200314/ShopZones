import { TestBed } from '@angular/core/testing';

import { ShellRevampService } from './shell-revamp.service';

describe('ShellRevampService', () => {
  let service: ShellRevampService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShellRevampService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
