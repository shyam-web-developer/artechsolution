import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from "@angular/router";
import { AuthService } from './authService.service';

@Injectable()
export class AuthInterceptor {
    constructor(private authService: AuthService, private router: Router) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (request.headers.get('No-Auth') == "True") {
            return next.handle(request.clone()).pipe(catchError(err => {
                if (err.status === 401 || err.status === 0) {
                    // auto logout if 0 response returned from api
                    //console.log(err.message);
                    //this.authService.logout();
                }               
                return throwError(err);
            }));
        }
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.access_token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.access_token}`
                }
            });
            return next.handle(request).pipe(catchError(err => {
                if (err.status === 401 || err.status === 0) {
                    // auto logout if 401 response returned from api
                    //console.log(err.message);
                    this.authService.logout();
                }
                //const error = err.error.message || err.statusText;
                return throwError(err);
            }))
        }
        else {
            this.router.navigateByUrl('/login');
        }
    }
}