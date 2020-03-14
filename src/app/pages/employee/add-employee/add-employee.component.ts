import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, ModalService, AuthService } from '../../../_services';
import { AddEmployeeService } from '../add-employee/add-employee.service';
import { successMessage, errorMessage } from '../../../shared/messages/messages';
import { lookupAttribute } from '../../../shared/lookup-attribute/lookup.attribute';
import { CustomValidator } from 'src/app/_validation/custom.validation';
import { FlatpickrOptions } from 'ng2-flatpickr';

@Component({
  selector: 'app-add-new-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: []
})

export class AddEmployeeComponent {
  @ViewChild('dobPicker', {static: true}) pickerDob;
  addEmployeeForm: FormGroup;
  loading = false;
  submitted = false;   
  lookupAttribute: any = { Department: lookupAttribute.Department, Branch: lookupAttribute.Branch, Designation: lookupAttribute.Designation, FatherQualification: lookupAttribute.HighestQualification, Gender:lookupAttribute.Gender, Category:lookupAttribute.Category, 
    Religion:lookupAttribute.Religion, BloodGroup:lookupAttribute.BloodGroup, EmployeeType :lookupAttribute.EmployeeType}; 
  public options: any = { department: [], branch: [], qualification: [], designation : [],  gender : [], category : [], religion: [], bloodGroup : [], employeeType : []}; 
  
  public isReadonly = false;
  private _regDate = new Date();
  public get regDate() {
    return this._regDate;
  }
  public set regDate(value) {
    this._regDate = value;
  }
  public dobOptions: FlatpickrOptions = {
    dateFormat: 'm-d-Y',
    onChange: function (parent) {
      return function (selectedDates, dateStr, instance) {
        let dob = new Date(dateStr);
        parent.addEmployeeForm.controls['dob'].setValue(dob);
      };
    }(this)
  };  

  public dojOptions: FlatpickrOptions = {
    dateFormat: 'm-d-Y',
    onChange: function (parent) {
      return function (selectedDates, dateStr, instance) {
        let doj = new Date(dateStr);
        parent.addEmployeeForm.controls['doj'].setValue(doj);
      };
    }(this)
  };  

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private addEmployeeService: AddEmployeeService,
    private modalService: ModalService,
    private authService: AuthService) { }

  ngOnInit() {
    this.addEmployeeForm = this.formBuilder.group({
      empId: [0],
      firstName: [{ value: 'Shyam', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],
      middleName: [{ value: '', disabled: this.isReadonly }, [Validators.maxLength(50)]],
      lastName: [{ value: 'Yadav', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],
      mobileNo: [{ value: '', disabled: this.isReadonly }, [Validators.minLength(10), Validators.maxLength(10)]],
      fatherName: [{ value: 'Radhe', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],     
      motherName: [{ value: 'Pra', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],
      degId: ['0', Validators.required],
      branchId: ['0', Validators.required],      
      deptId: ['0', Validators.required],
      hQualifId: [{ value: 0, disabled: this.isReadonly }],     
      aadharNo: [{ value: '', disabled: this.isReadonly }, [Validators.minLength(12), Validators.maxLength(12)]],
      passportNo: [{ value: '', disabled: this.isReadonly }, [Validators.minLength(12), Validators.maxLength(12)]],    
      dob: ['', Validators.required],  
      doj: ['', Validators.required],
      nationality: [{ value: 'Indian', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(20)]],      
      isActive: [true],
      regDate: [this._regDate],
      emailId: [{ value: '', disabled: this.isReadonly }],
      personalEmailId: [{ value: '', disabled: this.isReadonly }],
      eContactName: [{ value: '', disabled: this.isReadonly }],
      eContactNo: [{ value: '', disabled: this.isReadonly }],      
      employeeType: [{ value: 'P', disabled: this.isReadonly }],
      address : [null],
      createdBy :[],
      lookupForm: this.formBuilder.group({
        degId: [{ value: '0', disabled: this.isReadonly }, CustomValidator.lookupRequired],
        branchId: [{ value: '1', disabled: this.isReadonly }, CustomValidator.lookupRequired],       
        bloodGroup: [{ value: 'A+', disabled: this.isReadonly }],
        gender: [{ value: 'M', disabled: this.isReadonly }, CustomValidator.lookupRequired],
        religion: [{ value: 'H', disabled: this.isReadonly }, CustomValidator.lookupRequired],       
        deptId: [{ value: '0', disabled: this.isReadonly }, CustomValidator.lookupRequired],
        category: [{ value: 'OBC', disabled: this.isReadonly }, CustomValidator.lookupRequired],
        hQualifId: [{ value: '0', disabled: this.isReadonly }],
        employeeType: [{ value: 'P', disabled: this.isReadonly }]
      }),
      
      permanentAddressForm: this.formBuilder.group({
        address1: [{value:'M-66', disabled: this.isReadonly }, Validators.required],
        address2: [{value:'', disabled: this.isReadonly }],
        countryId: [{value: '99', disabled: this.isReadonly }, [CustomValidator.lookupRequired]],
        stateId: [{value: '34', disabled: this.isReadonly }, [CustomValidator.lookupRequired]],
        cityId: [{value: '1', disabled: this.isReadonly }, [CustomValidator.lookupRequired]],
        pinCode: [{value: '201301' , disabled: this.isReadonly }, [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
        landmark: [{value: '' , disabled: this.isReadonly }, [Validators.maxLength(50)]],
      })
    });   
    this.getLookup();
  }

  get f() { return this.addEmployeeForm.controls; }
  get lookupForm(): any { return this.addEmployeeForm.get('lookupForm'); }
  get permanentAddressForm(): any { return this.addEmployeeForm.get('permanentAddressForm'); }  
  get genCatRelForm(): any { return this.addEmployeeForm.get('genCatRelForm'); }

  getLookup() {
    this.addEmployeeService.getLookups().subscribe(
      data => {
        if (data)
        this.options.department = data[lookupAttribute.Department.outputName];
        this.options.branch = data[lookupAttribute.Branch.outputName];
        this.options.designation = data[lookupAttribute.Designation.outputName];
        this.options.qualification = data[lookupAttribute.FatherQualification.outputName];
        this.options.gender = data[lookupAttribute.Gender.outputName];
        this.options.category = data[lookupAttribute.Category.outputName];
        this.options.religion = data[lookupAttribute.Religion.outputName];
        this.options.bloodGroup = data[lookupAttribute.BloodGroup.outputName];
        this.options.employeeType = data[lookupAttribute.EmployeeType.outputName];
      }
    );
  };

  onSubmit() {
    this.submitted = true;    
    if (this.addEmployeeForm.invalid || this.isReadonly) {
      return;
    }

    this.loading = true;
    if (this.addEmployeeForm.value) {
      this.addEmployeeForm.value.degId = Number(this.addEmployeeForm.value.lookupForm.degId);
      this.addEmployeeForm.value.branchId = Number(this.addEmployeeForm.value.lookupForm.branchId);
      this.addEmployeeForm.value.deptId = Number(this.addEmployeeForm.value.lookupForm.deptId);     
      this.addEmployeeForm.value.gender = this.addEmployeeForm.value.lookupForm.gender;
      this.addEmployeeForm.value.religion =this.addEmployeeForm.value.lookupForm.religion;
      this.addEmployeeForm.value.category = this.addEmployeeForm.value.lookupForm.category;
      this.addEmployeeForm.value.hQualifId = Number(this.addEmployeeForm.value.lookupForm.hQualifId);
      this.addEmployeeForm.value.bloodGroup = this.addEmployeeForm.value.lookupForm.bloodGroup;
      this.addEmployeeForm.value.createdBy = this.authService.loggedUserName();
      this.addEmployeeForm.value.createdDate = new Date(); 
      this.addEmployeeForm.value.permanentAddressForm.cityId = Number(this.addEmployeeForm.value.permanentAddressForm.cityId);
      this.addEmployeeForm.value.address = this.addEmployeeForm.value.permanentAddressForm;
    }

    this.addEmployeeService.saveNewEmployee(this.addEmployeeForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.showSuccess(successMessage.Saved);
          this.clearItem();
        },
        error => {
          this.alertService.showError(error);
          this.loading = false;
        });
  }

  clearItem() {
    this.loading = false;
    this.submitted = false;
    this.addEmployeeForm.reset(); 
    this.addEmployeeForm.patchValue({regDate : null})  
    this.lookupForm.patchValue({ degId: '0', branchId: '0', genderId :'0', religionId:0, deptId:'0', prevdeptId:'0', categoryId:'0', hQualifId:'0', bloodGroupId:'0', employeeType:'P'});
    this.permanentAddressForm.reset();
    this.permanentAddressForm.patchValue({ countryId: '0', stateId: '0', cityId :'0'});    
  } 

}
