import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { Observable } from 'rxjs';
import { ChatService } from '../Service/chat.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-chatroom',
  templateUrl: './chatroom.component.html',
  styleUrls: ['./chatroom.component.css']
})
export class ChatroomComponent implements OnInit, AfterViewChecked {
  @ViewChild('scroller', { static: true }) private feedContainer: ElementRef;
  chat$: Observable<any>;
  newMsg: string;
 

  constructor(public cs: ChatService,
    private route: ActivatedRoute,
    public auth: AuthService) { }


  ngOnInit() {
    const chatId = this.route.snapshot.paramMap.get('id');
   
    const source = this.cs.get(chatId);
    this.chat$ = this.cs.joinUsers(source);
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
}
