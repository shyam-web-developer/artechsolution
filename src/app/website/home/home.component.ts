import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../_services/authService.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
    returnUrl: string;
    public showContent: boolean = false;
    constructor(private router: Router, private route: ActivatedRoute, private authService: AuthService) {
        route.url.subscribe(() => {
           authService.canDeactivate(route); // any time url changes, this callback is fired
          });
     }

    ngOnInit() {      
        this.authService.clearLocalStorage();
    }    

    canDeactivate() {
        return true;
      }
}

