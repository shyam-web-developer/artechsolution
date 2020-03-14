import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AlertComponent } from '../_directives';
import { LoginLayoutComponent } from './layouts/login-layout.component';
import { HomeLayoutComponent } from './layouts/home-layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';


@NgModule({
  imports: [
    CommonModule,   
    RouterModule,
    FormsModule,
    ReactiveFormsModule       
  ],
  declarations: [    
    AlertComponent,
    HeaderComponent, 
    FooterComponent, 
    NavbarComponent,
    SidebarComponent,
    LoginLayoutComponent,
    HomeLayoutComponent        
  ]  
})
export class ComponentsModule { }