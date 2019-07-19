import { Component, OnInit, ViewChild } from '@angular/core';
import { StorageOrder } from '../Model/storage-order';
import { TRestfulService } from '../Service/t-restful.service';
import { BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { ObClass } from '../Model/ob-class';
import { NgForm } from '@angular/forms';
import { take, map, switchMap } from 'rxjs/operators';
import { StorageList } from '../Model/storage-list';
@Component({
  selector: 'app-storage-order-detial',
  templateUrl: './storage-order-detial.component.html',
  styleUrls: ['./storage-order-detial.component.css']
})
export class StorageOrderDetialComponent implements OnInit {
  refobj: StorageOrder;
  actionName: string;
  listactionName: string;
  closeBtnName: string;
  ob: ObClass<StorageOrder>;
  ds: TRestfulService;
  @ViewChild('largeModal', { static: false }) public largeModal: ModalDirective;
  refSubObj: StorageList = <StorageList> {};
    tmpSubObj: StorageList;
    editIndex: number;

  constructor(public bsModalRef: BsModalRef) {
    console.log('jj');
  }

  ngOnInit() {

    console.log(  this.ob);

  }

  SubmitDetail(regForm: NgForm) {

    switch (this.actionName) {
      case "Add":

        this.ob.refobj$.pipe(take(1)).subscribe(p => {
          this.refobj = Object.assign(p, regForm.value);
          this.refobj.CreateDate = new Date();
          this.ob.data$.pipe(
            take(1)).subscribe(data => {
              data.push(this.refobj);
              alert("UrlMap Added successfully");
              this.ob.data$.next(data);
              this.TakeHome();
            });
        });

  
        // this.refobj.Id = 0;

        

        break;
      case "Edit":
        this.ob.data$.pipe(
          take(1)).subscribe(data => {
          this.refobj = Object.assign(new StorageOrder(), regForm.value);
          this.refobj.UpdateDate = new Date();
         var g= data.find(d => d.StorageSn == this.refobj.StorageSn);
          Object.assign(g, this.refobj)
          //g = this.refobj
          this.ob.data$.next(data);

          //data.forEach((d,i,o) => {
          //  if (d.StorageSn == this.refobj.StorageSn) {
          //    o[i] = this.refobj;
               
          //  }     
          //});

          alert("UrlMap updated successfully");
          this.TakeHome();
        });
        break;
      default:
        break;

    }


  }

  SubmitList(regForm: NgForm) {
    switch (this.listactionName) {
      case "Add":
        let subobj = Object.assign(new StorageList(), regForm.value);
        subobj.CreateDate = new Date();
        this.refobj.StorageList.push(subobj);
        // this.refobj.Id = 0;

        //this.ob.data$.pipe(
        //  take(1)).subscribe(data => {
        //    data.push(this.refobj);
        //    alert("UrlMap Added successfully");
        //    this.ob.data$.next(data);
        //    this.TakeHome();
        //  });

        break;
      case "Edit":

        //this.ob.data$.pipe(
        //  take(1)).subscribe(data => {
        //    this.refobj //= Object.assign(new StorageOrder(), regForm.value);
        //    this.refobj.UpdateDate = new Date();
        //    var g = data.find(d => d.StorageSn == this.refobj.StorageSn);
        //    Object.assign(g, this.refobj)
        //    //g = this.refobj
        //    this.ob.data$.next(data);

        //    //data.forEach((d,i,o) => {
        //    //  if (d.StorageSn == this.refobj.StorageSn) {
        //    //    o[i] = this.refobj;

        //    //  }     
        //    //});

        //    alert("UrlMap updated successfully");
        //    this.TakeHome();
        //  });
        break;
      default:
        break;

    }

    this.largeModal.hide();

  }

  openModal(s: string, el: StorageList,i:number ) {
    this.editIndex = i;
    switch (s) {
      case "Add":
        this.ob.refobj$.pipe(take(1), map(data =>  <StorageOrder>data )).subscribe(p => {
          this.refSubObj = (Object.assign({},  el));
          this.refSubObj.StorageSn = p.StorageSn;
          p.StorageList = p.StorageList || [];
          this.ob.refobj$.next(p);
        });
  
        


        break;
      case "Edit":
        this.tmpSubObj = Object.assign({}, el);
        this.refSubObj = Object.assign({}, el);


        break;
      case "Save":
        this.ob.refobj$.pipe(take(1), map(data => <StorageOrder>data)).subscribe(p => {
          if (this.listactionName == "Add") {

            p.StorageList.push(this.refSubObj)

            //this.refobj.StorageList.push(this.refSubObj)
          } else {


            p.StorageList[this.editIndex] = this.refSubObj;


          }

          this.ob.refobj$.next(p);
        });

       

        break;
      default:

        break;
    }
    this.listactionName = s;


    this.largeModal.toggle();

  }
  deleteconfirmation(el: StorageList,i) {
    this.refobj.StorageList.splice(i, 1);

  }

  TakeHome() {
    //this.dataservice.refdata();
    this.bsModalRef.hide();
  }
}
