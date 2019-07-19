import { Component, OnInit, ViewChild, AfterContentInit, OnDestroy } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ObClass } from '../Model/ob-class';
import { BarcodeDecoderService } from '../Service/barcode-decoder.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-cam-barcode',
  templateUrl: './cam-barcode.component.html',
  styleUrls: ['./cam-barcode.component.css']
})
export class CamBarcodeComponent implements OnInit, AfterContentInit, OnDestroy {
  ngOnDestroy(): void {
    this.decoderService.onDecodeStop();
  }
  async ngAfterContentInit() {
    await this.decoderService.onLiveStreamInit(this.targetCam.nativeElement);
    this.decoderService.onDecodeProcessed();
    this.ob.data$ = this.decoderService.arrcode$;


  }
  actionName: string;
  ob: ObClass<string>;
  @ViewChild('targetCam', { static: true }) targetCam;
  decoderService: BarcodeDecoderService
  constructor(public bsModalRef: BsModalRef) {
    this.decoderService = new BarcodeDecoderService();
  }

  ngOnInit() {


  }

}
