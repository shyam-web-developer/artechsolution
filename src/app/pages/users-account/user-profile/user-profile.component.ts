import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, UserService } from '../../../_services';
import { CustomValidator } from '../../../_validation/custom.validation';
import { User } from '../../../_models';
@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
  private user: User;
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  userId: number;
  @ViewChild("firstname", { static: true }) firstField: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService,
    private alertService: AlertService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      let userId = parseInt(params.get('id'));
      this.userId = userId;
    });

    this.getUser();

    this.registerForm = this.formBuilder.group({
      userId: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      userName: ['', Validators.required],
      password: [''],
      mobile: ['', [Validators.required, CustomValidator.numberValidator]]
    });
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
    this.userService.update(this.registerForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.showSuccess('User profile updated successfully');
          this.loading = false;
        },
        error => {
          this.alertService.showError(error.message);
          this.loading = false;
        });
  }

  getUser(): void {
    //this.id = this.route.snapshot.paramMap.get('id');
    if (Number(this.userId)) {
      this.userService.getUserById(Number(this.userId)).subscribe((user) => {
        this.user = user;
        this.registerForm.patchValue({ userId: user.userId, userName: user.userName, firstName: user.firstName, lastName: user.lastName, mobile: user.mobile, password: user.password })
      },
        error => {
          this.alertService.showError(error.message);
          this.loading = false;
        }
      );
    }
  }
}
