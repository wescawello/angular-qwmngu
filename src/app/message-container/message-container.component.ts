import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-message-container',
  templateUrl: './message-container.component.html',
  styleUrls: ['./message-container.component.css']
})
export class MessageContainerComponent implements OnInit {
  @Input() msg 
    isOwnMessage: boolean;
  constructor(private auth:AuthService) { }

  ngOnInit() {
    console.log(this.msg);
    this.isOwnMessage = this.msg.uid == this.auth.currentUserId;
  }

}
