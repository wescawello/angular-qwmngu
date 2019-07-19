import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageOrderDetialComponent } from './storage-order-detial.component';

describe('StorageOrderDetialComponent', () => {
  let component: StorageOrderDetialComponent;
  let fixture: ComponentFixture<StorageOrderDetialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageOrderDetialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageOrderDetialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
