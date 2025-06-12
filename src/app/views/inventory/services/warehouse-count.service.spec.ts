import { TestBed } from '@angular/core/testing';

import { WarehouseCountService } from './warehouse-count.service';

describe('WarehouseCountService', () => {
  let service: WarehouseCountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarehouseCountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
