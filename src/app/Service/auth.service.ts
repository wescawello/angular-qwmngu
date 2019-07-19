import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, merge, Observable, Subject, fromEvent, observable, of, Subscription } from 'rxjs';
import { tap, map, filter, takeUntil, bufferTime, switchMap } from 'rxjs/operators';
import { IMessage } from '../Model/commonModel';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  AllUser$ = new BehaviorSubject<firebase.User[]>([]);
  CurrUser$ = new BehaviorSubject<firebase.User>(null);
  Messages$ = new BehaviorSubject<(IMessage & { xid: string })[]>([]);
  UnReadMessagesCoun$t = new BehaviorSubject<number>(0);
  sMsgs$: Observable<(IMessage & { xid: string })[]>;
  refAllUser$: Observable<firebase.User[]>;
  private _ngUnsubscribe = new Subject();
  emitoff: boolean = true;
  idleaction: Observable<Event[]>;
  rewait: Subscription;
  authState: firebase.auth.UserCredential;
  currentUserId: string;
  user$: Observable<any>;
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this.afAuth.authState
      .pipe(
        tap(async auth => {
          if (auth) {
            this.currentUserId = auth.uid;

            if (!auth.displayName) {
              auth.updateProfile({ displayName: auth.email.split('@')[0] });
            }
            localStorage.setItem('ctoken', await auth.getIdToken());



            // uid is defined
          } else {
            let ctoken = localStorage.getItem('ctoken')
            console.log(ctoken);
            if (ctoken) {
              let c = await this.afAuth.auth.signInWithCustomToken(ctoken);
              await this.updateUserData(c.user);
            }
          }
        }))
      .subscribe((auth) => {
        console.log(auth);
        if (auth) {
          this._ngUnsubscribe = new Subject();
          this.sMsgs$ = this.afs.collection<IMessage>(`messages/${auth.uid}/msgs`, ref => ref.orderBy("CreateDate", "asc")).valueChanges({ idField: 'xid' })
            .pipe(
              takeUntil(this._ngUnsubscribe),
              map(o => o.map(o =>
                ({
                  ...o,
                  CreateDate: (<firebase.firestore.Timestamp>o.CreateDate).toDate(),
                  ReadDate: o.ReadDate ? (<firebase.firestore.Timestamp>o.ReadDate).toDate() : null,
                  SenderName: this.AllUser$.pipe(map(x => x.find(y => y.uid == o.SenderId).displayName)),
                  setRead: async (x: boolean) => {
                    console.log('eee');
                    if (!o.Read) {
                      await this.afs.doc<IMessage>(`messages/${auth.uid}/msgs/${o.xid}`).update({ ReadDate: new Date(), Read: true, isOpen: x });
                    } else {
                      if (o.isOpen != x) {
                        await this.afs.doc<IMessage>(`messages/${auth.uid}/msgs/${o.xid}`).update({ isOpen: x });
                      }

                    }
                  },
                  del: async () => await this.afs.doc<IMessage>(`messages/${auth.uid}/msgs/${o.xid}`).delete()

                })
              ))
            );

          this.refAllUser$ = this.afs.collection<firebase.User>(`users`).valueChanges()
            .pipe(
              takeUntil(this._ngUnsubscribe));
          this.refAllUser$.subscribe(o => {
            this.AllUser$.next(o);
            if (afAuth.auth.currentUser) {
              this.CurrUser$.next(o.find(p => p.uid == afAuth.auth.currentUser.uid));
            }
          });

          this.sMsgs$.subscribe(o => {
            if (this.Messages$.getValue().length == 0) {
              o = o.map(o => ({ ...o, isOpen: false }))
            }
            this.Messages$.next(o);
          });



          let exitaction = merge(...['keydown', 'click', 'mousemove', 'touchstart', 'scroll'].map(o => fromEvent(document, o)));

          this.idleaction = exitaction.pipe(bufferTime(15 * 1000), filter(arr => arr.length === 0 && this.emitoff), takeUntil(this._ngUnsubscribe));

          this.rewait = this.idleaction.subscribe(async x => await this.offFn(x));
          exitaction.pipe(filter(f => !this.emitoff), takeUntil(this._ngUnsubscribe)).subscribe(async x => {
            this.emitoff = true;
            console.log(new Date(), 'not idle');
            //this.idleaction = this.idleaction.pipe(bufferTime(15 * 1000));
            await this.setUserStatus("online");
            this.rewait.unsubscribe();
            this.rewait = this.idleaction.subscribe(async x => await this.offFn(x));
          });




        } else {
          this._ngUnsubscribe.next();
          this._ngUnsubscribe.complete();


          this.Messages$.next([]);
          this.AllUser$.next([]);
          this.CurrUser$.next(null)

        }

      });
    this.Messages$.subscribe(o => {
      //console.log(o.filter(p => !p.Read).length);




      this.UnReadMessagesCoun$t.next(o.filter(p => !p.Read).length);
    });
    this.CurrUser$.pipe(tap(o => {
      if (o) {

        this.emitoff = Object.values(o).includes("online")
      }

      //
    })).subscribe();

    this.user$ = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<any>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async offFn(x) {
    this.emitoff = false;
    console.log(new Date(), 'idle', 'after', 15, 's', x);
    await this.setUserStatus("offline");
  }

  login(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(async (credential) => {
        this.authState = credential;
        await this.updateUserData(credential.user);
        //this.setUserStatus('online');
        //this.router.navigate(['chat']);
        return credential;
      });
  }
  private updateUserData({ uid, email, displayName, photoURL }) {
    const userRef = this.afs.doc(`users/${uid}`);

    const data = {
      uid,
      email,
      displayName,
      photoURL,
      onlineDate: new Date()
    };

    return userRef.set(data, { merge: true });
  }
  logout() {
    this.afAuth.auth.signOut();
    //this.router.navigate(['login']);
  }
  async setUserStatus(status: string) {
    const path = `users/${this.currentUserId}`;

    const data = {
      Status: status
    };

    await this.afs.doc(path).update(data);
      
  }
}
