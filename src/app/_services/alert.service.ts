import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class AlertService {
    private subject = new Subject<any>();
    private keepAfterNavigationChange = false;

    constructor(private router: Router, private toastr: ToastrService) {
        // clear alert message on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    this.keepAfterNavigationChange = false;
                } else {
                    // clear alert
                    this.subject.next();
                }
            }
        });
    }

    success(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'success', text: message, isShowMessage: keepAfterNavigationChange });
    }

    error(message: any, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'error', text: message, isShowMessage: keepAfterNavigationChange });
    }

    showSuccess(message) {
        this.toastr.success(message, 'Success')
    }

    showError(message) {
        this.toastr.error(this.getErrorMsg(message), 'Error')
    }

    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }

    getErrorMsg(message: any) {
        if (message) {
            if (message && message.error && message.error.errorMessage) {
                return message.error.errorMessage || '';
            }
            else if(message && message.error && message.error.errors) {
                return message.error.title || '';
            }
            else if(message.message && (typeof(message.error) == "string")){
                return message.error || message.message || '';
            }
            else if(message.message){
                return message.message || '';
            }
            else {
                return message;
            }  
        }
        else {
            return '';
        }
    }
}