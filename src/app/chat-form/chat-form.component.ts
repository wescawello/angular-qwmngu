import { Component, OnInit } from '@angular/core';
import { ChatService } from '../Service/chat.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-form',
  templateUrl: './chat-form.component.html',
  styleUrls: ['./chat-form.component.css']
})
export class ChatFormComponent implements OnInit {
  chat$: Observable<any>;
  newMsg: string;
  chatId$ = new BehaviorSubject<string>("");
    newRoom: string;
  constructor(private cs: ChatService, private route: ActivatedRoute) { }

  ngOnInit() {
    const chatId = this.route.snapshot.paramMap.get('id');
    console.log(chatId);
    this.chatId$.next( chatId)
    const source = this.cs.get(chatId);
    this.chat$ = this.cs.joinUsers(source);
  }

  submit(chatId) {
    this.cs.sendMessage(chatId, this.newMsg);
    this.newMsg = '';
  }

 async newRoomFn(s: string) {
    await this.cs.create(s);

  }


  trackByCreated(i, msg) {
    return msg.createdAt;
  }
}
