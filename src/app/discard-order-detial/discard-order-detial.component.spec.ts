import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscardOrderDetialComponent } from './discard-order-detial.component';

describe('DiscardOrderDetialComponent', () => {
  let component: DiscardOrderDetialComponent;
  let fixture: ComponentFixture<DiscardOrderDetialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscardOrderDetialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscardOrderDetialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
