import { Component, OnInit, Input } from '@angular/core';
import { User } from '../models/user.model';
import { ChatService } from '../Service/chat.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent {
  users: User[];
 @Input() uids: string[];

  constructor(chat: ChatService) {

    chat.getUsers().subscribe(users => {
      this.users = users;
    });
  }
}
