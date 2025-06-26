import { TestBed } from '@angular/core/testing';

import { BusinessPlanFinalService } from './business-plan-final.service';

describe('BusinessPlanFinalService', () => {
  let service: BusinessPlanFinalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessPlanFinalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
