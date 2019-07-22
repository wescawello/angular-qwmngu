import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ChatService } from '../Service/chat.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../Service/auth.service';

@Component({
    selector: 'app-chatroom',
    templateUrl: './chatroom.component.html',
    styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit, AfterViewChecked {
    @ViewChild('scroller', { static: false }) private feedContainer: ElementRef;
    chat$: Observable<any>;
    newMsg: string;
    userchats$: Observable<{ id: string; title: string; }[]>;
    chatId: string;


    constructor(public cs: ChatService,
        private route: ActivatedRoute,
        public auth: AuthService) {

    }


  ngOnInit() {
    this.route.paramMap.subscribe(p => {
      this.chatId = p.get('id');
      const source = this.cs.get(this.chatId);
      this.chat$ = this.cs.joinUsers(source);
    });
    this.auth.CurrUser$.subscribe(p => {
      if (p && !this.userchats$) {
        this.userchats$ = this.cs.userchats(this.auth.currentUserId);
      }
    })

        ;

    }

    scrollToBottom(): void {
        this.feedContainer.nativeElement.scrollTop
            = this.feedContainer.nativeElement.scrollHeight;
    }

    ngAfterViewChecked() {
        if (this.feedContainer) {
            this.scrollToBottom();

        }
    }
    trackByCreated(i, msg) {
        return msg.createdAt;
    }
}
