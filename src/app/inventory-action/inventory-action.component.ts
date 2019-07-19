import { Component, OnInit, ViewChild, ElementRef, OnDestroy, AfterContentInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable, BehaviorSubject, interval, Subject, timer } from 'rxjs';
import { IHandleTabsave, ITabsave, ISubInventory } from '../Model/commonModel';
import { take, map } from 'rxjs/operators';
import { setTheme } from 'ngx-bootstrap/utils';
import * as firebase from 'firebase';
//import { BarcodeDecoderService } from '../Service/barcode-decoder.service';
import { BsModalRef ,BsModalService} from 'ngx-bootstrap/modal';
import { ObClass } from '../Model/ob-class';
import { CamBarcodeComponent } from '../cam-barcode/cam-barcode.component';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-inventory-action',
  templateUrl: './inventory-action.component.html',
  styleUrls: ['./inventory-action.component.css']
})
export class InventoryActionComponent implements OnInit, OnDestroy, AfterContentInit {
    modalRef: BsModalRef | null;
    ob: ObClass<string>;
    ngAfterContentInit(): void {
      
    }
    ngOnDestroy(): void {
      
    }
  openReader() {
    this.modalRef = this.modalService.show(CamBarcodeComponent, Object.assign({
      initialState: {
        ob: this.ob,
        closeBtnName: "Close"

      }
    }, { class: 'modal-lg' }));
    //this.decoderService.onLiveStreamInit(this.interactive.nativeElement);

    //this.decoderService.onDecodeProcessed();

    //this.decoderService
    //  .onDecodeDetected()
    //  .then(code => {
    //    this.lastResult = code;
    //    this.decoderService.onPlaySound();
    //    this.code$.next(code);
    //  })
    //  .catch((err) => this.error = `Something Wrong: ${err}`);

    

  }
  closeReader() {

    //this.decoderService.onDecodeStop();
  }
  //searchByVIN(event: Event) {
  //  this.imageProcessing.promptForImage(event, true).then(file => {
  //    return this.imageProcessing.limitResolution(file, { width: 480, height: 640 })
  //  }).then(dataURL => {
  //    return new Promise<ImageData>((resolve, reject) => {
  //      const image: HTMLImageElement = new Image();
  //      // callbacks
  //      image.addEventListener('error', event => {
  //        reject(event.error);
  //      });
  //      image.addEventListener('load', event => {
  //        // create canvas element
  //        const canvas: HTMLCanvasElement = this.canvas.nativeElement;
  //        const context: CanvasRenderingContext2D = canvas.getContext('2d');
  //        canvas.addEventListener('error', canvasEvent => {
  //          reject(canvasEvent.error);
  //        });
  //        const width = canvas.width = image.width;
  //        const height = canvas.height = image.height;
  //        context.drawImage(image, 0, 0, width, height);
  //        resolve(context.getImageData(0, 0, width, height));
  //      });
  //      // load in image
  //      image.src = dataURL;
  //    });
  //  }).then(imageData => {
  //    this.zxingService.scan(imageData);
  //  });
  //}
  taxbs: BehaviorSubject<ITabsave[]>;
 
  doc:  AngularFirestoreDocument<IHandleTabsave>;
  vxid: string;
  localdoc$: BehaviorSubject<IHandleTabsave> = new  BehaviorSubject(null);
  doc$: Observable<IHandleTabsave>;
  tabs: Observable<(firebase.firestore.DocumentData & { id: string; })[]>;
  localTabs: (firebase.firestore.DocumentData & { id: string; })[];


  lastResult: any;
  message: any;
  error: any;

  code$ = new Subject<any>();

  @ViewChild('interactive', { static: false }) interactive;
  @ViewChild('canvas', { read: ElementRef, static: false })
  public canvas: ElementRef;




  constructor(private route: ActivatedRoute, private afs: AngularFirestore, private modalService: BsModalService, public afAuth: AngularFireAuth) {
    setTheme('bs4');
    this.vxid = route.snapshot.params.id;
    //this.tabs = new BehaviorSubject([]);
    //let gg: firebase.firestore.Timestamp = firebase.firestore.Timestamp.fromDate(new Date());
    
    this.doc = afs.doc<IHandleTabsave>(`inventory2/${this.vxid}`);

    //this.doc.valueChanges().subscribe(console.log);


    this.doc$ = this.doc.valueChanges();

    //this.doc$ = this.doc.valueChanges().pipe(map(q => {
    //  q.Tabs.forEach(r => {
    //    r.items = r.items.map(rr => {
    //      return { ...rr, InventoryDate: rr.InventoryDate ? (<firebase.firestore.Timestamp>rr.InventoryDate).toDate() : null };
    //    })

    //    if (r.wayrole == '存在') {
    //      let g = new Date();
    //      r.items = r.items.sort((a, b) => {
    //        //let [
    //        //  a_InventoryDate,
    //        //  b_InventoryDate
    //        //] = [
    //        //    a.InventoryDate ? a.InventoryDate.toDate() : null,
    //        //    b.InventoryDate ? b.InventoryDate.toDate() : null
    //        //    //a.InventoryDate ? a.InventoryDate.toDate() : g,
    //        //    //b.InventoryDate ? b.InventoryDate.toDate() : g
    //        //  ];
    //        //a.InventoryDate = isObject(a.InventoryDate) ? a.InventoryDate.toDate() : null;
    //        //b.InventoryDate = isObject(b.InventoryDate) ? b.InventoryDate.toDate() : null;

    //        if (a.InventoryDate > b.InventoryDate) return 1;
    //        if (a.InventoryDate < b.InventoryDate) return -1;
    //        return 0;
    //      });
    //    }
    //    if (r.wayrole == '狀態') {
    //      if(!r.kindAitems ) r. kindAitems = []; 
    //      if (!r.kindBitems) r.kindBitems = []; 
    //    }
    //  });
    //  console.log("mmmm");
    //  return q;
    //}));
  }
   KAchange(e: any, ds: (ISubInventory & {xid:string})[], discType: string,  collect: AngularFirestoreCollection<any>) {
    console.log(e);
     ds.forEach(async (d, i) => {
       if (d.Fsn != i) {

         await collect.doc(d.xid).update({ InventoryDate: discType ? new Date() : null, StateId: discType, Fsn: i, UserId: this.afAuth.auth.currentUser.uid, UserDisplayName: this.afAuth.auth.currentUser.displayName});
       } else if (d.StateId != discType) {
         await collect.doc(d.xid).update({ InventoryDate: discType ? new Date() : null, StateId: discType, Fsn: i, UserId: this.afAuth.auth.currentUser.uid, UserDisplayName: this.afAuth.auth.currentUser.displayName});
       } else {

       }
     });



     
  //  if (empty && ds.some(d => d.InventoryDate != null)) {


  //    let d = ds.find(d => d.InventoryDate != null);
  //    d.UserId = null, d.InventoryDate = null;
  //  }
  //;//.toJSON();
   
  //  interval(50).pipe(take(1)).subscribe(() => {
  //    this.localdoc$.pipe(take(1)).subscribe((q) => {
  //      q.DoUpdate = 1;
  //      this.localdoc$.next(q);
  //    });
  //  })
  }
  async pt(ptid: string) {
    console.log(ptid);
    this.tabs.subscribe(x => {
      console.log('ggggggg');
    })

 

    let tabs = this.localTabs;
    console.log(tabs);
    let pd = false;
    tabs.forEach(async tb => {
      if (tb.wayrole == '存在') {
        let ss = await this.doc.collection<ITabsave>('Tabs').doc(tb.id).collection<ISubInventory>('items').valueChanges({ idField: 'xid' }).pipe(take(1)).toPromise();
        if (ss.some(s => s.AssetSn == ptid)) {
          let s = ss.find(s => s.AssetSn == ptid)
          if (!s.UserId) {
            await this.doc.collection<ITabsave>('Tabs').doc(tb.id).collection<ISubInventory>('items').doc(s.xid).update({ InventoryDate: new Date(), UserId: this.afAuth.auth.currentUser.uid, UserDisplayName: this.afAuth.auth.currentUser.displayName })

          }
          else {
            alert(`${s.UserId}盤過了`);
          }
          pd=true
        } else {
         
          console.log(` 盤不到${ptid}`);

           
        }
      }
    });
    if (!pd) {
      //alert(` 盤不到${ptid}`);
    }

  //let q=await this.tabs.toPromise();
  // console.log(q);

  //    let resortP: boolean = false;

  //    q.forEach(r => {
  //      let resort: boolean = false;
  //      r.items$.pipe(take(1)).subscribe( async ss => {
  //        if (ss.some(s => s.AssetSn == ptid)) {
  //          let s = ss.find(s => s.AssetSn == ptid);
  //          if (s.UserId != '') {
  //            alert(`${s.UserId}盤過了`);
  //          } else {
  //           await r.items.doc(s.xid).update({ InventoryDate: new Date(), UserId: 'Ark' });
  //          }
  //        }
  //      });
       
  //    });
      

      

 


  }

  ngOnInit() {
    console.log("init inventory-action");
    this.doc$.subscribe(p => {
    //  this.tabs.next(p.Tabs);
      this.localdoc$.next(p);

    });
    this.localdoc$.subscribe(p => {
      console.log("localdoc$ update");
      if (p && p.DoUpdate) {
        delete p.DoUpdate;
        this.doc.set(p)
      }
    });
    this.tabs = this.doc.collection<ITabsave>("Tabs").valueChanges({ idField: 'id' }).pipe(map(tabs => {

      return tabs.map(tb => {
        console.log(tb);

        let items = this.doc.collection<ITabsave>("Tabs").doc(tb.id).collection("items");
        let items$ = this.doc.collection<ITabsave>("Tabs").doc(tb.id).collection("items", ref => ref.where('StateId', '==', '').orderBy(tb["wayrole"] == '存在' ? "InventoryDate" : "Fsn", "asc")).valueChanges({ idField: 'xid' })
          .pipe(map(orr => {
            return orr.map(rr => { return { ...rr, InventoryDate: rr['InventoryDate'] ? (<firebase.firestore.Timestamp>rr['InventoryDate']).toDate() : null } });
          }));
        //let itemsA$ = this.doc.collection<ITabsave>("Tabs").doc(tb.id).collection("items", ref => ref.where('StateId', '==', 'A').orderBy(tb["wayrole"] == '存在' ? "InventoryDate" : "Fsn", "asc")).valueChanges({ idField: 'xid' })
        //  .pipe(map(orr => {
        //    return orr.map(rr => { return { ...rr, InventoryDate: rr['InventoryDate'] ? (<firebase.firestore.Timestamp>rr['InventoryDate']).toDate() : null } });
        //  }));
        //let itemsB$ = this.doc.collection<ITabsave>("Tabs").doc(tb.id).collection("items", ref => ref.where('StateId', '==', 'B').orderBy(tb["wayrole"] == '存在' ? "InventoryDate" : "Fsn", "asc")).valueChanges({ idField: 'xid' })
        //  .pipe(map(orr => {
        //    return orr.map(rr => { return { ...rr, InventoryDate: rr['InventoryDate'] ? (<firebase.firestore.Timestamp>rr['InventoryDate']).toDate() : null } });
        //  }));

        
        if (tb.wayrole == '存在') {
          return { ...tb, items, items$ };
        } else {
          let Force = [];
          tb.Status.forEach(s => {
            let items$ = this.doc.collection<ITabsave>("Tabs").doc(tb.id).collection<ISubInventory>("items", ref => ref.where('StateId', '==', s.Name).orderBy(tb.wayrole == '存在' ? "InventoryDate" : "Fsn", "asc")).valueChanges({ idField: 'xid' })
              .pipe(map(orr => {
                return orr.map(rr => { return { ...rr, InventoryDate: rr.InventoryDate ? (<firebase.firestore.Timestamp>rr.InventoryDate).toDate() : null } });
              }));
            let [stateName, watchItems, localItems] = [s.Name, new BehaviorSubject<any[]>([]), []];
            let tmpobj = { stateName, items$, watchItems, localItems };
            tmpobj.items$.subscribe(p => { tmpobj.watchItems.next(p); });
            tmpobj.watchItems.subscribe(p => { tmpobj.localItems = [...p] });
            Force.push(tmpobj)
          });






          let xtb = {
            ...tb, items, items$,
            "watchItems": new BehaviorSubject<any[]>([]),
            //"watchItemsA": new BehaviorSubject<any[]>([]),
            //"watchItemsB": new BehaviorSubject<any[]>([]),
            localItems: [],
            //localItemsA: [],
            //localItemsB: [],
            Force,
          };
          //xtb.watchItemsA.subscribe(p => xtb.localItemsA = [...p]);
          //xtb.watchItemsB.subscribe(p => xtb.localItemsB = [...p]);

          xtb.items$.subscribe(p => { xtb.watchItems.next(p); xtb.localItems = [...p]; });
          //xtb.itemsA$.subscribe(p => xtb.watchItemsA.next(p));
          //xtb.itemsB$.subscribe(p => xtb.watchItemsB.next(p));
          // xtb.watchItems.subscribe(p => { console.log(p); xtb.localItems =[... p] });
  


         return xtb;
        }
      
      });
      this.localTabs = tabs;

     // console.log(tabs);

      return tabs;
    }

    ));
    this.ob = new ObClass([], null);

  }
  redit(tabz: ISubInventory, i:number,tabindex:number) {
    console.log(tabz);
    //tabz.UserId = "Ark";
    //tabz.InventoryDate = new Date().toJSON();

    this.localdoc$.pipe(take(1)).subscribe(k => {

      //console.log(k.Tabs[tabindex].items[i].UserId);
      k.Tabs[tabindex].items[i].UserId = this.afAuth.auth.currentUser.uid;
      k.Tabs[tabindex].items[i].UserDisplayName = this.afAuth.auth.currentUser.displayName;
      k.Tabs[tabindex].items[i].InventoryDate = new Date();//.toJSON();
      k.DoUpdate = 1;
      this.localdoc$.next(k);
      //var ch = k.Tabs[tabindex].items;

      //ch.push(ch[i]); ch.splice(i, 1);

     
    })
  }
  async redit2(tabz: ISubInventory, cols: AngularFirestoreCollection<any>) {

    tabz.UserId = this.afAuth.auth.currentUser.uid;
    await cols.doc(tabz['xid']).update({ InventoryDate: new Date(), UserId: this.afAuth.auth.currentUser.uid, UserDisplayName: this.afAuth.auth.currentUser.displayName });



  }
}
