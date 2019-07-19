import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransActionComponent } from './trans-action.component';

describe('TransActionComponent', () => {
  let component: TransActionComponent;
  let fixture: ComponentFixture<TransActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
