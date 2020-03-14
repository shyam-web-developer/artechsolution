import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthService, CommonServices, LookupService } from '../../../_services';
import { ProductService } from '../product/product.service';
import { successMessage } from '../../../shared/messages/messages';
import { lookupAttribute } from '../../../shared/lookup-attribute/lookup.attribute';
import { CustomValidator } from '../../../_validation/custom.validation';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: []
})

export class ProductComponent {
  product : Product
  productForm: FormGroup;
  loading = false;
  submitted = false;  
  public rowData: any;
  public rowSelection: any;
  public gridApi: any;
  public isReadonly = false;
  lookupAttribute: any = { ProductType: lookupAttribute.ProductType, ProdCategory: lookupAttribute.ProdCategory, ProductSubCategory: lookupAttribute.ProdSubCategory, Unit: lookupAttribute.Unit };  
  lookup: any;
  options: any = { prodTypes : [], prodCats: [], prodSubCats: [], units: [] }; 
  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private productService: ProductService, private authService: AuthService,private commonServices: CommonServices, private lookupService: LookupService) {
    this.rowSelection = "single";
    this.isReadonly = this.authService.isReadonlyUser();
  }

  columnDefs = [
    { headerName: 'Product Type', field: 'prodName', width: 300 },
    { headerName: 'Prod Code', field: 'prodCode', width: 200 },
    { headerName: 'Created Date', field: 'createdDate', width: 200, cellRenderer: (data : any) => {
      return this.commonServices.setDateFormat(data);
 } },
    { headerName: 'Active', field: 'isActive', width: 80 }
  ];


  ngOnInit() {
    this.productForm = this.formBuilder.group({
      productId: [0],
      prodName: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(50)]],
      prodCode: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(10)]],
      prodDesc: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(200)]],
      shortName: [{ value: '', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(20)]],
      sGST: [{ value: 0, disabled: this.isReadonly }, [Validators.required, Validators.maxLength(20)]],
      cGST: [{ value: 0, disabled: this.isReadonly }, [Validators.required, Validators.maxLength(20)]],
      mrp: [{ value: 0, disabled: this.isReadonly }, [Validators.required, Validators.maxLength(20)]],
      salePrice: [{ value: 0, disabled: this.isReadonly }, [Validators.required, Validators.maxLength(20)]],      
      isActive: [{ value : true, disabled: this.isReadonly }],
      createdBy: this.authService.loggedUserName(),
      stockBalance : [0],
      lookupForm: this.formBuilder.group({
        prodTypeId: [{ value : '0', disabled: this.isReadonly }, [CustomValidator.lookupRequired]],
        unitId: [{ value : '0', disabled: this.isReadonly }, [CustomValidator.lookupRequired]],
        prodCatId: [{ value : '0', disabled: this.isReadonly }, [CustomValidator.lookupRequired]],
        prodSubCatId: [{ value : '0', disabled: this.isReadonly }, [CustomValidator.lookupRequired]],
      }),
    });   
    this.getProducts();
    this.getProductTypeLookup();
    this.getUnitLookup();
  }

  get f() { return this.productForm.controls; }
  get lookupForm(): any { return this.productForm.get('lookupForm'); }

  getProducts() {
    this.productService.getProducts().subscribe(
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
    if (this.productForm.invalid || this.isReadonly) {
      return;
    }

    this.loading = true;
    if (this.productForm.value) {
      this.productForm.value.unitId = Number(this.lookupForm.value.unitId);
      this.productForm.value.prodSubCatId = Number(this.lookupForm.value.prodSubCatId);
      this.productForm.value.mrp = Number(this.productForm.value.mrp);
      this.productForm.value.salePrice = Number(this.productForm.value.salePrice);
      this.productForm.value.sGST = Number(this.productForm.value.sGST);
      this.productForm.value.cGST = Number(this.productForm.value.cGST);
    }

    this.productService.saveProduct(this.productForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.showSuccess(successMessage.Saved);
          this.getProducts();     
          this.clearItem();
        },
        error => {
          this.alertService.showError(error);
          this.loading = false;
        });
  }

  getProductTypeLookup() {
    this.lookup = { lookupName: lookupAttribute.ProductType.lookupName };
    this.lookupService.getLookup(this.lookup).subscribe(
      data => {
        this.options.prodTypes = data;
      }
    );
  };

  getUnitLookup() {
    this.lookup = { lookupName: lookupAttribute.Unit.lookupName };
    this.lookupService.getLookup(this.lookup).subscribe(
      data => {
        this.options.units = data;
      }
    );
  };

  getProdCatLookup(prodTypeId: any) {
    this.lookup = {id: prodTypeId, lookupName: lookupAttribute.ProdCategory.lookupName };
    this.lookupService.getLookup(this.lookup).subscribe(
      data => {
        this.options.prodCats = data;
      }
    );
  };

  getProdSubCatLookup(prodCatId: any) {
    this.lookup = {id: prodCatId, lookupName: lookupAttribute.ProdSubCategory.lookupName };
    this.lookupService.getLookup(this.lookup).subscribe(
      data => {
        this.options.prodSubCats = data;
      }
    );
  };

  changeProdType(event: any) {
    this.options.prodCats = [];
    this.options.prodSubCats = [];
    this.lookupForm.patchValue({ prodCatId: 0, prodSubCatId: 0 });
    if (event && event.target.value > 0) {
      this.getProdCatLookup(Number(event.target.value));
    }
  }

  changeProdCat(event: any) { 
    this.options.prodSubCats = [];
    this.lookupForm.patchValue({ prodSubCatId: 0 });
    if (event && event.target.value > 0) {
      this.getProdSubCatLookup(Number(event.target.value));   
    }    
  }

  clearItem() {       
    this.submitted = false;    
    this.loading = false;
    this.options.prodCats=[];
    this.options.prodSubCats=[];
    this.productForm.patchValue({ isActive : true, prodName : '', prodCode : '' });
    this.lookupForm.patchValue({ prodTypeId : '0', prodCatId: '0' , prodSubCatId : '0'});
  }

  onSelectionChanged(event : any) {
    var selectedRows = this.gridApi.getSelectedRows();
    if (selectedRows && selectedRows.length > 0) {
      var selectedRow = selectedRows[0];
      this.productForm.patchValue({ isActive : selectedRow.isActive});
      this.lookupForm.patchValue({ prodTypeId: selectedRow.prodTypeId, prodCatId: selectedRow.prodCatId, prodSubCatId: selectedRow.prodSubCatId, isActive: selectedRow.isActive })
    }
  }

  onGridReady(params: any) {
    this.gridApi = params.api;
  }

}
