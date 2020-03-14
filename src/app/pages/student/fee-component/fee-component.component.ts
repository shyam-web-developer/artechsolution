import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthService, CommonServices } from '../../../_services';
import { FeeComponentService } from '../fee-component/fee-component.service';
import { successMessage } from '../../../shared/messages/messages';

@Component({
  selector: 'app-fee-component',
  templateUrl: './fee-component.component.html',
  styleUrls: []
})

export class FeeComponent {  
  feeComponentForm: FormGroup;
  loading = false;
  submitted = false;  
  @ViewChild("compName", {static: true}) firstField: ElementRef;  
  public rowData: any;
  public rowSelection: any;
  public gridApi: any;
  public isReadonly = false;

  constructor(
    private formBuilder: FormBuilder,     
    private alertService: AlertService,
    private feeComponentService: FeeComponentService, private authService: AuthService, private commonServices: CommonServices) {
      this.rowSelection = "single";
     }

    columnDefs = [
      { headerName: 'Comp Name', field: 'compName', width: 210 },
      { headerName: 'Comp Code', field: 'compCode', width: 145 },     
      {
        headerName: 'Created Date', field: 'createdDate', width: 150, cellRenderer: (data: any) => {
          return this.commonServices.setDateFormat(data);
        }
      },
      { headerName: 'Active', field: 'isActive', width: 100 }
    ];
  ngOnInit() {   
    this.feeComponentForm = this.formBuilder.group({ 
      feeCompId: [0],
      compName: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],
      compCode: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(10)]],
      isActive: [true],
      createdBy: this.authService.loggedUserName(),
      createdDate: new Date(),
    });   
    this.firstField.nativeElement.focus(); 
    this.getFeeComponents();
  }  

  get f() { return this.feeComponentForm.controls; }  

  getFeeComponents() {
    this.feeComponentService.getFeeComponent().subscribe(
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
    if (this.feeComponentForm.invalid || this.isReadonly) {
      return;
    }

    this.loading = true;
    this.feeComponentService.saveFeeComponent(this.feeComponentForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.showSuccess(successMessage.Saved);
          this.clearItem();
          this.getFeeComponents();
        },
        error => {
          this.alertService.showError(error);
          this.loading = false;
        });
  }

  onSelectionChanged(event: any) {
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      var selectedRow = selectedRows[0]
      this.feeComponentForm.patchValue({ feeCompId: selectedRow.feeCompId, compName: selectedRow.compName, compCode: selectedRow.compCode, isActive: selectedRow.isActive, createdBy: this.authService.loggedUserName() });      
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }
  
  clearItem() {
    this.loading = false;
    this.submitted = false;
    this.feeComponentForm.reset();
    this.feeComponentForm.patchValue({ feeCompId: 0});
    this.firstField.nativeElement.focus();
  } 
}
