import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { merge, interval, Observable, timer } from 'rxjs';
import { debounce, switchMapTo, filter} from 'rxjs/operators';
import { clearLine } from 'readline';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
 

/**
 * Inactivity directive
 */
@Directive({
  selector: '[ngxInactivity]'
})
export class NgxInactivityDirective {

  /**
   * Mouse move event emitter
   */
  private mousemove = new EventEmitter();

  /**
   * Mouse down event emitter
   */
  private mousedown = new EventEmitter();

  /**
   * Keypress event emitter
   */
  private keypress = new EventEmitter();

 
  private otimer = new Observable(null);



  /**
   * SetTimeout method id
   */
  private timeoutId: any;

  /**
   * Inactivity timeout limit (defaults 15 minutes)
   */
  @Input() ngxInactivity: number = 15;

  /**
   * Inactivity interval (defaults 1000 ms)
   */
  @Input() ngxInactivityInterval: number = 1000;

  /**
   * Inactivity callback after timeout
   */
  @Output() ngxInactivityCallback = new EventEmitter();

  /**
   * Attach a mouse move listener
   */
  @HostListener('document:mousemove', ['$event'])
  onMousemove(event) {
    //console.log('dd');
    this.mousemove.emit(event);
  }

  /**
   * Atach a mouse down listener
   */
  @HostListener('touchstart', ['$event'])
  @HostListener('mousedown', ['$event'])
  onMousedown(event) {
    this.mousedown.emit(event);
  }

  /**
   * Attach a key press listener
   */
  @HostListener('document:keypress', ['$event'])
  onKeypress(event) {
    this.keypress.emit(event);
  }

 
  emitoff = true;
  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) {
    /*
     * Merge to flattens multiple Observables together
     * by blending their values into one Observable
     */
    afAuth.authState.subscribe((auth) => {
      if (auth) {

        const ll = merge(this.mousemove, this.mousedown, this.keypress)
        const offtime = ll.pipe(
          debounce(() => interval(this.ngxInactivityInterval)),
          switchMapTo(this.newTimer())
        );
        const ontime = ll.pipe(
          //  debounce(() => interval(this.ngxInactivityInterval)),
          filter(() => this.emitoff)
        );

        ontime.subscribe(async () => {
          this.emitoff = false;
          await afs.doc(`users/${afAuth.auth.currentUser.uid}`).update({

            State: 'online'
          });
          console.log('active');
        });


        offtime.subscribe(async () => {
          this.emitoff = true;
          console.log('after', this.ngxInactivity, 's');
          await afs.doc(`users/${afAuth.auth.currentUser.uid}`).update({

            State: 'offline'
          });
          // firebase userstate=>offine;
          this.ngxInactivityCallback.emit(true);
        });
      }
    });
   
  }
  newTimer () {
    return timer(this.ngxInactivity * 60000);
  }
  /**
   * Start inactivity timer
   */
  public start(): void {

    /**
     * Inactivity callback if timeout (in minutes) is exceeded
     */
     
    this.timeoutId = setTimeout(() => {
      console.log('dd');
      this.ngxInactivityCallback.emit(true);
    }
      , this.ngxInactivity * 1000);
  }

  /**
   * Reset inactivity timer
   */
  public reset(): void {


    console.log('dddd');
    this.otimer.subscribe
    //clearTimeout(this.timeoutId);
  }

}
