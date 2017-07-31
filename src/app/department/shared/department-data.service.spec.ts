/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DepartmentDataService } from './department-data.service';

describe('Service: DepartmentData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DepartmentDataService]
    });
  });

  it('should ...', inject([DepartmentDataService], (service: DepartmentDataService) => {
    expect(service).toBeTruthy();
  }));
});