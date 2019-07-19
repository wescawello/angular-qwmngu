import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


import { NgxScreenfullModule } from '@ngx-extensions/screenfull';



import { CounterComponent } from './counter/counter.component';
import { DiscardOrderMgrComponent } from './discard-order-mgr/discard-order-mgr.component';
import { DiscardOrderDetialComponent } from './discard-order-detial/discard-order-detial.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';

import { HomeComponent } from './home/home.component';
import { InventoryComponent } from './inventory/inventory.component';
import { InventoryActionComponent } from './inventory-action/inventory-action.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { RegisterComponent } from './register/register.component';
import { StorageOrderMgrComponent } from './storage-order-mgr/storage-order-mgr.component';
import { StorageOrderDetialComponent } from './storage-order-detial/storage-order-detial.component';

import { TransActionComponent } from './trans-action/trans-action.component';
import { NgxModalDraggableDirective } from './ngx-modal-draggable.directive';

import { environment } from '../environments/environment';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/database';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; 
import { library } from '@fortawesome/fontawesome-svg-core';
import { faTrashAlt, faSquare, faCheckSquare, faCamera, faEye, faEnvelopeOpenText } from '@fortawesome/free-solid-svg-icons';
import { faStackOverflow, faGithub, faMedium } from '@fortawesome/free-brands-svg-icons';
 

import { BsDropdownModule ,
TabsModule,
BsDatepickerModule,
ModalModule,
AlertModule,
PaginationModule,
SortableModule,
AccordionModule,
ProgressbarModule
 } from 'ngx-bootstrap';
 
 

import { CamBarcodeComponent } from './cam-barcode/cam-barcode.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { CamTestComponent } from './cam-test/cam-test.component';
import { NgxInactivity } from './ngx-inactivity';
import { MessagesComponent } from './messages/messages.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserItemComponent } from './user-item/user-item.component';
import { ChatFormComponent } from './chat-form/chat-form.component';
import { MessageContainerComponent } from './message-container/message-container.component';

@NgModule({
  declarations: [
    AppComponent,
    CounterComponent,
    DiscardOrderMgrComponent,
    DiscardOrderDetialComponent,
    FetchDataComponent,
    HomeComponent,
    InventoryComponent,
    InventoryActionComponent,
    NavMenuComponent,
    RegisterComponent,
    StorageOrderMgrComponent,
    StorageOrderDetialComponent,
    TransActionComponent,
    NgxModalDraggableDirective,
    CamBarcodeComponent,
    MyProfileComponent,
    CamTestComponent,
    MessagesComponent,
    ChatroomComponent,
    UserListComponent,
    UserItemComponent,
    ChatFormComponent,
    MessageContainerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    AngularFireModule.initializeApp(environment.firebase, "inventory"),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule,

    FormsModule,
    HttpClientModule,
    NgxScreenfullModule,
    NgxInactivity,

    BsDatepickerModule.forRoot(),
    AccordionModule.forRoot(),
    AlertModule.forRoot(),
    ModalModule.forRoot(),
    PaginationModule.forRoot(),
    ProgressbarModule.forRoot(),
    SortableModule.forRoot(),
    BsDropdownModule.forRoot(),
    TabsModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    // Add an icon to the library for convenient access in other components
    library.add( faCamera,faTrashAlt, faEye,faEnvelopeOpenText);
 
  
  }
}
