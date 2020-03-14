import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { AlertService } from '../../_services';

@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})

export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: any;   

    constructor(private alertService: AlertService) { }

    ngOnInit() {        
        this.subscription = this.alertService.getMessage().subscribe(message => {
            this.message = message;
        });        
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    getMessage() {
        if (this.message && this.message.type == 'error') {
            if (this.message.text && this.message.text.error && this.message.text.error.errorMessage) {
                return this.message.text.error.errorMessage || '';
            }
            else {
                return this.message.text.error || '';
            }
        }
        else {
            return this.message.text;
        }
    }
}