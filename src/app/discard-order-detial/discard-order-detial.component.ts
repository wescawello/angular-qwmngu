import { Component, OnInit, ViewChild } from '@angular/core';
import { DiscardOrder } from '../Model/discard-order';
import { ModalDirective, BsModalRef } from 'ngx-bootstrap/modal';
import { ObClass } from '../Model/ob-class';
import { TRestfulService } from '../Service/t-restful.service';
import { DiscardList } from '../Model/discard-list';
import { NgForm } from '@angular/forms';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'app-discard-order-detial',
  templateUrl: './discard-order-detial.component.html',
  styleUrls: ['./discard-order-detial.component.css']
})
export class DiscardOrderDetialComponent implements OnInit {

  refobj: DiscardOrder;
  actionName: string;
  listactionName: string;
  closeBtnName: string;
  ob: ObClass<DiscardOrder>;
  ds: TRestfulService;
  @ViewChild('largeModal', { static: false }) public largeModal: ModalDirective;
  refSubObj: DiscardList = <DiscardList>{};
  tmpSubObj: DiscardList;
  editIndex: number;

  constructor(public bsModalRef: BsModalRef) {

  }

  ngOnInit() {
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
            this.refobj = Object.assign(new DiscardOrder(), regForm.value);
            this.refobj.UpdateDate = new Date();
            var g = data.find(d => d.DiscardSn == this.refobj.DiscardSn);
            Object.assign(g, this.refobj)
            //g = this.refobj
            this.ob.data$.next(data);

            //data.forEach((d,i,o) => {
            //  if (d.DiscardSn == this.refobj.DiscardSn) {
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
        let subobj = Object.assign(new DiscardList(), regForm.value);
        subobj.CreateDate = new Date();
        this.refobj.DiscardList.push(subobj);
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
        //    this.refobj //= Object.assign(new DiscardOrder(), regForm.value);
        //    this.refobj.UpdateDate = new Date();
        //    var g = data.find(d => d.DiscardSn == this.refobj.DiscardSn);
        //    Object.assign(g, this.refobj)
        //    //g = this.refobj
        //    this.ob.data$.next(data);

        //    //data.forEach((d,i,o) => {
        //    //  if (d.DiscardSn == this.refobj.DiscardSn) {
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

  openModal(s: string, el: DiscardList | any, i: number
   // , pel: DiscardOrder
  ) {
    this.editIndex = i;
    switch (s) {
      case "Add":
        this.ob.refobj$.pipe(take(1), map(data => <DiscardOrder>data)).subscribe(p => {
          this.refSubObj = (Object.assign({}, el));
          this.refSubObj.DiscardSn = p.DiscardSn;
          p.DiscardList = p.DiscardList || [];
          this.ob.refobj$.next(p);
        });




        break;
      case "Edit":
        this.tmpSubObj = Object.assign({}, el);
        this.refSubObj = Object.assign({}, el);


        break;
      case "Save":
        this.ob.refobj$.pipe(take(1), map(data => <DiscardOrder>data)).subscribe(p => {
          if (this.listactionName == "Add") {

            p.DiscardList.push(this.refSubObj)

            //this.refobj.DiscardList.push(this.refSubObj)
          } else {


            p.DiscardList[this.editIndex] = this.refSubObj;


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
  deleteconfirmation(el: DiscardList, i) {
    this.refobj.DiscardList.splice(i, 1);

  }

  TakeHome() {
    //this.dataservice.refdata();
    this.bsModalRef.hide();
  }

}
