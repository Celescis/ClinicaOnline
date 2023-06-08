import { TestBed } from '@angular/core/testing';

import { CanActivateAdministradorGuard } from './can-activate-administrador.guard';

describe('CanActivateAdministradorGuard', () => {
  let guard: CanActivateAdministradorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CanActivateAdministradorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
