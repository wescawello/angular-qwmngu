import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class MyProfileComponent implements OnInit {
    photoURL$= new BehaviorSubject<string>(null);
  ufile$ = new BehaviorSubject<File>(null);

  constructor(private afAuth: AngularFireAuth,private afstore :AngularFireStorage) { }
  x: any = {};
  ngOnInit() {
  }
  async chpwd(s) {
    try {

    await this.afAuth.auth.currentUser.updatePassword(s);
    alert(`Done ! new password login next time !`)
    } catch (e) {
      alert(e)

    }

  }
  resizedataURL(datas, wantedWidth, wantedHeight) {
    return new Promise<string>(async function (resolve, reject) {

      // We create an image to receive the Data URI
      var img = document.createElement('img');

      // When the event "onload" is triggered we can resize the image.
      img.onload = function () {
        // We create a canvas and get its context.
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        // We set the dimensions at the wanted size.
        canvas.width = wantedWidth;
        canvas.height = wantedHeight;

        // We resize the image with the canvas method drawImage();
        ctx.drawImage(img, 0, 0, wantedWidth, wantedHeight);

        var dataURI = canvas.toDataURL();

        // This is the return of the Promise
        resolve(dataURI);
      };

      // We put the Data URI in the image's src attribute
      img.src = datas;

    })
  }








  async chphoto(e: Event) {
    let p = <HTMLInputElement> e.target;
    let f = p.files[0];
    
    var reader = new FileReader();
    // Closure to capture the file information.
    reader.onload = (  (theFile) =>{
      return (e) => {
        // Render thumbnail.
        //e.target.result
        this.resizedataURL(e.target.result, 30, 30).then(xx => {
          this.photoURL$.next(xx);
          this.ufile$.next(f)

        });






      };
    })(f);
    // Read in the image file as a data URL.
    reader.readAsDataURL(f);



  }

  async chphotox() {
    console.log(this.photoURL$.getValue());
    try {
      await this.afAuth.auth.currentUser.updateProfile({ photoURL: this.photoURL$.getValue() });
      alert(`Done ! new pic`);
    } catch (e) {
      let ref = this.afstore.ref(`user/${this.afAuth.auth.currentUser.uid}`)
      let h = ref.put(this.ufile$.getValue());
      let u= await ref.getDownloadURL().toPromise();
      await this.afAuth.auth.currentUser.updateProfile({ photoURL: u});

     
      alert(u);

    }

  }


  async chdisplayName(s) {
    await this.afAuth.auth.currentUser.updateProfile({ displayName :s});
    alert(`Done ! ${s}`)
  }

  tarx(s: string, p: HTMLInputElement ) {

      p.type = s == 'd' ? 'text' : 'password'


  }
  
}
