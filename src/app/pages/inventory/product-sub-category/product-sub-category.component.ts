import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthService, CommonServices,LookupService } from '../../../_services';
import { ProdSubCategoryService } from '../product-sub-category/product-sub-category.service';
import { successMessage } from '../../../shared/messages/messages';
import { lookupAttribute } from '../../../shared/lookup-attribute/lookup.attribute';
import { CustomValidator } from '../../../_validation/custom.validation';

@Component({
  selector: 'app-product-sub-category',
  templateUrl: './product-sub-category.component.html',
  styleUrls: []
})

export class ProdSubCategoryComponent {
  prodSubCatForm: FormGroup;
  loading = false;
  submitted = false;
  public rowData: any;
  public rowSelection: any;
  public gridApi: any;
  public isReadonly = false;
  prodTypeLookupAtr: any = lookupAttribute.ProductType;
  prodCatLookupAtr: any = lookupAttribute.ProdCategory;
  lookup: any;
  prodTypeOptions: any;
  prodCatOptions: any;
  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private prodSubCategoryService: ProdSubCategoryService, private authService: AuthService, private commonServices: CommonServices, private lookupService: LookupService) {
    this.rowSelection = "single";
    this.isReadonly = this.authService.isReadonlyUser();
  }

  columnDefs = [
    { headerName: 'Product Type', field: 'prodTypeName', width: 200 },
    { headerName: 'Category', field: 'prodCatName', width: 200 },
    { headerName: 'Sub Category', field: 'prodSubCatName', width: 200 },
    { headerName: 'Sub Category Code', field: 'prodSubCatCode', width: 200 },
    {
      headerName: 'Created Date', field: 'createdDate', width: 130, cellRenderer: (data: any) => {
        return this.commonServices.setDateFormat(data);
      }
    },
    { headerName: 'Active', field: 'isActive', width: 80 }
  ];


  ngOnInit() {
    this.prodSubCatForm = this.formBuilder.group({
      prodSubCatId: [0],
      prodSubCatName: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],
      prodSubCatCode: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(10)]],
      isActive: [true],
      createdBy: this.authService.loggedUserName(),
      lookupForm: this.formBuilder.group({
        prodTypeId: [0, CustomValidator.lookupRequired],
        prodCatId: [0, CustomValidator.lookupRequired],
      }),
    });
    this.getProductTypeLookup();   
    this.getProdSubCategories();    
  }

  get f() { return this.prodSubCatForm.controls; }
  get lookupForm(): any { return this.prodSubCatForm.get('lookupForm'); }

  getProdSubCategories() {
    this.prodSubCategoryService.getProdSubCategories().subscribe(
      data => {
        this.rowData = data;
      },
      error => {
        this.alertService.showError(error);
      }
    );
  }

  getProductTypeLookup() {
    this.lookup = { lookupName: lookupAttribute.ProductType.lookupName };
    this.lookupService.getLookup(this.lookup).subscribe(
      data => {
        this.prodTypeOptions = data;
      }
    );
  };

  getProdCatLookup(prodTypeId: any) {
    this.lookup = {id: prodTypeId, lookupName: lookupAttribute.ProdCategory.lookupName };
    this.lookupService.getLookup(this.lookup).subscribe(
      data => {
        this.prodCatOptions = data;
      }
    );
  };

  changeProdType(event: any) {   
    if (event && event.target.value == "0") {
      this.prodCatOptions=[];         
      this.lookupForm.patchValue({ prodTypeId: 0 });   
    }
    else { 
      this.getProdCatLookup(Number(event.target.value));
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.prodSubCatForm.invalid || this.isReadonly) {
      return;
    }

    this.loading = true;
    if (this.prodSubCatForm.value) {
      this.prodSubCatForm.value.prodTypeId = Number(this.lookupForm.value.prodTypeId);
      this.prodSubCatForm.value.prodCatId = Number(this.lookupForm.value.prodCatId);
    }
    this.prodSubCategoryService.saveProdSubCategory(this.prodSubCatForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.showSuccess(successMessage.Saved);
          this.resetForm();
          this.getProdSubCategories();
        },
        error => {
          this.alertService.showError(error);
          this.loading = false;
        });
  }

  clearItem() {    
    this.resetForm();
  }

  resetForm() {
    this.prodSubCatForm.reset();
    this.submitted = false;
    this.loading = false;
    this.prodCatOptions=[];
    this.prodSubCatForm.patchValue({ prodSubCatId: 0, isActive: true, createdBy: this.authService.loggedUserName() });
    this.lookupForm.patchValue({ prodTypeId: 0, prodCatId : 0 });
  }

  onSelectionChanged(event : any) {
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      var selectedRow = selectedRows[0];
      this.prodSubCatForm.patchValue({ prodSubCatId: selectedRow.prodSubCatId, prodSubCatName: selectedRow.prodSubCatName, prodSubCatCode: selectedRow.prodSubCatCode, isActive: selectedRow.isActive, createdBy: this.authService.loggedUserName() });     
      if(selectedRow.prodTypeId){
        this.getProdCatLookup(selectedRow.prodTypeId);
        this.lookupForm.patchValue({ prodTypeId: selectedRow.prodTypeId,  prodCatId : selectedRow.prodCatId});
      } 
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }
}
