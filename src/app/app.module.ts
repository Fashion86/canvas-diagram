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

import { LoginComponent } from './login/login.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { UserResolver } from './user/user.resolver';
import { AuthGuard } from './core/auth.guard';
import { AuthService } from './core/auth.service';
import { UserService } from './core/services/user.service';
import { ChannelService } from './core/services/channel.service';
import { ModelService } from './core/services/model.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';

// angular material
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { ChannelComponent } from './channel/channel.component';
import { ObjectComponent } from './object/object.component';
import { AttributeComponent } from './object/attribute/attribute.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    UserComponent,
    RegisterComponent,
    HeaderComponent,
    ChannelComponent,
    ObjectComponent,
    AttributeComponent
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
    NgxSmartModalModule.forRoot()
  ],
  // exports: [
  //   MatCardModule,
  //   BrowserAnimationsModule
  // ],
  providers: [AuthService, UserService, UserResolver, AuthGuard, ChannelService, ModelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
