import { Component, OnInit, Input } from '@angular/core';
import { ChatService } from '../Service/chat.service';
import { User } from '../models/user.model';
import { AuthService } from '../Service/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';
import { IMessage } from '../Model/commonModel';

@Component({
    selector: 'app-user-item',
    templateUrl: './user-item.component.html',
    styleUrls: ['./user-item.component.css']
})
export class UserItemComponent implements OnInit {

    @Input() user: User;
    @Input() uids: string[];

    constructor(public auth: AuthService, private afs: AngularFirestore, private route: ActivatedRoute, private cs: ChatService) { }

    ngOnInit() {
    }
    async inv(uid) {
        const chatId = this.route.snapshot.paramMap.get('id');
        
        let mm: IMessage = {
            SenderId: this.auth.currentUserId,
            SubTitle: "你有一聊天室邀請",
            CreateDate: new Date(),
            Content: "",
            Read: false,
            Jaction: '/chats',
            Jid: chatId,
            isOpen: false
        };

        await this.afs.collection(`messages/${uid}/msgs`).add(mm);
        await this.cs.invuser(chatId,uid)
    }
}
