import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { ConversationComponent } from './conversation/conversation.component';
import { RegisterComponent } from './register/register.component';
import { ConversationResolver } from './conversation/conversation.resolver';
import { AuthGuard } from './core/auth.guard';
import { ChannelComponent } from './channel/channel.component';
import { ObjectComponent } from './object/object.component';
import { AttributeComponent } from './object/attribute/attribute.component';


export const rootRouterConfig: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'conversation', component: ConversationComponent, canActivate: [AuthGuard]},
  { path: 'channel', component: ChannelComponent, canActivate: [AuthGuard], data: { title: 'Channel'}},
  { path: 'model', component: ObjectComponent, canActivate: [AuthGuard], data: { title: 'Model'}},
  { path: 'model/:id/attributes', component: AttributeComponent, canActivate: [AuthGuard], data: { title: 'Model Attributes'}},
  { path: '**',  redirectTo: "/login", pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(rootRouterConfig)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
