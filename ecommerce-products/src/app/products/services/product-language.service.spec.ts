import { TestBed } from '@angular/core/testing';

import { ProductLanguageService } from './product-language.service';

describe('ProductLanguageService', () => {
  let service: ProductLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductLanguageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
