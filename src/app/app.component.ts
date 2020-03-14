// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent {
//   title = 'my-first-project';
//   public showContent: boolean = false;  
//   constructor() { }
//   ngOnInit(device) {
//     //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
//     //setTimeout(() => this.showContent = true, 200);   
//     document.addEventListener('deviceready', function() { 
//       alert(device.platform); 
//       }, false);  
//   }
// }
/* <ng4-loading-spinner [threshold]="2000" [timeout]="4000" [template]="template" [loadingText]="'Please wait...'" [zIndex]="9999"></ng4-loading-spinner> */
 
import { Router, RoutesRecognized,NavigationEnd } from '@angular/router';
import { Component } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { ConnectionService } from 'ng-connection-service';
@Component({
  selector: 'app-root',
  template: `
    <ng4-loading-spinner> </ng4-loading-spinner>
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent {
  isConnected = true;
  title = 'my-first-project';
  template: string =`<img src="http://pa1.narvii.com/5722/2c617cd9674417d272084884b61e4bb7dd5f0b15_hq.gif" />`
  constructor(
    private router: Router, private spinnerService: Ng4LoadingSpinnerService,private connectionService: ConnectionService
  ) {
    this.spinnerService.show();
    this.router.events
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          localStorage.setItem('previousUrl', event.url);        
          
        }
        this.spinnerService.hide();
      });

     /*  this.connectionService.monitor().subscribe(isConnected => {
        this.isConnected = isConnected;
        if (!this.isConnected) {
         
        }        
      }) */
  }
}
