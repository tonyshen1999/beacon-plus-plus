import { TestBed } from '@angular/core/testing';

import { AttributeConfigService } from './attribute-config.service';

describe('AttributeConfigService', () => {
  let service: AttributeConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttributeConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
