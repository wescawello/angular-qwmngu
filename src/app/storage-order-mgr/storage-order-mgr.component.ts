import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { TRestfulService } from '../Service/t-restful.service';
import { setTheme } from 'ngx-bootstrap/utils';
import { StorageOrder } from '../Model/storage-order';
import { StorageOrderDetialComponent } from '../storage-order-detial/storage-order-detial.component';
import { ObClass } from '../Model/ob-class';

@Component({
  selector: 'app-storage-order-mgr',
  templateUrl: './storage-order-mgr.component.html',
  styleUrls: ['./storage-order-mgr.component.css']
})
export class StorageOrderMgrComponent implements OnInit {
  ctrlname: string = "StorageOrders";
  modalRef: BsModalRef | null;
  ob: ObClass<StorageOrder>;

  constructor(private ds: TRestfulService, private modalService: BsModalService ) {
    setTheme('bs4');
   
  }
  ngOnInit() {
    var fds = [
      { "StorageList": [], "StorageSn": "A20190709001", "DepotSn": "02008", "DepotName": "物流解決方案課", "BuyDate": new Date(), "StorageType": 5, "Remark": "gfdg", "CreateDate": new Date() }
    ];
    this.ob = new ObClass(<StorageOrder[]>fds, new StorageOrder());
  }
  openModal(s: string, el: StorageOrder=new StorageOrder()) {
 
    this.ob.refobj$.next(el);

 
    switch (s) {
      case "Add":
        var objf = new StorageOrder();
        this.ob.refobj$.next(objf);
        //let initialState = ;
        this.modalRef = this.modalService.show(StorageOrderDetialComponent, Object.assign({
          initialState: {
            ds: this.ds,
            ob: this.ob,
            refobj: objf,
            title: 'Modal with component',
            actionName: s, closeBtnName: "Close"
          }
        }, { class: 'modal-lg' }));
        break;
      case "Edit":
        //this.ds.GetUrlMap(emp.Id).subscribe(e => {
          //let initialState = {
          //  dataservice: this.ds,
          //  refobj: el,
          //  title: 'Modal with component',
          //  actionName:s, closeBtnName: "Close"
          //};
        this.modalRef = this.modalService.show(StorageOrderDetialComponent, Object.assign({
          initialState: {
            ds: this.ds,
            ob: this.ob,
            refobj: el,
            title: 'Modal with component',
            actionName: s, closeBtnName: "Close"
          }
        }, { class: 'modal-lg' }));
        //});
        break;
      default:
        break;

    }


  }
  deleteconfirmation(el: StorageOrder) {
      if (confirm("Are you sure you want to delete this ?")) {
        this.ds.del(this.ctrlname, el, ["StorageSn"]).subscribe(res => {
          alert("Deleted successfully !!!");
          this.ds.getAll<StorageOrder>(this.ctrlname).subscribe(data => {
            this.ob.data$.next(data);
          });
        });
        this.ob.data$.subscribe(data => {
          data = data.filter(r => r.StorageSn != el.StorageSn);
          this.ob.data$.next(data);


        });
      }
  }
}
