import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app.routes';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';
import { NgxSmartModalModule } from 'ngx-smart-modal';
import { DataTablesModule } from 'angular-datatables';

import { LoginComponent } from './login/login.component';
import { ConversationComponent } from './conversation/conversation.component';
import { RegisterComponent } from './register/register.component';
import { ConversationResolver } from './conversation/conversation.resolver';
import { AuthGuard } from './core/auth.guard';
import { AuthService } from './core/auth.service';
import { UserService } from './core/services/user.service';
import { ChannelService } from './core/services/channel.service';
import { ModelService } from './core/services/model.service';
import { NodeService } from './core/services/node.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {AccordionModule} from 'primeng/accordion';
import {PaginatorModule} from 'primeng/paginator';
//import { FileSelectDirective } from 'ng2-file-upload';

import { AppComponent } from './app.component';

// angular material
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { ChannelComponent } from './channel/channel.component';
import { ObjectComponent } from './object/object.component';
import { AttributeComponent } from './object/attribute/attribute.component';

import { FunctionComponent } from './object/function/function.component';
import { ComparatorComponent } from './object/comparator/comparator.component';
// import {TreeTableModule} from 'primeng/treetable';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ConversationComponent,
    RegisterComponent,
    HeaderComponent,
    ChannelComponent,
    ObjectComponent,
    AttributeComponent,
    FunctionComponent,
    ComparatorComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features
    BrowserAnimationsModule,
    HttpClientModule,
    NgxSmartModalModule.forRoot(),
    DataTablesModule,
    AccordionModule,
    PaginatorModule
  ],
  // exports: [
  //   MatCardModule,
  //   BrowserAnimationsModule
  // ],
  providers: [AuthService, UserService, ConversationResolver, AuthGuard, ChannelService,
    ModelService, NodeService],
  bootstrap: [AppComponent]
})
export class AppModule { }
