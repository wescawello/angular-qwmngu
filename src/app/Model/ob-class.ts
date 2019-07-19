import { BehaviorSubject } from "rxjs";

 

export class ObClass<T> {
  /*[StringLength(50)]*/


  data$ = new BehaviorSubject<T[]>([]);
  refobj$ = new BehaviorSubject<T>(null);
  constructor(d: T[], s: T) {
    this.data$.next(d);
    this.refobj$.next(s);
  }

}
