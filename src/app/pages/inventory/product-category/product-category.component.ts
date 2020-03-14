import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthService, CommonServices, LookupService } from '../../../_services';
import { ProdCategoryService } from '../product-category/product-category.service';
import { successMessage } from '../../../shared/messages/messages';
import { lookupAttribute } from '../../../shared/lookup-attribute/lookup.attribute';
import { CustomValidator } from '../../../_validation/custom.validation';
@Component({
  selector: 'app-product-category',
  templateUrl: './product-category.component.html',
  styleUrls: []
})

export class ProdCategoryComponent {
  prodCategoryForm: FormGroup;
  loading = false;
  submitted = false;
  public rowData: any;
  public rowSelection: any;
  public gridApi: any;
  public isReadonly = false;
  prodTypeLookupAtr: any = lookupAttribute.ProductType;
  lookup: any;
  prodTypeOptions: any;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private prodCategoryService: ProdCategoryService, private authService: AuthService, private commonServices: CommonServices, private lookupService: LookupService) {
    this.rowSelection = "single";
    this.isReadonly = this.authService.isReadonlyUser();
  }

  columnDefs = [
    { headerName: 'Product Type', field: 'prodTypeName', width: 300 },
    { headerName: 'Category Name', field: 'prodCatName', width: 210 },
    { headerName: 'Category Code', field: 'prodCatCode', width: 220 },
    {
      headerName: 'Created Date', field: 'createdDate', width: 200, cellRenderer: (data: any) => {
        return this.commonServices.setDateFormat(data);
      }
    },
    { headerName: 'Active', field: 'isActive', width: 80 }
  ];


  ngOnInit() {
    this.prodCategoryForm = this.formBuilder.group({
      prodCatId: [0],
      prodCatName: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],
      prodCatCode: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(10)]],
      isActive: [true],
      createdBy: this.authService.loggedUserName(),
      lookupForm: this.formBuilder.group({
        prodTypeId: ['0', CustomValidator.lookupRequired]
      }),
    });
    this.getProductTypeLookup();
    this.getProdCategories();
  }

  get f() { return this.prodCategoryForm.controls; }
  get lookupForm(): any { return this.prodCategoryForm.get('lookupForm'); }

  getProdCategories() {
    this.prodCategoryService.getProdCategories().subscribe(
      data => {
        this.rowData = data;
      },
      error => {
        this.alertService.showError(error);
      },
      () => console.log('done loading values')
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

  onSubmit() {
    this.submitted = true;
    if (this.prodCategoryForm.invalid || this.isReadonly) {
      return;
    }

    this.loading = true;
    if (this.prodCategoryForm.value) {
      this.prodCategoryForm.value.prodTypeId = Number(this.lookupForm.value.prodTypeId);
    }
    this.prodCategoryService.saveProdCategory(this.prodCategoryForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.showSuccess(successMessage.Saved);
          this.resetForm();
          this.getProdCategories();
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
    this.prodCategoryForm.reset();
    this.submitted = false;
    this.loading = false;
    this.prodCategoryForm.patchValue({ prodCatId: 0, isActive: true, createdBy: this.authService.loggedUserName() });
    this.lookupForm.patchValue({ prodTypeId: '0' });
  }

  onSelectionChanged(event : any) {
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      var selectedRow = selectedRows[0];
      this.prodCategoryForm.patchValue({ prodCatId: selectedRow.prodCatId, prodCatName: selectedRow.prodCatName, prodCatCode: selectedRow.prodCatCode, isActive: selectedRow.isActive, createdBy: this.authService.loggedUserName() });
      this.lookupForm.patchValue({ prodTypeId: selectedRow.prodTypeId });
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

}
