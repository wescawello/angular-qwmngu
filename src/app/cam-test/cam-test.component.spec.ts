import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CamTestComponent } from './cam-test.component';

describe('CamTestComponent', () => {
  let component: CamTestComponent;
  let fixture: ComponentFixture<CamTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CamTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
