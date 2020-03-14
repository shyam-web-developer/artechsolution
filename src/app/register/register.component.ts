import { Component, OnInit,ViewChild, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AlertService, UserService } from '../_services';
import { CustomValidator } from '../_validation/custom.validation';

@Component({
    templateUrl: 'register.component.html',
    styleUrls: ['../login/login.component.css']
})
export class RegisterComponent {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    errorMessage : string;
    @ViewChild("userName", {static: true}) firstField: ElementRef;
    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService) { }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            userName: ['', Validators.required],
            mobileNo: ['', [Validators.required, Validators.minLength(10),Validators.maxLength(10)]],
            email : ['abc@gmail.com'],
            userTypeId : [0],
            empId : [0],
            createdBy : [''],
            isActive : [true],
            password: ['', [Validators.required, Validators.minLength(5)]],
            confirmPassword: ['', Validators.required],
            encryptionKey: ['']
        },{ validator: CustomValidator.matchPassword });
        this.firstField.nativeElement.focus();
    }

    // convenience getter for easy access to form fields
    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.userService.register(this.registerForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.showSuccess('Registration successful');                    
                    this.router.navigate(['/login']);
                },
                error => {
                    this.alertService.showError(error);                   
                    this.loading = false;
                });
    }
}

