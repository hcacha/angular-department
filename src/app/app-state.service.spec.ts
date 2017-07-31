/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AppStateService } from './app-state.service';

describe('Service: AppState', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppStateService]
    });
  });

  it('should ...', inject([AppStateService], (service: AppStateService) => {
    expect(service).toBeTruthy();
  }));
});