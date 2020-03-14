import { Component } from '@angular/core';
import { AuthService } from '../../_services';
@Component({
  selector: 'app-login-layout',
  template: `   
    <app-header></app-header>
    <app-alert></app-alert>    
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
  styles: []
})
export class LoginLayoutComponent {
  constructor(private authService: AuthService) {
    
   }
  onLogout() {    
    this.authService.logout();
  }
}