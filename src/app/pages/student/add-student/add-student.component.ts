import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, ModalService, AuthService } from '../../../_services';
import { AddStudentService } from '../add-student/add-student.service';
import { successMessage, errorMessage } from '../../../shared/messages/messages';
import { lookupAttribute } from '../../../shared/lookup-attribute/lookup.attribute';
import { CustomValidator } from 'src/app/_validation/custom.validation';
import { FlatpickrOptions } from 'ng2-flatpickr';

@Component({
  selector: 'app-add-new-student',
  templateUrl: './add-student.component.html',
  styleUrls: []
})

export class AddStudentComponent {
  @ViewChild('dobPicker', {static: true}) pickerDob;
  addStudentForm: FormGroup;
  loading = false;
  submitted = false;
  //@ViewChild("session", { static: true }) firstField: ElementRef;  
  lookupAttribute: any = { Session: lookupAttribute.Session, Branch: lookupAttribute.Branch, Class: lookupAttribute.Class, FatherQualification: lookupAttribute.FatherQualification, Gender:lookupAttribute.Gender, Category:lookupAttribute.Category, 
    Religion:lookupAttribute.Religion, BloodGroup:lookupAttribute.BloodGroup,PrevClass:lookupAttribute.PrevClass};
 
  public options: any = { session: [], branch: [], qualification: [], class : [],  gender : [], category : [], religion: [], bloodGroup : []}; 
  
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
        let birthDate = new Date(dateStr);
        parent.addStudentForm.controls['birthDate'].setValue(birthDate);    
      };  
  }(this) 
};  

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private addStudentService: AddStudentService,
    private modalService: ModalService,
    private authService: AuthService) { }

  ngOnInit() {
    this.addStudentForm = this.formBuilder.group({
      studentId: [0],
      firstName: [{ value: 'Shyam', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],
      middleName: [{ value: '', disabled: this.isReadonly }, [Validators.maxLength(50)]],
      lastName: [{ value: 'Yadav', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],
      mobileNo: [{ value: '', disabled: this.isReadonly }, [Validators.minLength(10), Validators.maxLength(10)]],
      fatherName: [{ value: 'Radhe', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],
      fatherMobileNo: [{ value: '7840074203', disabled: this.isReadonly }, [Validators.required,Validators.minLength(10), Validators.maxLength(10)]],
      motherName: [{ value: 'Pra', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],
      sessionId: [0, Validators.required],
      branchId: [0, Validators.required],
      sectionId: [0, Validators.required],
      prevclassId: [0, Validators.required],
      classId: [0, Validators.required],
      fatherQualifId: [{ value: 0, disabled: this.isReadonly }],
      fatherProfession: [{ value: 'Agri', disabled: this.isReadonly }, [Validators.required,Validators.maxLength(30)]],
      motherMobileNo: [{ value: '', disabled: this.isReadonly }, [Validators.minLength(10), Validators.maxLength(10)]],
      aadharNo: [{ value: '', disabled: this.isReadonly }, [Validators.minLength(12), Validators.maxLength(12)]],  
      birthDate: ['', Validators.required],  
      nationality: [{ value: 'Indian', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(20)]],      
      isActive: [true],
      regDate: [this._regDate],
      email: [{ value: '', disabled: this.isReadonly }],
      eContactName: [{ value: '', disabled: this.isReadonly }],
      eContactNo: [{ value: '', disabled: this.isReadonly }],
      gurdianName: [{ value: '', disabled: this.isReadonly }],
      studentType: [{ value: 'New', disabled: this.isReadonly }],
      address : [null],
      createdBy :[],
      lookupForm: this.formBuilder.group({
        sessionId: [{ value: 1, disabled: this.isReadonly }, CustomValidator.lookupRequired],
        branchId: [{ value: 1, disabled: this.isReadonly }, CustomValidator.lookupRequired],
        sectionId: [{ value: '0', disabled: this.isReadonly }],
        bloodGroup: [{ value: 'A+', disabled: this.isReadonly }],
        gender: [{ value: 'M', disabled: this.isReadonly }, CustomValidator.lookupRequired],
        religion: [{ value: 'H', disabled: this.isReadonly }, CustomValidator.lookupRequired],
        prevClassId: [{ value: 1, disabled: this.isReadonly }, CustomValidator.lookupRequired],
        classId: [{ value: 1, disabled: this.isReadonly }, CustomValidator.lookupRequired],
        category: [{ value: 'OBC', disabled: this.isReadonly }, CustomValidator.lookupRequired],
        fatherQualifId: [{ value: 0, disabled: this.isReadonly }]
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

  get f() { return this.addStudentForm.controls; }
  get lookupForm(): any { return this.addStudentForm.get('lookupForm'); }
  get permanentAddressForm(): any { return this.addStudentForm.get('permanentAddressForm'); }  
  get genCatRelForm(): any { return this.addStudentForm.get('genCatRelForm'); }

  getLookup() {
    this.addStudentService.getLookup().subscribe(
      data => {
        if (data)
        this.options.session = data[lookupAttribute.Session.outputName];
        this.options.branch = data[lookupAttribute.Branch.outputName];
        this.options.class = data[lookupAttribute.Class.outputName];
        this.options.qualification = data[lookupAttribute.FatherQualification.outputName];
        this.options.gender = data[lookupAttribute.Gender.outputName];
        this.options.category = data[lookupAttribute.Category.outputName];
        this.options.religion = data[lookupAttribute.Religion.outputName];
        this.options.bloodGroup = data[lookupAttribute.BloodGroup.outputName];
      }
    );
  };

  onSubmit() {
    this.submitted = true;    
    if (this.addStudentForm.invalid || this.isReadonly) {
      return;
    }

    this.loading = true;
    if (this.addStudentForm.value) {
      this.addStudentForm.value.sessionId = Number(this.addStudentForm.value.lookupForm.sessionId);
      this.addStudentForm.value.branchId = Number(this.addStudentForm.value.lookupForm.branchId);
      this.addStudentForm.value.classId = Number(this.addStudentForm.value.lookupForm.classId);
      this.addStudentForm.value.prevClassId = Number(this.addStudentForm.value.lookupForm.prevClassId);
      this.addStudentForm.value.sectionId = Number(this.addStudentForm.value.lookupForm.sectionId);
      this.addStudentForm.value.gender = this.addStudentForm.value.lookupForm.gender;
      this.addStudentForm.value.religion =this.addStudentForm.value.lookupForm.religion;
      this.addStudentForm.value.category = this.addStudentForm.value.lookupForm.category;
      this.addStudentForm.value.fatherQualifId = Number(this.addStudentForm.value.lookupForm.fatherQualifId);
      this.addStudentForm.value.bloodGroup = this.addStudentForm.value.lookupForm.bloodGroup;
      this.addStudentForm.value.createdBy = this.authService.loggedUserName();
      this.addStudentForm.value.createdDate = new Date();
      
       //this.addStudentForm.value.countryId = Number(this.addStudentForm.value.permanentAddressForm.countryId);
      this.addStudentForm.value.permanentAddressForm.cityId = Number(this.addStudentForm.value.permanentAddressForm.cityId);
      this.addStudentForm.value.address = this.addStudentForm.value.permanentAddressForm;
    }

    this.addStudentService.saveStudent(this.addStudentForm.value)
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
    this.addStudentForm.reset(); 
    this.addStudentForm.patchValue({regDate : null})  
    this.lookupForm.patchValue({ sessionId: 0, branchId: 0, genderId :0, religionId:0, classId:'0', prevClassId:'0', categoryId:'0', fatherQualifId:'0', bloodGroupId:'0', studentType:'New'});
    this.permanentAddressForm.reset();
    this.permanentAddressForm.patchValue({ countryId: '0', stateId: '0', cityId :'0'});    
  }


  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

}
