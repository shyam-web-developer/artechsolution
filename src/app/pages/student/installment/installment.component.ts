import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthService, CommonServices, LookupService } from '../../../_services';
import { InstallmentService } from '../installment/installment.service';
import { successMessage } from '../../../shared/messages/messages';
import { lookupAttribute } from '../../../shared/lookup-attribute/lookup.attribute';
import { CustomValidator } from '../../../_validation/custom.validation';
import { FlatpickrOptions } from 'ng2-flatpickr';
@Component({
  selector: 'app-installment',
  templateUrl: './installment.component.html',
  styleUrls: []
})

export class InstallmentComponent {
  installmentForm: FormGroup;
  loading = false;
  submitted = false;
  public rowData: any;
  public rowSelection: any;
  public gridApi: any;
  public isReadonly = false;
  lookupAttribute: any = { fromMonth: lookupAttribute.FromMonths, toMonth: lookupAttribute.ToMonths, installmentType: lookupAttribute.InstallmentType,InstallmentPlan: lookupAttribute.InstallmentPlan };
  lookup: any;
  options: any = {months : [], InstallmentPlans : [], installmentTypes : []}

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private installmentService: InstallmentService, private authService: AuthService, private commonServices: CommonServices, private lookupService: LookupService) {
    this.rowSelection = "single";
    this.isReadonly = this.authService.isReadonlyUser();
  }

  columnDefs = [
    { headerName: 'Installment', field: 'installmentPlan', width: 100 },
    { headerName: 'Installment Type', field: 'installmentType', width: 120 },
    { headerName: 'Name', field: 'instName', width: 150 },   
    { headerName: 'From Month', field: 'fromMonth', width: 150 }, 
    { headerName: 'To Month', field: 'toMonth', width: 150 }, 
    {
      headerName: 'From Date', field: 'fromDate', width: 100, cellRenderer: (data: any) => {
        return this.commonServices.setDateFormat(data);
      }
    },
    {
      headerName: 'To Date', field: 'toDate', width: 100, cellRenderer: (data: any) => {
        return this.commonServices.setDateFormat(data);
      }
    },
    {
      headerName: 'Fee Submit Date', field: 'feeSubmitDate', width: 100, cellRenderer: (data: any) => {
        return this.commonServices.setDateFormat(data);
      }
    },
    {
      headerName: 'Due Date', field: 'dueDate', width: 100, cellRenderer: (data: any) => {
        return this.commonServices.setDateFormat(data);
      }
    },
    {
      headerName: 'Created Date', field: 'createdDate', width: 100, cellRenderer: (data: any) => {
        return this.commonServices.setDateFormat(data);
      }
    },
    { headerName: 'Active', field: 'isActive', width: 80 }
  ];


  ngOnInit() {
    this.installmentForm = this.formBuilder.group({
      installmentId: [0],
      instName: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],
      fromDate: [{ value: '', disabled: this.isReadonly }, [Validators.required]],
      toDate: [{ value: '', disabled: this.isReadonly }, [Validators.required]],
      dueDate: [{ value: '', disabled: this.isReadonly }, [Validators.required]],
      feeSubmitDate: [{ value: '', disabled: this.isReadonly }, [Validators.required]],
      isActive: [true],
      createdBy: this.authService.loggedUserName(),
      lookupForm: this.formBuilder.group({
        installmentPlan: ['0', CustomValidator.lookupRequired],
        installmentType: ['0', CustomValidator.lookupRequired],
        fromMonth: ['0', CustomValidator.lookupRequired],
        toMonth: ['0', CustomValidator.lookupRequired],
      }),
    });

    this.getLookup();       
  }

  get f() { return this.installmentForm.controls; }
  get lookupForm(): any { return this.installmentForm.get('lookupForm'); }
 

  getLookup() {
    this.installmentService.getInstallments().subscribe(
      data => {
        if (data)
        this.options.months = data[lookupAttribute.FromMonths.outputName];
        this.options.installmentTypes = data[lookupAttribute.InstallmentType.outputName];
        this.options.installmentPlans = data[lookupAttribute.InstallmentPlan.outputName];  
        this.rowData =  data['feeInstallments'];    
      }
    );
  };  

  getInstallments() {
    this.installmentService.getInstallments().subscribe(
      data => {        
        this.rowData = data;
      },
      error => {
        this.alertService.showError(error);
      }
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.installmentForm.invalid || this.isReadonly) {
      return;
    }

    this.loading = true;  
    if (this.installmentForm.value) {
      this.installmentForm.value.fromMonth = this.installmentForm.value.lookupForm.fromMonth;
      this.installmentForm.value.toMonth = this.installmentForm.value.lookupForm.toMonth;
      this.installmentForm.value.installmentPlan = this.installmentForm.value.lookupForm.installmentPlan;
      this.installmentForm.value.installmentType = this.installmentForm.value.lookupForm.installmentType;      
    }
    
    this.installmentService.saveInstallment(this.installmentForm.value)
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
    this.submitted = false;
    this.loading = false;
    this.installmentForm.reset();    
    this.installmentForm.patchValue({ installmentId: 0, isActive: true, createdBy: this.authService.loggedUserName() });    
    this.lookupForm.patchValue({ installmentPlan: '0', installmentType: '0', fromMonth : '0',toMonth : '0' });
  }

  onSelectionChanged(event : any) {
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      var selectedRow = selectedRows[0];
      this.installmentForm.patchValue({ installmentId: selectedRow.installmentId, instName: selectedRow.instName, fromDate: selectedRow.fromDate, toDate: selectedRow.toDate,dueDate: selectedRow.dueDate, feeSubmitDate: selectedRow.feeSubmitDate,isActive: selectedRow.isActive, createdBy: this.authService.loggedUserName() });
      this.lookupForm.patchValue({ installment: selectedRow.installment, installmentType: selectedRow.installmentType, fromMonth : selectedRow.fromMonth,toMonth : selectedRow.toMonth });
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

  public fromDateOptions: FlatpickrOptions = {     
    dateFormat: 'm-d-Y',
    onChange: function (parent) {
      return function (selectedDates, dateStr, instance) {
        let fromDate = new Date(dateStr);
        parent.installmentForm.controls['fromDate'].setValue(fromDate);
      };
    }(this)
  };
  public toDateOptions: FlatpickrOptions = {
    
    dateFormat: 'm-d-Y',
    onChange: function (parent) {
      return function (selectedDates, dateStr, instance) {
        let toDate = new Date(dateStr);
        parent.installmentForm.controls['toDate'].setValue(toDate);
      };
    }(this)
  };
  public dueDateOptions: FlatpickrOptions = {   
    dateFormat: 'm-d-Y',
    onChange: function (parent) {
      return function (selectedDates, dateStr, instance) {
        let dueDate = new Date(dateStr);
        parent.installmentForm.controls['dueDate'].setValue(dueDate);
      };
    }(this)
  };

  public feeSubmitDateOptions: FlatpickrOptions = {   
    dateFormat: 'm-d-Y',
    onChange: function (parent) {
      return function (selectedDates, dateStr, instance) {
        let feeSubmitDate = new Date(dateStr);
        parent.installmentForm.controls['feeSubmitDate'].setValue(feeSubmitDate);
      };
    }(this)
  };

}
