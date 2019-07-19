import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TransList } from '../Model/trans-list';
import { of, Observable, BehaviorSubject, Subscription } from 'rxjs';
import { ObClass } from '../Model/ob-class';
import { filter, map, share } from 'rxjs/operators';

@Component({
  selector: 'app-trans-action',
  templateUrl: './trans-action.component.html',
  styleUrls: ['./trans-action.component.css']
})
export class TransActionComponent implements OnInit {
  max: number = 200;
  showWarning: boolean;
  dynamic: number;
  type: string;
  refobj: TransList;
  optarget: string;
  picker: string;

  Fruits: IFruit[] = [
    { name: 'Apple', selected: false },
    { name: 'Panapple', selected: false },
    { name: '香蕉煎餅', selected: false },
    { name: '芭樂', selected: false },
    { name: '橘子', selected: false },
    { name: '浪榴槤', selected: false },
  ]
 

  ObDo =<FT[]> [
    { From: 50, To: 33 },
    { From: 57, To: 0 },
    { From: 54, To: 83 },
    { From: 57, To: 63 },
    { From: 37, To: 33 },
    { From: 57, To: 44 },
    { From: 157, To: 5 },
    { From: 57, To: 453 },
    { From: 57, To: 433 },
    { From: 27, To:33 },
    { From: 7, To: 433 },
  ];
    ObDo$:  BehaviorSubject<FT>;
    Dx: FT;
  Fruits$: BehaviorSubject<IFruit[]>;
  Fruits$$: BehaviorSubject<IFruit[]>;
    allAmt: number;
 
  constructor() { }
  transList: TransList[] = [];
   
  ngOnInit() {
    this.refobj = new TransList();
    var ob = new ObClass<FT>([], { From: 55, To: 100, Max: 155 });
    this.ObDo.map(p => p.Max = p.From + p.To);
    this.ObDo$ = ob.refobj$;

    this.Fruits$ = new BehaviorSubject<IFruit[]>([]);
    this.Fruits$$ = new BehaviorSubject<IFruit[]>([]);
    this.Fruits$.pipe(
      share(),
      map(p => p.filter(pp => pp.selected)),
      map(p => p.map(pp => {
        pp.range = {
          From: Math.floor(Math.random() * 200 + 1),
          To: Math.floor(Math.random() * 200 + 1),
        }
        return pp;
      }
      )),
      map(p => p.map(pp => {
        pp.range.fixTo = pp.range.To
        pp.range.Max = pp.range.From + pp.range.To;
        return pp;
      }
      ))


    ).subscribe(o => {

      this.Fruits$$.next(o)
      });

     
    
  }
  SubmitDetail(regForm: NgForm) {
    if (regForm.valid) {

      let kk = this.Fruits$$.getValue().filter(p => (p.randerobj && p.randerobj.Amt)).map<TransList>(p => {
          return {
            FromDepot: p.randerobj.FromUnit,
            ToDepot: p.randerobj.ToUnit,
            CreateDate: new Date(),
            CreateUser: 'Ark',
            Amount: p.randerobj.Amt,
            AssetName: p.name,
            UpdateDate: null,
            UpdateUser: null
          }
      });
      console.log(kk);
      this.transList.push(...kk);
      this.Fruits$$.next([]);
      this.allAmt = 0;

   


      this.random();

      this.refobj.Amount = 0;
      this.refobj.AssetName = ''


    }
    
  }
  random(): void {
    let value = 0; Math.floor(Math.random() * 100 + 1);
    let type: string;

    if (value < 25) {
      type = 'success';
    } else if (value < 50) {
      type = 'info';
    } else if (value < 75) {
      type = 'warning';
    } else {
      type = 'danger';
    }

    this.dynamic = value;
    setTimeout(() => {

      this.dynamic = 100;
       

    }, 300)
    this.type = type;
  }

  deleteconfirmation(e, i:number) {
    this.transList.splice(i, 1);

  }
  FTchange(dx: FT) {
    //this.ObDo$.subscribe(p => {
    setTimeout(() => {

      this.refobj.Amount = dx.To - this.Dx.To;

      //});

      dx.fixTo = dx.To;
      dx.From = dx.Max - dx.To;
      //this.ObDo$.next(dx);
      console.log(dx.From);
      console.log(dx.To);

    }, 50);
  
  }
  Ablur() {
      let p=Math.floor(Math.random() * 10 + 1)
    console.log(p);
   // this.ObDo[p].Max = this.ObDo[p].From + this.ObDo[p].To;
    this.ObDo$.next(null);
    setTimeout(() => {
      this.ObDo$.next(this.ObDo[p]);
      this.Dx = Object.assign({}, this.ObDo[p]);
    },50)


  }
  OBFruit() {
     this.Fruits$.next(this.Fruits);

    this.refobj.AssetName = this.Fruits$$.getValue().map(o => o.name).join(',');
  }
  fixrange(f: IFruit) {
    let amt = f.range.fixTo - f.range.To;
    f.randerobj = {
      FromUnit: amt > 0 ? this.refobj.FromDepot : this.refobj.ToDepot,
      ToUnit: amt <= 0 ? this.refobj.FromDepot : this.refobj.ToDepot,
      Amt: Math.abs( amt)
    }
    let {FromUnit, ToUnit, Amt} =  f.randerobj;
    f.randerstr = `${FromUnit}==>${ToUnit}  Amt:${Amt}`;
    this. allAmt = 0;
    this.allAmt = this.Fruits$$.getValue().some(p => p.range.fixTo - p.range.To != 0) ? 1 : 0;
    console.log(this.allAmt);

  }
}

interface FT {

  Max?: number;
  From: number
  To: number;
  fixTo?: number;
}

interface IFruit {

  name: string;
  selected: boolean;
  range?: FT;
  randerobj?: any;
  randerstr?: string;
} 
