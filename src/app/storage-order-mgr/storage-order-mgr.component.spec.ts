import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageOrderMgrComponent } from './storage-order-mgr.component';

describe('StorageOrderMgrComponent', () => {
  let component: StorageOrderMgrComponent;
  let fixture: ComponentFixture<StorageOrderMgrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageOrderMgrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageOrderMgrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
