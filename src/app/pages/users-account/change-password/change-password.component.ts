import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService, AuthService } from '../../../_services';
import { CustomValidator } from '../../../_validation/custom.validation';
import { User } from '../../../_models';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: []
})

export class ChangePasswordComponent {
  private user: User;
  changePasswordForm: FormGroup;
  loading = false;
  submitted = false;
  id: string;
  @ViewChild("newPassword", { static: true }) firstField: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group({
      userName: [this.authService.loggedUserName(), Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validator: CustomValidator.matchPassword });
    this.firstField.nativeElement.focus();
  }

  // convenience getter for easy access to form fields
  get f() { return this.changePasswordForm.controls; }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.changePasswordForm.invalid || !this.changePasswordForm.value.password) {
      return;
    }

    this.loading = true;    
    this.userService.changePassword(this.changePasswordForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.showSuccess('Your profile password updated successfully');
          this.clearItem();
        },
        error => {
          this.alertService.showError(error.message);
          this.loading = false;
        });
  }
  clearItem() {
    this.submitted = false;
    this.loading = false;
    this.changePasswordForm.reset();
    this.changePasswordForm.patchValue({ userName: this.authService.loggedUserName() });
    this.firstField.nativeElement.focus();
  }
}
