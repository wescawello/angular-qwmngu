import { Injectable } from '@angular/core';
 
import { Observable, of, combineLatest } from 'rxjs';
import { AuthService } from '../Service/auth.service';
import * as firebase from 'firebase/app';

 
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { map, switchMap } from 'rxjs/operators'; 
@Injectable({
  providedIn: 'root'
})
export class ChatService {
  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private router: Router
  ) { }

  get(chatId) {
    if (chatId) {
      let oo = this.afs
        .collection<any>('chats')
        .doc(chatId)
        .snapshotChanges()
        .pipe(
          map(doc => {
            return { id: doc.payload.id, ...doc.payload.data() };
          })
        );

      return oo;
    } else {
      return of({ id: "", messages:[]})
    }
  

  }
  getUsers() {
    return this.afs.collection('users').valueChanges();
  }

  async create(s:string) {
    const  uid  =  this.authService.currentUserId;

    const data = {
      uid,
      createdAt: Date.now(),
      title:s,
      count: 0,
      messages: [],
      uids: [uid]
    };
    console.log(data);
    const docRef = await this.afs.collection('chats').add(data);

    return this.router.navigate(['chats', docRef.id]);
  }




  async sendMessage(chatId, content) {
    const uid = this.authService.currentUserId;
    const data = {
      uid,
      content,
      createdAt: Date.now()
    };

    if (uid) {
      const ref = this.afs.collection('chats').doc(chatId);
      return ref.update({
        messages: firebase.firestore.FieldValue.arrayUnion(data)
      });
    }
  }

  joinUsers(chat$: Observable<any>) {
    let chat;
    const joinKeys = {};

    return chat$.pipe(
      switchMap(c => {
        // Unique User IDs
        chat = c;
        const uids = Array.from(new Set(c.messages.map(v => v.uid)));

        // Firestore User Doc Reads
        const userDocs = uids.map(u =>
          this.afs.doc(`users/${u}`).valueChanges()
        );

        return userDocs.length ? combineLatest(userDocs) : of([]);
      }),
      map(arr => {
        arr.forEach(v => (joinKeys[(<any>v).uid] = v));
        chat.messages = chat.messages.map(v => {
          return { ...v, user: joinKeys[v.uid] };
        });

        return chat;
      })
    );
  }
}

//@Injectable()
//export class ChatService {
//  user: firebase.User;
//  chatMessages: AngularFireList <ChatMessage[]>;
//  chatMessage: ChatMessage;
//  userName: Observable<string>;

//  constructor(
//    private afs: AngularFirestore,
//    private afAuth: AngularFireAuth
//    ) {
//        this.afAuth.authState.subscribe(auth => {
//          if (auth !== undefined && auth !== null) {
//            this.user = auth;
//          }

//          this.getUser().subscribe(a => {
//            this.userName =of( a.displayName);
//          });
//        });
//    }

//  getUser() {
//    const userId = this.user.uid;
//    const path = `/users/${userId}`;
//    return this.afs.doc<firebase.User>(path).valueChanges();
//  }

//  getUsers() {
//    const path = '/users';
//    return this.afs.collection(path);
//  }

//  sendMessage(msg: string) {
//    const timestamp = this.getTimeStamp();
//    const email = this.user.email;
//    this.chatMessages = this.getMessages();
//    this.chatMessages.push({
//      message: msg,
//      timeSent: timestamp,
//      userName: this.userName,
//      email: email });
//  }

//  getMessages(chatid:string)  {
//    // query to create our message feed binding
//    return this.afs.doc(`chat/${chatid}`)., {
//      query: {
//        limitToLast: 25,
//        orderByKey: true
//      }
//    });
//  }

//  getTimeStamp() {
//    const now = new Date();
//    const date = now.getUTCFullYear() + '/' +
//                 (now.getUTCMonth() + 1) + '/' +
//                 now.getUTCDate();
//    const time = now.getUTCHours() + ':' +
//                 now.getUTCMinutes() + ':' +
//                 now.getUTCSeconds();

//    return (date + ' ' + time);
//  }
//}
