import { TestBed } from '@angular/core/testing';

import { AiGenerationService } from './ai-generation.service';

describe('AiGenerationService', () => {
  let service: AiGenerationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AiGenerationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
