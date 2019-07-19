import { TestBed } from '@angular/core/testing';

import { LayoutHelpService } from './layout-help.service';

describe('LayoutHelpService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LayoutHelpService = TestBed.get(LayoutHelpService);
    expect(service).toBeTruthy();
  });
});
