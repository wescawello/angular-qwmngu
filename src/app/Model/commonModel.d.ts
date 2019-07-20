import { BehaviorSubject, Observable } from "rxjs";
import { AngularFirestoreDocument } from "@angular/fire/firestore";
 



interface IHandleTabsave {
  Tabs: ITabsave[];
  Users: string;
  DoUpdate?: number;
}
interface IHandleTabwatch {
  Tabs$?: BehaviorSubject<ITabsave>[];
  Users: string;
  DoUpdate?: number;
}

interface IVtalTabsave {
  Tabdoc: AngularFirestoreDocument<ITabsave>;
  TabLocal: BehaviorSubject<ITabsave>;
  TabOb?: Observable<ITabsave>;
}



interface ITabsave {
  Status?: { Name: string; }[];

  wayrole: string;
  title: string;
  content: string;
  disabled?: boolean;
  active?: boolean;
  removable?: boolean;
  items?: ISubInventory[];
  kindAitems?: ISubInventory[];
  kindBitems?: ISubInventory[];

}
interface ITabdemo {
  Status?: { Name: string; }[];

  wayrole: string;

  title: string;
  content: string;
  disabled?: boolean;
  active?: boolean;
  removable?: boolean;
  items?: BehaviorSubject<ISubInventory[]>;
  customClass?: any;
}
interface IWorkOrder {
  Name?: string;
  Id?: string;
}
interface ISubInventory {
  StateId: string;
  Fsn: number;
  id: string;
  AssetSn: string;
  BelongingsSn: string;
  AssetName: string;
  PlaceIn: string;
  InventoryDate?: firebase.firestore.Timestamp | Date;
  BuyDate: Date;
  UserId?: string;
  UserDisplayName?: string;
}
interface IMessage {
    SenderName?:Observable< string>;
  SenderId: string;
  SubTitle: string;
  Content: string;
  Read?: boolean;
  isOpen?: boolean;
  setRead?:(x:boolean)=> Promise<void>
  ReadDate?: firebase.firestore.Timestamp | Date;
  CreateDate?: firebase.firestore.Timestamp | Date;
  Jaction?: string;
  Jid?:string
}
