import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthService, CommonServices } from '../../../_services';
import { ProductTypeService } from '../product-type/product-type.service';
import { successMessage } from '../../../shared/messages/messages';


@Component({
  selector: 'app-productType',
  templateUrl: './product-type.component.html',
  styleUrls: []
})

export class ProductTypeComponent {
  prodTypeForm: FormGroup;
  loading = false;
  submitted = false;  
  public rowData: any;
  public rowSelection: any;
  public gridApi: any;
  public isReadonly = false;
  @ViewChild("productType", {static: true}) firstField: ElementRef;  

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private productTypeService: ProductTypeService, private authService: AuthService,private commonServices: CommonServices) {
    this.rowSelection = "single";
    this.isReadonly = this.authService.isReadonlyUser();
  }

  columnDefs = [
    { headerName: 'Product Type', field: 'prodTypeName', width: 300 },
    { headerName: 'Prod Code', field: 'prodTypeCode', width: 200 },
    { headerName: 'Created Date', field: 'createdDate', width: 200, cellRenderer: (data : any) => {
      return this.commonServices.setDateFormat(data);
 } },
    { headerName: 'Active', field: 'isActive', width: 80 }
  ];


  ngOnInit() {
    this.prodTypeForm = this.formBuilder.group({
      prodTypeId: [0],
      prodTypeName: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],
      prodTypeCode: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(10)]],
      isActive: [true],
      createdBy: this.authService.loggedUserName()
    });    
    this.getProductTypes();
    this.firstField.nativeElement.focus();
  }

  get f() { return this.prodTypeForm.controls; }

  getProductTypes() {
    this.productTypeService.getProductTypes().subscribe(
      data => {       
        this.rowData = data;
      },
      error => {
        this.alertService.showError(error);
      },
      () => console.log('done loading values')
    );
  }

  onSubmit() {
    this.submitted = true;
    if (this.prodTypeForm.invalid || this.isReadonly) {
      return;
    }

    this.loading = true;
    this.productTypeService.saveProductType(this.prodTypeForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.showSuccess(successMessage.Saved);
          this.clearItem();
          this.getProductTypes();
        },
        error => {
          this.alertService.showError(error);
          this.loading = false;
        });
  }

  clearItem() { 
    this.loading = false;
    this.submitted = false;
    this.prodTypeForm.reset();    
    this.firstField.nativeElement.focus();
    this.prodTypeForm.patchValue({prodTypeId: 0, isActive: true, createdBy: this.authService.loggedUserName()});
  } 

  onSelectionChanged(event : any) {
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      var selectedRow = selectedRows[0]
      this.prodTypeForm.patchValue({ prodTypeId: selectedRow.prodTypeId, prodTypeName: selectedRow.prodTypeName, prodTypeCode: selectedRow.prodTypeCode, isActive: selectedRow.isActive, createdBy: this.authService.loggedUserName() })
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

}
