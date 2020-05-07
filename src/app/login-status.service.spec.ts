import { TestBed } from '@angular/core/testing';

import { LoginStatusService } from './login-status.service';

describe('LoginStatusService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LoginStatusService = TestBed.get(LoginStatusService);
    expect(service).toBeTruthy();
  });
});
