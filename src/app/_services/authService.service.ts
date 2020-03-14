import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { Subject } from "rxjs";
import { map } from 'rxjs/operators';
import { ConfirmService } from './confirm.service';


const httpOptions = {
    headers: new HttpHeaders({
        // 'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/json',
        'No-Auth': 'True'
    })
};

@Injectable({
    providedIn: 'root'
})

export class AuthService {
    /* private loggedIn = new BehaviorSubject<boolean>(false); // {1}
    get isLoggedIn() {
      return this.loggedIn.asObservable(); // {2}
    } */

    tokenUrl = environment.tokenUrl;
    private loggedIn = new Subject<boolean>();
    loggedIn$ = this.loggedIn.asObservable();
    returnUrl: string;
    constructor(private http: HttpClient, private router: Router, private confirmService: ConfirmService) { }

    login(username: string, password: string) {
        //var userData = "grant_type=password&username=" + username + "&password=" + password;
        var userData = { "UserName": username, "Password": password };
        return this.http.post(this.tokenUrl, userData, httpOptions).pipe(map((res) => {
            this.loggedIn.next(true);
            return res;
        }));
    }

    login1(username: string, password: string) {
        return {
            "access_token": "5-VyKUhAl0wlwzu7EkIpoy-tHfGEmhxgDsMa8nAH68xOKCHCN0MZgudsnJzOZz8vGscfvFxaqRVMmLvfgiNzP5mrhk-Bwp5emPp789wz9LniABP_osWd3dDBzfz8I0X_-Ft7T0Y_uoJMUIkthKDZLUOoh_wqQjc0ptspR3zl4bB2J-WhkRCFka3pSO9r6QWv-69NpqU_6YHUP-24kxMr7txww6nH4LjK-f6ibyMNK3U",
            "token_type": "bearer",
            "expires_in": 1209599,
            "userName": "Shyam",
            ".issued": "Wed, 19 Dec 2018 10:31:59 GMT",
            ".expires": "Wed, 02 Jan 2019 10:31:59 GMT"
        }
    }

    logout() {
        // remove user from local storage to log user out        
        localStorage.setItem('isLoggedIn', "false");
        localStorage.removeItem('currentUser');
        this.loggedIn.next(false);
        this.router.navigate(['/login']);
    }

    public isLoggedIn(): boolean {
        let status = false;
        if (localStorage.getItem('isLoggedIn') == "true") {
            status = true;
        }
        else {
            status = false;
        }
        return status;
    }

    canDeactivate(route): boolean {
        if (this.isLoggedIn()) {
            setTimeout(() => {
                this.openConfirmationDialog(route);
            }, 50);
        }
        return false;
    }

    clearLocalStorage() {
        // remove user from local storage to log user out
        console.log("Logout");
        localStorage.setItem('isLoggedIn', "false");
        localStorage.removeItem('currentUser');
        this.loggedIn.next(false);
    }

    public openConfirmationDialog(route) {
        this.confirmService.confirm('Please confirm..', 'Do you want to logout ?', 'OK', 'Cancel', 'confirm')
            .then((confirmed) => {
                console.log('User confirmed:', confirmed)
                console.log("Logout");
                localStorage.setItem('isLoggedIn', "false");
                localStorage.removeItem('currentUser');
                this.loggedIn.next(false);
                this.router.navigate([route._routerState.snapshot.url]);
            })
            .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
    }

    loggedUserName() {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            return currentUser.userName;
        }
    }

    isReadonlyUser() {
        var currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            return currentUser.isReadonly;
        }
    }
}