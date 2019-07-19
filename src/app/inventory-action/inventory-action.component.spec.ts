import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventoryActionComponent } from './inventory-action.component';

describe('InventoryActionComponent', () => {
  let component: InventoryActionComponent;
  let fixture: ComponentFixture<InventoryActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventoryActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventoryActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
