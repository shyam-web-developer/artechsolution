import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService, LookupService, AuthService } from '../../../_services';
import { CustomValidator } from '../../../_validation/custom.validation';
import { lookupAttribute } from 'src/app/shared/lookup-attribute/lookup.attribute';
import { successMessage } from 'src/app/shared/messages/messages';

@Component({
    templateUrl: 'create-user.component.html',
})
export class CreateUserComponent {
    createUserForm: FormGroup;
    loading = false;
    submitted = false;
    isReadonly: false;
    errorMessage: string;
    lookup: any;
    options: any = { employee: [], userType: [] };
    lookupAttribute: any = { Employee: lookupAttribute.Employee, UserType: lookupAttribute.UserType };

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private userService: UserService,
        private alertService: AlertService,
        private lookupService: LookupService,
        private authService: AuthService) { }

    ngOnInit() {
        this.createUserForm = this.formBuilder.group({
            firstName: [''],
            lastName: [''],
            userName: [''],
            mobileNo: [''],
            email: [''],
            userTypeId: [0],
            empId: [0],
            createdBy: [''],
            isActive: [true],
            password: ['', [Validators.required, Validators.minLength(5)]],
            confirmPassword: ['', Validators.required],
            encryptionKey: [''],
            lookupForm: this.formBuilder.group({
                empId: [{ value: '0', disabled: this.isReadonly }, CustomValidator.lookupRequired],
                userTypeId: [{ value: '0', disabled: this.isReadonly }, CustomValidator.lookupRequired]
            }),
        }, { validator: CustomValidator.matchPassword });
        this.getLookup();
        this.getUserType();
    }

    // convenience getter for easy access to form fields
    get f() { return this.createUserForm.controls; }
    get lookupForm(): any { return this.createUserForm.get('lookupForm'); }


    getLookup() {
        this.lookup = { lookupName: lookupAttribute.Employee.lookupName };
        this.lookupService.getLookup(this.lookup).subscribe(
            data => {
                this.options.employee = data;
            }
        );
    };
    getUserType() {
        this.lookup = { lookupName: lookupAttribute.UserType.lookupName };
        this.lookupService.getLookup(this.lookup).subscribe(
            data => {
                this.options.userType = data;
            }
        );
    };

    onSubmit() {
        this.submitted = true;
        // stop here if form is invalid
        if (this.createUserForm.invalid || this.isReadonly) {
            return;
        }

        this.loading = true;
        if (this.createUserForm.value) {
            this.createUserForm.value.createdBy = this.authService.loggedUserName();
            this.createUserForm.value.createdDate = new Date();
            this.createUserForm.value.empId = Number(this.createUserForm.value.lookupForm.empId);
            this.createUserForm.value.userTypeId = Number(this.createUserForm.value.lookupForm.userTypeId);
        }

        this.userService.createUser(this.createUserForm.value)
            .pipe(first())
            .subscribe(
                data => {
                    this.alertService.showSuccess(successMessage.Saved);
                },
                error => {
                    this.alertService.showError(error);
                    this.loading = false;
                });
    }

    clear(){
        this.createUserForm.patchValue({password : '', confirmPassword : ''})
        this.lookupForm.patchValue({empId : '0', userTypeId : '0'})
    }
}

