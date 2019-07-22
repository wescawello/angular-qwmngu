import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { BehaviorSubject, merge, Observable, Subject, fromEvent, observable, of, Subscription } from 'rxjs';
import { tap, map, filter, take, takeUntil, bufferTime, switchMap, distinctUntilChanged, delay } from 'rxjs/operators';
import { IMessage } from '../Model/commonModel';
import { Router } from '@angular/router';
import { isArray } from 'ngx-bootstrap';
import { User } from '../models/user.model';

type vf = firebase.User & { Status: string }
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  AllUser$ = new BehaviorSubject<User[]>([]);
  CurrUser$ = new BehaviorSubject<User>(null);
  Messages$ = new BehaviorSubject<(IMessage & { xid: string })[]>([]);
  UnReadMessagesCount$ = new BehaviorSubject<number>(0);
  sMsgs$: Observable<(IMessage & { xid: string })[]>;
  refAllUser$: Observable<User[]>;
  useronline$ = new BehaviorSubject(true);

  private _ngUnsubscribe = new Subject();
  emitoff: boolean = true;
  idleaction: Observable<Event[]>;



  authState: firebase.auth.UserCredential;
  currentUserId: string;
  user$: Observable<any>;
    randomId: string;
  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore, private router: Router) {
    this.randomId = Math.random().toString(36).substring(2);
    this.afAuth.authState.pipe(tap(async auth => {
      console.log("dasdsadasd",auth);
      if (auth) {
        this.currentUserId = auth.uid;
        if (!auth.displayName) {
          await auth.updateProfile({ displayName: auth.email.split('@')[0] });
        }
        await this.updateUserData(auth, this.randomId);
        localStorage.setItem('ctoken', await auth.getIdToken());
      } else {
        this.currentUserId = "";
        let ctoken = localStorage.getItem('ctoken')
        if (ctoken) {
          let c = await this.afAuth.auth.signInWithCustomToken(ctoken);
          await this.updateUserData(c.user,this.randomId);
          console.log('hgfhgfhhfgh',c.user);
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

          this.refAllUser$ = this.afs.collection<User>(`users`).valueChanges()
            .pipe(delay(3000),
              takeUntil(this._ngUnsubscribe));
          this.refAllUser$.subscribe(async o => {
            this.AllUser$.next(o);
            if (afAuth.auth.currentUser) {
              let g = this.CurrUser$.getValue();
              //console.log(g);
              this.CurrUser$.next(o.find(p => p.uid == afAuth.auth.currentUser.uid));

              if (g) {
                let gid = g.randomId;
                if (this.CurrUser$.getValue().randomId != this.randomId && gid != this.randomId) {
                  console.log(this.CurrUser$.getValue().randomId, g, this.randomId);
                  console.log("other blowser login");
                  localStorage.removeItem('ctoken');
                  await this.afAuth.auth.signOut();
                }
              }
              
            }
          });

          this.sMsgs$.subscribe(o => {
            if (this.Messages$.getValue().length == 0) {
              o = o.map(o => ({ ...o, isOpen: false }))
            }
            this.Messages$.next(o);
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
      this.UnReadMessagesCount$.next(o.filter(p => !p.Read).length);
    });
    this.CurrUser$.pipe(tap(o => {
      if (o) {
        this.emitoff = o.Status == "online";
        if (this.emitoff != this.useronline$.getValue()) {
          //console.log(this.emitoff);
          this.useronline$.next(this.emitoff);

        }
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
    this.useronline$.pipe(distinctUntilChanged(),
      switchMap(b => {
        let exitaction = merge(...['keydown', 'click', 'mousemove', 'touchstart', 'scroll'].map(o => fromEvent(document, o)));

        if (b)
          return exitaction.pipe(bufferTime(15 * 1000), filter(arr => arr.length === 0), takeUntil(this._ngUnsubscribe))
        else 
          return exitaction.pipe(take(1), takeUntil(this._ngUnsubscribe))

      })).subscribe(async x => await this.onoffFn(x));
  }

  async onoffFn(x) {
    console.log('fdsfsdf', isArray(x) ? "offline" : "online");
    isArray(x) ? console.log(new Date(), 'idle after', 15, 's', x) : console.log(new Date(), 'not idle');
    return await this.setUserStatus(isArray(x) ? "offline" : "online")
  }

  //offFn(x) {
  //  console.log(new Date(), 'idle', 'after', 15, 's', x);
  //  //return Promise.resolve();
  //  return this.setUserStatus("offline");
  //}
  //onFn(x) {
  //  console.log(new Date(), 'not idle');
  //  return this.setUserStatus("online");
  //}


  login(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(async (credential) => {
        this.authState = credential;

        //this.setUserStatus('online');
        //this.router.navigate(['chat']);
        return credential;
      });
  }
  private updateUserData({ uid, email, displayName, photoURL }, randomId) {
    const userRef = this.afs.doc(`users/${uid}`);
    const data: User = {
      randomId,
      uid,
      email,
      displayName,
      photoURL,
      Status:'online',
      onlineDate: new Date()
    };
    return userRef.set(data, { merge: true });
  }
  logout() {
    this.afAuth.auth.signOut();
    //this.router.navigate(['login']);
  }
  setUserStatus(status: string) {
    if (this.currentUserId) {
      const path = `users/${this.currentUserId}`;
      const data = {
        Status: status
      };
      return this.afs.doc(path).update(data);
    } else {
      return Promise.resolve();
    }
    
  }
}
