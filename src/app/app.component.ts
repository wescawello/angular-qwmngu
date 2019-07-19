import { Component, ChangeDetectorRef, AfterViewChecked} from '@angular/core';
import { fromEvent, interval, timer } from 'rxjs';
import { debounceTime, throttle, filter} from 'rxjs/operators';
import { LayoutHelpService } from './Service/layout-help.service';
 
 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements   AfterViewChecked{
    ngAfterViewChecked(): void {
      this.cdRef.detectChanges();
    }
  title = 'ClientApp';
  isSticky: boolean = false;
  connn = true;
  constructor(public ly: LayoutHelpService, private cdRef: ChangeDetectorRef) {
    var scrollPos = 0;
     
    fromEvent(window, 'scroll').pipe(
      debounceTime(50),
      throttle(ev => interval(50)),
      filter(p => this.connn)

    ).subscribe((event) => {
      //console.log('ddd');
      if (ly.showNav.getValue()) {
        let currtop = document.body.getBoundingClientRect().top;
        this.connn = false;

        this.isSticky = !(currtop > scrollPos || currtop == 0);
        scrollPos = currtop;

        timer(100).subscribe(p => {
          this.connn = true;

        })
        //this.isSticky = window.pageYOffset >= 50;
       // console.log(scrollPos);
      }
 

      });

  }
     
  handleInactivityCallback(g:boolean) {
    console.log('idle');
  }
}
