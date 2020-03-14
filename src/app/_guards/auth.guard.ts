import { Injectable } from '@angular/core';
import { Router, CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../_services/authService.service';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { HomeComponent } from '../website//home/home.component';
import { DashboardComponent } from '../pages/dashboard/dashboard.component';
@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthService) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
        let url: string = state.url;
        return this.verifyLogin(url);
    }

    verifyLogin(url): boolean {
        if (!this.authService.isLoggedIn()) {
            this.router.navigate(['/login']);
            return false;
        }
        else if (this.authService.isLoggedIn()) {
            return true;
        }
    }

    /* canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
      ): Observable<boolean> {
        return this.authService.isLoggedIn         // {1}
          .pipe(
            take(1),                              // {2} 
            map((isLoggedIn: boolean) => {         // {3}
              if (!isLoggedIn){
                this.router.navigate(['/login']);  // {4}
                return false;
              }
              return true;
            });
          )
      } */
}

@Injectable()
export class UnsearchedTermGuard implements CanDeactivate<HomeComponent> {
    constructor(private router: Router, private authService: AuthService) { }
    canDeactivate(component: HomeComponent,
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): boolean {
        /* console.log("UnsearchedTermGuard");
        console.log(route.params);
        console.log(state.url);
        return component.canDeactivate() || window.confirm("Are you sure?"); */

        if (this.authService.isLoggedIn()) {
            //this.authService.canDeactivate(route);      
        }
        return true;
    }
}