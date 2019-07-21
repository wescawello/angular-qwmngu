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
    this.route.paramMap.subscribe(p => {
      const chatId = p.get('id');
      console.log(chatId);
      this.chatId$.next(chatId)
    })

        //const source = this.cs.get(chatId);
        //this.chat$ = this.cs.joinUsers(source);
    }

    async submit(chatId) {
       await this.cs.sendMessage(chatId, this.newMsg);
        this.newMsg = '';
    }

    async newRoomFn(s: string) {
        if (s) {
            await this.cs.create(s);
        }

    }


    trackByCreated(i, msg) {
        return msg.createdAt;
    }
}
