import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { Element } from '@angular/compiler';
import { AuthService } from '../Service/auth.service';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  afAuth: AngularFireAuth;
  title: string;
  authService: AuthService
  constructor(public bsModalRef: BsModalRef) {

  }
  tarx(s: string, p: HTMLInputElement) {
     
    p.type = s == 'd' ? 'text' : 'password'

     
  }
  async login(s: string, value) {
    let pu: Promise<firebase.auth.UserCredential>;

    switch (s) {
      case "google":
        pu=  this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider());

        break;
      default:
        let { email, password } = value;
        pu = this.authService.login(email, password) 

        break
    }
    pu.then(p => {
      this.bsModalRef.hide();
      console.log(this.afAuth.auth);


    }).catch(err => alert(err));
    //try {
    //  let p = await pu;
    //  console.log(p);
    //  this.bsModalRef.hide();
    //} catch (e) {
    //  alert(e);
    //}
    
  }
  logout() {
    this.afAuth.auth.signOut();
  }
  tryRegister(value: { email: string, password: string }) {
    let { email, password } = value;
    this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        console.log(res);
        this.afAuth.auth.signInWithEmailAndPassword(email, password).then(user => {
          this.bsModalRef.hide();
        }).catch(err => {
          console.log(err);
          alert(err);

        }) 
      }, err => {
        console.log(err);
        alert(err);

      });
  }

  ngOnInit() {
  }
  
}
