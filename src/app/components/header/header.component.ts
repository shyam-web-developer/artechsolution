import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../_services';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls:['./header.component.css']
})
export class HeaderComponent implements OnInit {                
  isLoggedIn : boolean = false;
  
  constructor(private authService: AuthService) {
    authService.loggedIn$.subscribe(
      status => {
        this.isLoggedIn = status;        
      });
   }

   //isLoggedIn$: Observable<boolean>;
  ngOnInit() {
    // initialization code here
    this.isLoggedIn= this.authService.isLoggedIn();
  }

  onLogout() {    
    this.authService.logout();
  }
}
