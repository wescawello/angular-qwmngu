import { Component, OnInit } from '@angular/core';
import { AuthService } from '../Service/auth.service';
import { IMessage } from '../Model/commonModel';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor(public mg: AuthService) { }

  ngOnInit() {
  }
  async readmsg(msg: IMessage,e:boolean) {

    await  msg.setRead(e);
  }
}
