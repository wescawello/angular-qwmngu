import { Component, OnInit, AfterViewChecked, OnDestroy, AfterContentInit } from '@angular/core';
import { LayoutHelpService } from '../Service/layout-help.service';
import { ScreenfullService } from '@ngx-extensions/screenfull'; 
import { IHandleTabsave,  ISubInventory } from '../Model/commonModel';
import { Observable, BehaviorSubject, timer, fromEvent } from 'rxjs';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';
import { map, take, filter } from 'rxjs/operators';
import { BarcodeDecoderService } from '../Service/barcode-decoder.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { BarTwoService } from '../Service/bar-two.service';
import { AlertComponent } from 'ngx-bootstrap';
import { AuthService } from '../Service/auth.service';
 


type GISubInventory= ISubInventory & { xid: string; }


const lss = ["0000000011", "0011202006", "0012000703", "0015020001", "0015090003", "0015153001", "0100000000", "0100042206", "0110008003", "0115587409", "0130010108", "0350000001", "0500000064", "0520000000", "0563040332", "0940020200", "0942000632", "1011313003", "1013100800", "1015031004", "1015254105", "1031000301", "1100000024", "1220000016", "1460001106", "1630010105", "2014200904", "2015025202", "2115042001", "2331000024", "2643205449", "2720000085", "3011535004", "3015300005", "3053000502", "3215053005", "3300000043", "3415550200", "3830000092", "4011401004", "4014000601", "4015046006", "4015054005", "4015557403", "4031040601", "4040000102", "4400000056", "4960040406"]
@Component({
  selector: 'app-cam-test',
  templateUrl: './cam-test.component.html',
  styleUrls: ['./cam-test.component.css']
})
export class CamTestComponent implements OnInit, AfterViewChecked, OnDestroy, AfterContentInit {
    worientationchange: Observable<Event>;
    Passcount: number;
    Currpass: number=0;
   // gg$: BehaviorSubject<string[]>;
  alerts: any[] = [];

  obboolangle$ = new BehaviorSubject(false);
 

  onClosed(dismissedAlert: AlertComponent): void {
    this.alerts = this.alerts.filter(alert => alert !== dismissedAlert);
  }



  async ngAfterContentInit() {
    console.log('fsdfsdfdsf');
    this.ly.setNav(false);
    if (!this.worientationchange) {
      this.worientationchange = fromEvent(window, 'orientationchange')
      this.worientationchange.subscribe(()=>this.och());
    }
    

    //window.addEventListener("orientationchange", this.och

    //  , false);


    this.decoderService.onDecodeStop();

    await this.decoderService.onLiveStreamInit(document.getElementById('vid_container'));
    this.decoderService.onDecodeProcessed();
    this.decoderService.distcode$.pipe(filter(o => o.length > 0)).subscribe(async o => {
      console.log(o);
      let jjs = this.localItems$.getValue()
      let jj = jjs.find(s => s.AssetSn == o);
      if (jj) {
        if (jj.UserId) {
         // console.log(`${o}  : ${      this.AllUser.getValue().find(x=>x.uid== jj.UserId).displayName } at ${jj.InventoryDate} 盤過了`);
          this.alerts.push({
            type: 'danger',
            msg: `${o}  : ${this.authService.AllUser$.getValue().find(x => x.uid == jj.UserId).displayName } at ${ jj.InventoryDate } 盤過了`,
            timeout: 5000
          });
        } else {
          //jj.InventoryDate = new Date();
          this.Currpass += 1;
          this.alerts.push({
            type: 'info',
            msg: `你盤了${jj.AssetName} :barcode[${jj.AssetSn}]`,
            timeout: 5000
          });

          jj.UserId = this.afAuth.auth.currentUser.uid;
          jj.UserDisplayName = this.afAuth.auth.currentUser.displayName;
          this.localItems$.next(jjs);
          timer(500).subscribe(async () => {
            await this.afs.doc(`inventory2/${this.vxid}/Tabs/${this.tabindex}/items/${jj.xid}`).update({ InventoryDate: new Date(), UserDisplayName: jj.UserDisplayName, UserId: jj.UserId});
          });
        }

      }




    });
    //let bt = new BarTwoService();
    //bt.init(document.getElementById('vid_container'));
    //bt.detectedCodes.subscribe(o => { console.log(o); });
    // this.gg$= this.decoderService.arrcode$
  }
  tabindex: string;
  decoderService: BarcodeDecoderService;
  ngOnDestroy(): void {
    //window.removeEventListener("orientationchange", this.och

    //  , false);
    this.decoderService.onDecodeStop();
    this.ly.setNav(true);

  }
  ngAfterViewChecked(): void {
    //console.log('ccc');
    //
    //let [
    //  video, takePhotoButton, toggleFullScreenButton, switchCameraButton
    //] = [
    //    document.getElementById('video'),
    //    document.getElementById('takePhotoButton'),
    //    document.getElementById('toggleFullScreenButton'),
    //    document.getElementById('switchCameraButton')
    //  ];

    // https://developer.mozilla.org/nl/docs/Web/HTML/Element/button
    // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_button_role

    //takePhotoButton.addEventListener("click", function () {
      //takeSnapshotUI();
      //takeSnapshot();
    //});

    // -- fullscreen part



    // -- switch camera part
    //if (amountOfCameras > 1) {

    //  switchCameraButton.style.display = 'block';

    //  switchCameraButton.addEventListener("click", function () {

    //    if (currentFacingMode === 'environment') currentFacingMode = 'user';
    //    else currentFacingMode = 'environment';

    //    initCameraStream();

    //  });
    //}

    // Listen for orientation changes to make sure buttons stay at the side of the 
    // physical (and virtual) buttons (opposite of camera) most of the layout change is done by CSS media queries
    // https://www.sitepoint.com/introducing-screen-orientation-api/
    // https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
   





  }
  doc: AngularFirestoreDocument<IHandleTabsave>;
  vxid: string;
  localdoc$: BehaviorSubject<IHandleTabsave> = new BehaviorSubject(null);
  doc$: Observable<IHandleTabsave>;
  tabs: Observable<(firebase.firestore.DocumentData & { id: string; })[]>;
  localTabs: (firebase.firestore.DocumentData & { id: string; })[];
  items$: Observable<GISubInventory[]>;
  localItems$ = new BehaviorSubject<GISubInventory[]>([]);

  och() {
    // iOS doesn't have screen.orientation, so fallback to window.orientation.
    // screen.orientation will 
    let angle = screen.orientation ? screen.orientation.angle : window.orientation;
    console.log(angle);

    //var guiControls = document.getElementById("gui_controls").classList;
    //var vidContainer = document.getElementById("vid_container").classList;

    if (angle == 270 || angle == -90) {
      this.obboolangle$.next(true);
      //guiControls.add('left');
      //vidContainer.add('left');
    }
    else {
      this.obboolangle$.next(false);

      //if (guiControls.contains('left')) guiControls.remove('left');
      //if (vidContainer.contains('left')) vidContainer.remove('left');
    }

    this.ngAfterContentInit();



    //0   portrait-primary   
    //180 portrait-secondary device is down under
    //90  landscape-primary  buttons at the right
    //270 landscape-secondary buttons at the left
  }
  

  constructor(private ly: LayoutHelpService, public readonly screenfullService: ScreenfullService, private route: ActivatedRoute, private router: Router, private afs: AngularFirestore,
    public afAuth: AngularFireAuth, private authService: AuthService ) {
    this.decoderService = new BarcodeDecoderService();
    this.vxid = route.snapshot.params.id;
    this.tabindex = route.snapshot.params.tabindex;
    
    this.doc = afs.doc<IHandleTabsave>(`inventory2/${this.vxid}`);
    
 

    this.items$ = afs.collection<ISubInventory>(`inventory2/${this.vxid}/Tabs/${this.tabindex}/items`, ref => ref.where('StateId', '==', '').orderBy("InventoryDate", "asc"))
      .valueChanges({ idField: 'xid' }).pipe(map(orr => orr.map(rr => { return { ...rr, InventoryDate: rr.InventoryDate ? (<firebase.firestore.Timestamp>rr.InventoryDate).toDate() : null } })));



    this.items$.subscribe(p => {
      this.localItems$.next(p);
    });
    this.localItems$.subscribe(x=>this.Passcount= x.filter(o=>o.InventoryDate).length)
  }
  goback() {

    this.router.navigate(["/inventory-action", this.vxid]);
  }
  ngOnInit() {


    let [currentFacingMode, video] = ['environment', <HTMLVideoElement>document.getElementById('video')];
    var constraints = {
      audio: false,
      video: {
        width: { min: 1024, ideal: window.innerWidth, max: 1920 },
        height: { min: 776, ideal: window.innerHeight, max: 1080 },
        facingMode: currentFacingMode
      }
    };
    //navigator.mediaDevices.getUserMedia(constraints).then((stream) => {

    //  video.srcObject = stream;

    //}); 
    //navigator.mediaDevices.getUserMedia(constraints).
    //  then(x => {
    //    console.log(x);
    //    navigator.mediaDevices.enumerateDevices().then(dd => {
    //      console.log(dd);
    //    })
      
    //  }).catch(handleError);

    function handleSuccess(stream) {


      video.srcObject = stream;

      if (constraints.video.facingMode) {

        if (constraints.video.facingMode === 'environment') {
          //switchCameraButton.setAttribute("aria-pressed", true);
        }
        else {
          //switchCameraButton.setAttribute("aria-pressed", false);
        }
      }

      return navigator.mediaDevices.enumerateDevices();
    }

    function handleError(error) {

      console.log(error);

      //https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
      if (error === 'PermissionDeniedError') {
        alert("Permission denied. Please refresh and give permission.");
      }

    }


     
  }
   

}
