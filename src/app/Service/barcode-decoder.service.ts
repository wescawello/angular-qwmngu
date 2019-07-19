import { Injectable, Type } from '@angular/core';
//import * as Quagga  from 'quagga';
import { QuaggaJSStatic, QuaggaJSConfigObject } from '../Model/qua'
import { quagga } from 'quagga';
import { DECODER_CONFIG, DECODER_LIVE_CONFIG } from '../lib/conf';
import { BehaviorSubject, of, bindCallback, bindNodeCallback } from 'rxjs';
import { take, filter } from 'rxjs/operators';
import { asyncScheduler } from "rxjs";
//declare var Quagga: QuaggaJSStatic = Quagga;
const Quagga: QuaggaJSStatic= require('quagga');
 
@Injectable({
  providedIn: 'root'
})
export class BarcodeDecoderService {
  
  sound = new Audio('assets/barcode.wav');
  arrcode$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  distcode$: BehaviorSubject<string> = new BehaviorSubject<string>("");
  sicode$: BehaviorSubject<string> = new BehaviorSubject<string>("");
    vvs: CSSStyleDeclaration;
    vcs: CSSStyleDeclaration;
    qstate: any;
    sss: { width: number; height: number; };
  constructor() {
    this.sicode$ = new BehaviorSubject<string>("");
    //console.log(dQuagga.default);
    this.sicode$.pipe(filter(o=>o.length==10)).subscribe(  o => {
      let k = this.arrcode$.getValue();
       
      if (!k.includes(o)) {
        k.push(o);
        this.distcode$.next(o);
        // console.log(k);
        this.arrcode$.next(k.sort());
      }
 
 
     



    })
  }
  obDecodeSingle(src) {

    Quagga.decodeSingle(DECODER_CONFIG, result => {
      if (!result || typeof result.codeResult === 'undefined') {
        //reject('File Cannot be Decode, Please Try a Valid Barcode;');
      } else {
        this.sicode$.next(result.codeResult.code);
      }
      //resolve(result.codeResult.code);
    });
  }




  onDecodeSingle(src) {
    DECODER_CONFIG.src = src;
    

    // Promisify DecodeSingle method from Quagga
    return new Promise((resolve, reject) => {
      console.log('onDecodeSingle');
      Quagga.decodeSingle(DECODER_CONFIG, result => {
        if (!result || typeof result.codeResult === 'undefined') {
          reject('File Cannot be Decode, Please Try a Valid Barcode;');
        }
        resolve(result.codeResult.code);
      });
    });
  }

  private setLiveStreamConfig() {
    DECODER_LIVE_CONFIG.inputStream = {
      type: 'LiveStream',
      constraints: {
         facingMode: 'environment',
        aspectRatio: {
          min: 0.5,
          max: 2,
        },
      }
    };
    return of( DECODER_LIVE_CONFIG);
  }

  async onLiveStreamInit(tar: HTMLElement,  facingMode? :string) {
    this.setLiveStreamConfig().subscribe(async( state: QuaggaJSConfigObject) => {
      let video = {
        width: {
          min: 160, ideal: 1920,//window.innerWidth,
          max: 1920
        },
        height: {
          min: 120, ideal: 969,//window.innerHeight,
          max: 1080
        },
        facingMode: "environment" 
      }
      let stream = await navigator.mediaDevices.getUserMedia({
        video: video
      });
      let { width, height } = stream.getVideoTracks()[0].getSettings();
      this.sss = { width, height };
      console.log(this.sss  );
     // console.log(width,"sssssssssssssss", height);
      if (window.innerHeight > window.innerWidth) {
        [video.width.min, video.height.min] = [video.height.min, video.width.min];
        [video.width.max, video.height.max] = [video.height.max, video.width.max];
        [video.width.ideal, video.height.ideal] = [video.height.ideal, video.width.ideal];
      }
      stream.getTracks().forEach( (track) => track.stop());

      state.inputStream.constraints = { ...state.inputStream.constraints, ...video };
      console.log(state);
      state.inputStream.target = tar;
      let [v, c] = [ tar.getElementsByTagName('video')[0], tar.getElementsByTagName('canvas')[0]]
      v.style.position = 'absolute';

      let vs = getComputedStyle(v);
      console.log(4/3== 4/3);


      //c.setAttribute('width', parseInt(vs.width).toString());
      //c.setAttribute('height', parseInt(vs.height).toString());
      c.style.zIndex = '3';
      c.style.position = 'relative';


      console.log(  parseInt(  vs.width));
      
      console.log(state);
      this.qstate = state;
      Quagga.init(state, (err) => {
        if (err) {
          return console.error(err);
        }



        Quagga.start();
        if (window.innerHeight > window.innerWidth) {
          v.style.height = "100vh"
          c.style.height = "100vh"
          v.style.width = 'auto';
          c.style.width = 'auto';
        } else {
          v.style.width = "100vw"
          c.style.width = "100vw"
          v.style.height = 'auto';
          c.style.height = 'auto';
        }


        this.vvs = getComputedStyle(v);
        this.vcs = getComputedStyle(c);



        console.log(this.vvs);
        console.log(this.vcs);





   

      });
    })

  }

  onProcessed(result: any, h: BehaviorSubject<string>) {
    let drawingCtx = Quagga.canvas.ctx.overlay,
      drawingCanvas = Quagga.canvas.dom.overlay;

    if (result) {
     
      if (result.boxes) {
        drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width')), parseInt(drawingCanvas.getAttribute('height')));
        result.boxes.filter(function (box) {
          return box !== result.box;
        }).forEach(function (box) {
       
          Quagga.ImageDebug.drawPath(box, {
            x: 0,
            y: 1
          }, drawingCtx, {
              color: 'green',
              lineWidth: 2
            }); 
        });
      }

      if (result.box) {
        Quagga.ImageDebug.drawPath(result.box, {
          x: 0,
          y: 1
        }, drawingCtx, {
            color: '#00F',
            lineWidth: 2
          });
      }
      if (result.codeResult && result.codeResult.code) {
        //console.log(Quagga.ImageDebug);
        h.next(result.codeResult.code);

       
        Quagga.ImageDebug.drawPath(result.line, {
          x: 'x',
          y: 'y'
        }, drawingCtx, {
            color: 'red',
            lineWidth: 3
          });
      }

    }
  }

  onDecodeProcessed() {
    //bindNodeCallback(Quagga.onProcessed  )()
    //    .subscribe(R => {
    //      console.log(R);

    //      this.onProcessed(R, this.sicode$);
    //    });
    Quagga.onProcessed((R) => { this.onProcessed(R,this.sicode$) });
  }

  onDecodeDetected() {
    // Promisify OnDetected method from Quagga
    return new Promise((resolve, reject) => {
      Quagga.onDetected(result => {

        if (!result || typeof result.codeResult === 'undefined') {
          reject('Cannot be Detected, Please Try again!');
        }
        resolve(result.codeResult.code);
      });
    });
  }

  onDecodeStop() {
    try {
      console.log(Quagga);
      if (Quagga.canvas.ctx.overlay) {
        Quagga.stop();
        console.info('Camera Stopped Working!'); 
      }

    } catch (e) {
      console.log(e);
    }
   
  }

  onPlaySound() {
    this.sound.play();
  }

}
