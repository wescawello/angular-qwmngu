import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CamBarcodeComponent } from './cam-barcode.component';

describe('CamBarcodeComponent', () => {
  let component: CamBarcodeComponent;
  let fixture: ComponentFixture<CamBarcodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CamBarcodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CamBarcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
