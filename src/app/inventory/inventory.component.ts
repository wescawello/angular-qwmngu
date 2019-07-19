import { Component, OnInit, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { interval, BehaviorSubject } from 'rxjs';
import { take, toArray } from 'rxjs/operators';
import { UUID } from 'angular2-uuid';
import { NgModel } from '@angular/forms';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ITabdemo, IWorkOrder, ITabsave, ISubInventory, IMessage } from '../Model/commonModel';
import { AuthService } from '../Service/auth.service';
const lss = [
  "2740020203",
  "3442000032",
  "1630010105",
  "3015456306",
  "2015355202",
  "2331000024",
  "4015054005",
  "1460001106",
  "0350000001",
  "1015254105",
  "2570002204",
  "0940020200",
  "0015020001",
  "2115042001",
  "3011535004",
  "0015153001",
  "4015557403",
  "1015031004",
  "4553000040",
  "0110008003",
  "0903000032",
  "0520000000",
  "4960040406",
  "1220000016",
  "3015300005",
  "0911535004",
  "4014000601",
  "0012000703",
  "4040000102",
  "0020000204",
  "1610000071",
  "3300000043",
  "2720000085",
  "2200000030",
  "1100000024",
  "0000000011",
  "1700040059",
  "0500000064",
  "1031000301",
  "0107000001",
  "1011313003",
  "3053000502",
  "4011401004",
  "2014200904",
  "2011424000",
  "1931040024",
  "3215053005",
  "4015046006",
  "2001424004",
  "0220000090",
  "4400000056",
  "0804000030",
  "0100030001",
  "0301010003",
  "2719000085",
  "3339030443",
  "1202000201",
  "4000053701",
  "0015011227",
  "3737030102",
  "0015000411",
  "2203000000"];
 @Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ['./inventory.component.css']
})
export class InventoryComponent implements OnInit {
    uids: string[];
  constructor(private afs: AngularFirestore,public authService: AuthService) {
    

    authService.AllUser$.subscribe(p => {
      this.users = p.map(x => { return { Name: x.displayName, checked: false, Uid: x.uid } });
    })

    //this.users = [{ Name: 'Ark', checked: false },
    //{ Name: 'Boss', checked: false },
    //{ Name: 'Faker', checked: false },
    //{ Name: 'Arko', checked: false }
    //];
     
  }
  users: { Name: string; checked: boolean;Uid:string }[];
 
  @ViewChild('pusers', {static:false}) pusers: NgModel;
  picker: string;
  tabs: ITabdemo[] = [
    //{ title: 'Dynamic Title 1', content: 'Dynamic content 1' },
    //{ title: 'Dynamic Title 2', content: 'Dynamic content 2' },
    //{ title: 'Dynamic Title 3', content: 'Dynamic content 3', removable: true }
  ];
  AssetName: string;
  WorkOrders: BehaviorSubject<IWorkOrder[]> = new BehaviorSubject([]);
  DepName: string;

  Users: string;
  genWorkSheet() {
    let workorder = { Name: this.Users, Id: "" };

    let p = this.tabs.map(q => {
      let r: ITabsave = Object.assign({ ...q }, { items: q.items.getValue() });
      //r.items = q.items.getValue();
      //delete r.items
      return r;

    })
    let k = this.afs.collection<any>("inventory");
    //var hh = this.afs.doc<any>("/restaurants/0FouzkDzHvwoZh3JYonf").valueChanges();
    //  hh.subscribe(cc => {

    //  console.log(cc);
    //});

    var gg = {
      Users: this.Users,
      Tabs: p
    };
    console.log(gg);
    k.add({
      Users: this.Users,
      Tabs: p
    }).then(x => {
      console.log(x.id);
      workorder.Id = x.id;


      this.WorkOrders.pipe(take(1)).subscribe(wo => {


        wo.push(workorder)
        this.WorkOrders.next(wo);
      });

    });

    //k.add({
    //  Users: this.Users,
    //  Tabs: p
    //})




    this.tabs = [];
  }
 async genWorkSheet2() {
   let workorder = { Users: this.Users, Id:""};
    
    let p = this.tabs.map(q => {
      let r: ITabsave=  Object.assign({...q}, { items: q.items.getValue() });
      //r.items = q.items.getValue();
      //delete r.items
      return r;

    })
    let k = this.afs.collection("inventory2");
    //var hh = this.afs.doc<any>("/restaurants/0FouzkDzHvwoZh3JYonf").valueChanges();
    //  hh.subscribe(cc => {

    //  console.log(cc);
    //});

    var gg = {
      Users: this.Users,
      //Tabs: p
    };

   let x = await k.add({ Users: this.Users });
   workorder.Id = x.id;

   this.uids.forEach(async (uid) => {

     let mm: IMessage = {
       SenderId: this.authService.CurrUser$.getValue().uid, 
       SubTitle: "你有一則盤點任務",
       CreateDate: new Date(),
       Content: `  點我 <a ng-reflect-router-link="/inventory-action/${x.id}" class="nav-link text-dark"  href="/inventory-action/${x.id}"><span class="badge badge-success">${x.id}</span></a>`,
       Read: false,
       Jaction:'/inventory-action',
       Jid: x.id,
       isOpen:false
     };

     await this.afs.collection(`messages/${uid}/msgs`).add(mm);

   });




   console.log(workorder);

   let wo =   this.WorkOrders.getValue();
   console.log(workorder);
   this.WorkOrders.next( [...wo, workorder]);
   p.forEach(async tb => {
     try {
       console.log(tb);
       let oitems = [...tb.items]
       delete tb.items;
       let rtab = await x.collection("Tabs").add(tb);
       let pitem= oitems.filter(o => !o.UserId).map((o, ii) => {
         o.Fsn = ii;
         o.StateId = "";
         return rtab.collection("items").doc(o.id).set(o);
       });
       let done = await Promise.all(pitem);

       //oitems.forEach(async( o,ii) => {
       //  o.Fsn = ii;
       //  o.StateId = "";
       //  if (!o.UserId) {
       //    await rtab.collection("items").doc(o.id).set(o);
       //  }
       //});

     } catch (ex) {
       console.log(ex);
     }




   });
    

    //k.add({
    //  Users: this.Users,
    //  Tabs: p
    //})
     



    this.tabs = [];
  }


  press(d: { Name: string; checked: boolean; }[], f: NgModel) {
    this.Users = this.users.filter(o => o.checked).map(o => o.Name).join(",");
    this.uids = this.users.filter(o => o.checked).map(o => o.Uid);
  }
  addNewTab(): void {
    const newTabIndex = this.tabs.length + 1;
    var r = Math.floor(Math.random() * 100);
    this.tabs.forEach(o => o.active = false);

    this.tabs.push({
      title: `Dynamic Title ${newTabIndex}(${this.AssetName})`,
      content: `Dynamic content ${newTabIndex}`,
      disabled: false,
      active: true,
      removable: true,
      wayrole: "存在",
      items: new BehaviorSubject(Array.from(Array(r).keys()).map((x ,i)=> {

        return <ISubInventory>{
          id: UUID.UUID(),

          AssetSn: i< lss.length ? lss[i] : UUID.UUID(),
          BelongingsSn: UUID.UUID(),
          AssetName: this.AssetName,
          PlaceIn: UUID.UUID(),


          InventoryDate: null,
          BuyDate: null,
          UserId: null,

        }

      })
      )
    });









  }
  reInitTab(tb: ITabdemo) {
    if (tb.wayrole == '存在') {
      delete tb.Status
    } else {
      tb.Status = [{ Name: '' }, { Name: 'A' }, { Name: 'B' }]
    }
  }
  addStatus(tb: ITabdemo, p: { Name: string }) {
    tb.Status = [...tb.Status, p];
    tb.Status = [...new Set(tb.Status.map(p => p.Name))].map(p => { return { Name: p } });

  }
  spStatus(tb: ITabdemo, i) {
    tb.Status.splice(i, 1);
  }

  removeTabHandler(tab: any): void {
    this.tabs.splice(this.tabs.indexOf(tab), 1);
    console.log('Remove Tab handler');
  }
  redit(pr: ITabdemo, i: number) {
   // pr.items.pipe(take(1)).subscribe((p) => {

    var p = pr.items.getValue();
    if (!p[i].UserId) {
      p[i].UserId = "Ark";
      interval(500).pipe(take(1)).subscribe(y => {
        p.push(p[i]); p.splice(i, 1);;

        pr.items.next(p);

      });

    } else {
      p[i].UserId = null;
    }
    //});

    //if (!p.items[i].UserId) {
    //  p.items[i].UserId = "Ark";
    //console.log(p.items[i]);
    //setTimeout(() => {
    //  p.items.push(p.items[i]);
    //  p.items.splice(i, 1);

    //  //p.items = this.change(p.items, p.items.length - 1, i);
    //  // console.log(p);
    //}, 500)
    //}

  }
  change(old_array: any[], old_index: number, new_index: number) {

    return old_array.map((item, index, array) => {
      if (index === old_index) return array[new_index];
      else if (index === new_index) return array[old_index];
      else return item;
    });

  }


  ngOnInit() {
  }

}
