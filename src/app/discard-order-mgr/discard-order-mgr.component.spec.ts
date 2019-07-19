import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscardOrderMgrComponent } from './discard-order-mgr.component';

describe('DiscardOrderMgrComponent', () => {
  let component: DiscardOrderMgrComponent;
  let fixture: ComponentFixture<DiscardOrderMgrComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscardOrderMgrComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscardOrderMgrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
