import { TestBed } from '@angular/core/testing';

import { GeneralMethodsService } from './general-methods.service';

describe('GeneralMethodsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GeneralMethodsService = TestBed.get(GeneralMethodsService);
    expect(service).toBeTruthy();
  });
});
