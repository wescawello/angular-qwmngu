import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CounterComponent } from './counter/counter.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { StorageOrderMgrComponent } from './storage-order-mgr/storage-order-mgr.component';
import { StorageOrderDetialComponent } from './storage-order-detial/storage-order-detial.component';
import { DiscardOrderMgrComponent } from './discard-order-mgr/discard-order-mgr.component';
import { DiscardOrderDetialComponent } from './discard-order-detial/discard-order-detial.component';
import { TransActionComponent } from './trans-action/trans-action.component';
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryActionComponent } from './inventory-action/inventory-action.component';
import { RegisterComponent } from './register/register.component';
import { CamBarcodeComponent } from './cam-barcode/cam-barcode.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { CamTestComponent } from './cam-test/cam-test.component';
import { MessagesComponent } from './messages/messages.component';
import { ChatroomComponent } from './chatroom/chatroom.component';



const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'counter', component: CounterComponent },
  { path: 'fetch-data', component: FetchDataComponent },
  { path: 'storage-order-mgr', component: StorageOrderMgrComponent },
  { path: 'storage-order-list', component: StorageOrderDetialComponent },
  { path: 'discard-order-mgr', component: DiscardOrderMgrComponent },
  { path: 'discard-order-list', component: DiscardOrderDetialComponent },
  { path: 'trans-action', component: TransActionComponent },
  { path: 'inventory', component: InventoryComponent },
  { path: 'my-profile', component: MyProfileComponent },
  { path: 'inventory-action/:id', component: InventoryActionComponent },
  { path: 'cam', component: CamBarcodeComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cam-test', component: CamTestComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'chats', component: ChatroomComponent },
  { path: 'chats/:id', component: ChatroomComponent },
  { path: 'cam-test/:id/:tabindex', component: CamTestComponent },




];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
