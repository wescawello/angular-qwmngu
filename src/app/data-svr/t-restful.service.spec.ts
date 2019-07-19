import { TestBed } from '@angular/core/testing';

import { TRestfulService } from './t-restful.service';

describe('TRestfulService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TRestfulService = TestBed.get(TRestfulService);
    expect(service).toBeTruthy();
  });
});
