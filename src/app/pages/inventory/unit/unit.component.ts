import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthService, CommonServices } from '../../../_services';
import { UnitService } from '../unit/unit.service';
import { successMessage } from '../../../shared/messages/messages';
import { CustomValidator } from '../../../_validation/custom.validation';

@Component({
  selector: 'app-unit',
  templateUrl: './unit.component.html',
  styleUrls: []
})

export class UnitComponent {
  unitForm: FormGroup;
  loading = false;
  submitted = false;
  public rowData: any;
  public rowSelection: any;
  public gridApi: any;
  public isReadonly = false; 
  @ViewChild("unit", {static: true}) firstField: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private unitService: UnitService, private authService: AuthService, private commonServices: CommonServices) {
    this.rowSelection = "single";
    this.isReadonly = this.authService.isReadonlyUser();
  }

  columnDefs = [    
    { headerName: 'Unit Name', field: 'unitName', width: 300 },
    { headerName: 'Unit Code', field: 'unitCode', width: 200 },
    {
      headerName: 'Created Date', field: 'createdDate', width: 200, cellRenderer: (data: any) => {
        return this.commonServices.setDateFormat(data);
      }
    },
    { headerName: 'Active', field: 'isActive', width: 80 }
  ];


  ngOnInit() {
    this.unitForm = this.formBuilder.group({
      unitId: [0],
      decimalPlaces: [{ value: 2, disabled: this.isReadonly }, [Validators.required]],
      conversionFactor: [{ value: 1, disabled: this.isReadonly }, [Validators.required]],
      unitName: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],
      unitCode: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(10)]],
      isActive: [true],
      createdBy: this.authService.loggedUserName()
    });    
    this.getUnits();
    this.firstField.nativeElement.focus();
  }

  get f() { return this.unitForm.controls; }  

  getUnits() {
    this.unitService.getUnits().subscribe(
      data => {
        this.rowData = data;
      },
      error => {
        this.alertService.showError(error)
      }
    );
  }  

  onSubmit() {
    this.submitted = true;
    if (this.unitForm.invalid || this.isReadonly) {
      return;
    }

    this.loading = true;  
    
    if (this.unitForm.value) {
      this.unitForm.value.decimalPlaces = Number(this.unitForm.value.decimalPlaces);
      this.unitForm.value.conversionFactor = Number(this.unitForm.value.conversionFactor);     
    }

    this.unitService.saveUnit(this.unitForm.value)
      .pipe(first())
      .subscribe(
        data => {          
          this.alertService.showSuccess(successMessage.Saved)
          this.getUnits();
          this.clearItem();
        },
        error => {
          this.alertService.showError(error)
          this.loading = false;
        });
  }

  clearItem() {    
    this.loading = false;
    this.submitted = false;
    this.firstField.nativeElement.focus();
    this.unitForm.patchValue({ isActive: true , unitId : 0, unitName : '', unitCode : '', conversionFactor : 0, decimalPlaces : 0});    
  }  

  onSelectionChanged(event : any) {
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      var selectedRow = selectedRows[0]
      this.unitForm.patchValue({ unitId: selectedRow.unitId, unitName: selectedRow.unitName, unitCode: selectedRow.unitCode, isActive: selectedRow.isActive, conversionFactor : selectedRow.conversionFactor, decimalPlaces : selectedRow.conversionFactor })      
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

}
