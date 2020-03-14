import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthService, CommonServices, LookupService } from '../../../_services';
import { FeeStructureService } from './fee-structure.service';
import { successMessage } from '../../../shared/messages/messages';
import { lookupAttribute } from '../../../shared/lookup-attribute/lookup.attribute';

@Component({
  selector: 'app-fee-structure',
  templateUrl: './fee-structure.component.html',
  styles: ['thead {color:green; width:50%}  tbody {color:blue;}  tfoot {color:red;}  table, th, td {    border: 1px solid black;  } ']
})

export class FeeStructureComponent {
  feeStructureForm: FormGroup;
  feeInstallmentSetupForm: FormGroup;
  loading = false;
  submitted = false;
  public rowData: any; 
  public isReadonly = false;  
  options: any = { classes: [], feeComponents: [], feeStructures: [], feeInstallments : [], feeInstallmentSetups : [], studentTypes : [] }  
  feeClassComps = [];  
   private parameter : any;
   private feeInstallments = [];
  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private feeStructureService: FeeStructureService, private authService: AuthService, private commonServices: CommonServices, private lookupService: LookupService) {
    this.isReadonly = this.authService.isReadonlyUser();    
  }

  ngOnInit() {
    this.feeStructureForm = this.formBuilder.group({
      feeSetupId: [0],
      branchId : [1],
      sessionId : [1],
      isActive : [true],
      createdBy : [this.authService.loggedUserName()],
      createdDate : [new Date()],
      feeSetups : [],
      compForm: this.formBuilder.array([
      ]),
    });

    this.feeInstallmentSetupForm = this.formBuilder.group({
      feeCompSetupId: [0],
      branchId : [1],
      sessionId : [1],
      studentType : ['New'],
      isActive : [true],
      createdBy : [this.authService.loggedUserName()],
      createdDate : [new Date()],
      feeInstallments : [],
      compInstallForm: this.formBuilder.array([
      ]),
    });
    
    this.parameter = {sessionId : 1, branchId :1};
    this.getFeeStructures();
   
  }

  get compForm(): any { return this.feeStructureForm.get('compForm') as FormArray; }
  get compInstallForm(): any { return this.feeInstallmentSetupForm.get('compInstallForm') as FormArray; }

  createClass(element: any, feeCompId: any): FormGroup {
    return this.formBuilder.group({
      feeCompId: [feeCompId],
      classId: [element.itemKey],
      amount: [this.getAmount(feeCompId, element.itemKey)]
    })
  }

  createComponent(element: any): FormGroup {
    return this.formBuilder.group({
      feeCompId: [element.itemKey],
      compName: [element.itemValue],
      classForm: this.formBuilder.array([
      ])
    })
  }

  getAmount(feeCompId : string, classId: string){
    var feeRow =  this.options.feeStructures.filter(
      (fee : any) => fee.classId == classId && fee.feeCompId == feeCompId);

      return feeRow && feeRow.length > 0 ? feeRow[0].amount.toString()  : null;
  } 

  getIsToPaid(feeCompId : string, installment: string){
    var feeRow =  this.options.feeInstallmentSetups.filter(
      (fee : any) => fee.installment == installment && fee.feeCompId == feeCompId);

      return feeRow && feeRow.length > 0 ? feeRow[0].isToPaid  : false;
  } 


  createInstallment(element: any, feeCompId: any): FormGroup {
    return this.formBuilder.group({
      feeCompId: [feeCompId],
      installment: [element.itemKey],
      isToPaid: [this.getIsToPaid(feeCompId, element.itemKey)]
    })
  }

  createCompInstallment(element: any): FormGroup {
    return this.formBuilder.group({
      feeCompId: [element.itemKey],
      compName: [element.itemValue],
      installmentForm: this.formBuilder.array([
      ])
    })
  }


  getFeeStructures() {
    this.rowData = []
    this.feeStructureService.getFeeStructures(this.parameter).subscribe(
      data => {
        this.options.classes = data[lookupAttribute.Class.outputName];
        this.options.feeComponents = data[lookupAttribute.FeeComponent.outputName];
        this.options.feeInstallments = data[lookupAttribute.FeeInstallment.outputName];
        this.options.studentTypes = data[lookupAttribute.StudentType.outputName];
        this.options.feeStructures = data['feeStructures']; 
        this.options.feeInstallmentSetups = data['feeInstallmentSetups']; 
        this.createFeeStructure();
        this.createFeeInstallmentSetup();
      },
      error => {
        this.alertService.showError(error);
      }
    );
  }

  createFeeStructure() {
    this.options.feeComponents.forEach((element: any, index: number) => {
      this.compForm.push(this.createComponent(element));
      // const control = (this.compForm).at(index).get('classForm') as FormArray;           
      this.options.classes.forEach((item: any) => {
        //control.push(this.createClass(item, element.itemKey));               
        (<FormArray>(<FormGroup>(<FormArray>this.feeStructureForm.controls['compForm'])
          .controls[index]).controls['classForm']).push(this.createClass(item, element.itemKey));
      });
    });
  }

  createFeeInstallmentSetup() {
    this.options.feeComponents.forEach((element: any, index: number) => {
      this.compInstallForm.push(this.createCompInstallment(element));
      // const control = (this.compInstallForm).at(index).get('installmentForm') as FormArray;           
      this.options.feeInstallments.forEach((item: any) => {
        //control.push(this.createInstallment(item, element.itemKey));               
        (<FormArray>(<FormGroup>(<FormArray>this.feeInstallmentSetupForm.controls['compInstallForm'])
          .controls[index]).controls['installmentForm']).push(this.createInstallment(item, element.itemKey));
      });
    });
  }

  createDataToSave() {
    this.feeClassComps = [];
    this.compForm.controls.forEach((element: any, index: number) => {
      const control = (this.compForm).at(index).get('classForm') as FormArray;
      control.controls.forEach((element: any, index: number) => {
        this.feeClassComps.push(element.value);
      });
    });
  }

  createInstallmentSetupSave() {
    this.feeInstallments = [];
    this.compInstallForm.controls.forEach((element: any, index: number) => {
      const control = (this.compInstallForm).at(index).get('installmentForm') as FormArray;
      control.controls.forEach((element: any, index: number) => {
        this.feeInstallments.push(element.value);
      });
    });
  }



  refreshFeestructure() {

  }

  saveFeestructure() {
    this.createDataToSave();

    this.submitted = true;
    if (this.feeStructureForm.invalid || this.isReadonly) {
      return;
    }

    this.loading = true;
    if (this.feeStructureForm.value) {
      this.feeStructureForm.value.feeSetups = this.feeClassComps;
    }

    this.feeStructureService.saveFeeStructure(this.feeStructureForm.value)
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

  saveInstallmentSetup() {
    this.createInstallmentSetupSave();

    this.submitted = true;
    if (this.feeInstallmentSetupForm.invalid || this.isReadonly) {
      return;
    }

    this.loading = true;
    if (this.feeInstallmentSetupForm.value) {
      this.feeInstallmentSetupForm.value.feeInstallments = this.feeInstallments;
    }

    this.feeStructureService.saveFeeInstallmentSetup(this.feeInstallmentSetupForm.value)
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

}
