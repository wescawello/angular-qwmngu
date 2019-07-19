import { Component, OnInit } from '@angular/core';
import { TRestfulService } from '../Service/t-restful.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ObClass } from '../Model/ob-class';
import { DiscardOrder } from '../Model/discard-order';
import { setTheme } from 'ngx-bootstrap/utils';
import { DiscardOrderDetialComponent } from '../discard-order-detial/discard-order-detial.component';

@Component({
  selector: 'app-discard-order-mgr',
  templateUrl: './discard-order-mgr.component.html',
  styleUrls: ['./discard-order-mgr.component.css']
})
export class DiscardOrderMgrComponent implements OnInit {
 

  ctrlname: string = "DiscardOrders";
  modalRef: BsModalRef | null;
  ob: ObClass<DiscardOrder>;

  constructor(private ds: TRestfulService, private modalService: BsModalService) {
    setTheme('bs4');

  }
  ngOnInit(): void {
    var fakedata = [{ "DiscardSn": "wqe", "DepotName": "adasd", "DiscardDate": new Date(), "DiscardList": [{ "DiscardSn": "wqe", "AssetName": "das", "Amount": 5, "ManageType":3, "Remark": "sff" }], "CreateDate":new Date() }];
    this.ob = new ObClass(<DiscardOrder[]>fakedata, null);
   }
  openModal(s: string, el: DiscardOrder) {
    this.ob.refobj$.next(el);

    switch (s) {
      case "Add":
        var objf = new DiscardOrder();
        this.ob.refobj$.next(objf);
        //let initialState = ;
        this.modalRef = this.modalService.show(DiscardOrderDetialComponent, Object.assign({
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
        this.modalRef = this.modalService.show(DiscardOrderDetialComponent, Object.assign({
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
  deleteconfirmation(el: DiscardOrder) {
    if (confirm("Are you sure you want to delete this ?")) {
      this.ds.del(this.ctrlname, el, ["StorageSn"]).subscribe(res => {
        alert("Deleted successfully !!!");
        this.ds.getAll<DiscardOrder>(this.ctrlname).subscribe(data => {
          this.ob.data$.next(data);
        });
      });
      this.ob.data$.subscribe(data => {
        data = data.filter(r => r.DiscardSn != el.DiscardSn);
        this.ob.data$.next(data);


      });
    }
  }

}
