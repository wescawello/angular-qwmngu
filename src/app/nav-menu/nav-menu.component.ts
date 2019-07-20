import { Component ,AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RegisterComponent } from '../register/register.component';
import { AngularFireAuth } from '@angular/fire/auth';
import { tap, throttle, debounceTime } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { fromEvent, interval, Subscription } from 'rxjs';
import { AuthService } from '../Service/auth.service';
import {   Router } from '@angular/router';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.css']
})
export class NavMenuComponent  implements  AfterViewInit{
 
  modalRef: BsModalRef;
  @ViewChild('fortrace', { static: false })
  fortrace: ElementRef;
  subscribeScoll: Subscription;
    addsticky: boolean;
 
  constructor(public modalService: BsModalService, public afAuth: AngularFireAuth, private afs: AngularFirestore, public authService: AuthService, private router: Router) {

  }

  isExpanded = false;
  title = "資產盤點系統";

  //onWindowScroll() {
  //  this.addsticky = window.pageYOffset >= 250;
  //}
  ngAfterViewInit() {

    
  }
  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    if (getComputedStyle(this.fortrace.nativeElement).display != 'none') {
      this.isExpanded = !this.isExpanded;
    }
  }
  logout() {
    localStorage.removeItem('ctoken');
    console.log("cl localStorage");
    this.router.navigate(['/'], { replaceUrl: true });
    this.afs.doc(`users/${this.afAuth.auth.currentUser.uid}`).update({
      offlineDate: new Date(), State:'offline'
    }).then(() => {

      this.afAuth.auth.signOut().then(() => {

       
      });
    });

  }
  login() {
     
    this.modalRef = this.modalService.show(RegisterComponent, Object.assign({
      initialState: {
        afAuth: this.afAuth,
        title: 'Login',
        actionName: 'login', closeBtnName: "Close",
        authService: this.authService
      }
    }, { class: 'modal-dialog-centered' }));
  }


}
