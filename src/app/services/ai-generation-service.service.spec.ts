import { TestBed } from '@angular/core/testing';

import { AiGenerationServiceService } from './ai-generation-service.service';

describe('AiGenerationServiceService', () => {
  let service: AiGenerationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiGenerationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
