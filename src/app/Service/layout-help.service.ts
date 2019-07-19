import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LayoutHelpService {
  showNav: BehaviorSubject<boolean> = new BehaviorSubject(true)
  constructor() { }
  setNav(s: boolean) {
    this.showNav.next(s);
  }
}
