import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ReactiveFormsModule } from '@angular/forms';
import {Routes, RouterModule } from '@angular/router';
import { CreateUserComponent } from './create-user/create-user.component';
import { SharedModule } from 'src/app/shared/shared.module';

const routes: Routes = [ 
  { path: 'user-profile/:id', component: UserProfileComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'createUser', component: CreateUserComponent } 
];

@NgModule({
  imports: [
    CommonModule,   
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    UserProfileComponent,
    ChangePasswordComponent,
    CreateUserComponent
  ]  
})
export class UsersAccountModule { }