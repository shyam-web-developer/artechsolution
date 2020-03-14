import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthService, CommonServices, LookupService } from '../../../_services';
import { ProdReceiveService } from '../product-receive/product-receive.service';
import { successMessage, errorMessage } from '../../../shared/messages/messages';
import { lookupAttribute } from '../../../shared/lookup-attribute/lookup.attribute';
import { CustomValidator } from 'src/app/_validation/custom.validation';

@Component({
  selector: 'app-product-receive',
  templateUrl: './product-receive.component.html',
  styleUrls : ['./product-receive.component.css'], 
})

export class ProdReceiveComponent {
  purchaseForm: FormGroup;
  productAddForm: FormGroup;
  paymentForm: FormGroup;
  vendorForm: FormGroup;
  loading = false;
  submitted = false;
  public rowData: any;
  public isReadonly = false;
  public isSearchedCustomer = false; 
  public isAddedItem = false;  
  lookupAttribute: any = { Product: lookupAttribute.Product, Unit: lookupAttribute.UnitInItem, PaymentType : lookupAttribute.PaymentType };
  lookup: any;
  options: any = { products: [], productDetail: [], units:[], paymentTypes : [] }
  private productDetail: any;
  productItems = [];

  private parameter: any;  
  public amounts : any = {totalQuantity : 0,  netAmount : 0, totalAmount : 0, totalSGST : 0, totalCGST : 0, totalDues : 0, totalDiscount : 0, paidAmount :0};
  @ViewChild("quantity", {static: true}) firstField: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private authService: AuthService, private commonServices: CommonServices, private lookupService: LookupService, private prodReceiveService : ProdReceiveService) {
    this.isReadonly = this.authService.isReadonlyUser();
  }

  ngOnInit() {
    this.productAddForm = this.formBuilder.group({
      quantity: [null, Validators.required],
      lookupForm: this.formBuilder.group({
        productId: ['0', CustomValidator.lookupRequired]
      }),
    });

    this.paymentForm = this.formBuilder.group({
      paidAmount: [null, Validators.required],
      totalDiscount: [0],
      venderMobNo :[0],
      venderId : [0, Validators.required],
      lookupForm: this.formBuilder.group({
        paymentType: ['Cash', CustomValidator.lookupRequired]
      }),
    });

    this.vendorForm = this.formBuilder.group({     
      venderMobNo :[null],
      lookupForm: this.formBuilder.group({
        venderId: [0, CustomValidator.lookupRequired]
      }),            
    });

    this.purchaseForm = this.formBuilder.group({   
      purchaseId:[0],   
      quantity: [0],
      totalQuantity: [0],
      totalItems: [0],
      netAmount: [0],
      totalAmount: [0],
      paidAmount: [0],
      totalDiscount: [0],
      totalSGST: [0],
      totalCGST: [0],
      paymentType: [''],
      venderId : [0],
      venderMobNo :[0],
      isActive: [true],     
      createdBy: [this.authService.loggedUserName()],
      createdDate: [new Date()],      
      productForm: this.formBuilder.array([
      ]),
      lookupPurchaseForm: this.formBuilder.group({
        unitId: [{value :'0', disabled : true}, CustomValidator.lookupRequired]
      }),
    });
    this.getLookup();
    this.parameter = { sessionId: 1, branchId: 1 };
  }

  getLookup() {
    this.lookup = { lookupName: lookupAttribute.Product.lookupName };
    this.lookupService.getLookup(this.lookup).subscribe(
      data => {
        this.options.products = data;
      }
    );
  };
  get f() { return this.productAddForm.controls; }
  get payment() { return this.paymentForm.controls; }
  get lookupForm(): any { return this.productAddForm.get('lookupForm'); }
  get lookupPurchaseForm(): any { return this.purchaseForm.get('lookupPurchaseForm'); }
  get productForm(): any { return this.purchaseForm.get('productForm') as FormArray; }


  createProductItem(element: any): FormGroup {
    return this.formBuilder.group({
      prodName: [element.prodName],
      unitId: [element.unitId],
      productId: [element.productId],
      stockBalance: [element.stockBalance],
      salePrice: [element.salePrice],
      quantity: [element.quantity],
      amount: [element.amount],
      sgst: [element.sgst],
      cgst: [element.cgst]
    })
  }

  getAmount(quantity: number, price: number) {
    return quantity * price;
  }

  getCGST(amount: number, cgst: number) {
    return (amount * cgst) / 100;
  }

  getSGST(amount: number, sgst: number) {
    return (amount * sgst) / 100;
  }

  getProductDetail(productId: number) {
    this.productDetail = {};
    this.prodReceiveService.getProductDetail(productId).subscribe(
      data => {
        this.productDetail = data['productDetail'] ? data['productDetail'][0] : {};
        this.options.units = data[lookupAttribute.Unit.outputName];
        this.options.paymentTypes = data[lookupAttribute.PaymentType.outputName];
      },
      error => {
        this.alertService.showError(error);
      }
    );
  }

  setDisable = function () {
        return !(this.isSearchedCustomer && this.isAddedItem);
  };

  searchVendor() {
    if (this.vendorForm.value.venderMobNo) {
      this.paymentForm.patchValue({ venderMobNo: this.vendorForm.value.venderMobNo });
      this.isSearchedCustomer = true;
    }
  }

  onDiscount() {
    if (this.amounts.totalAmount ==0){
      this.payment.totalDiscount.patchValue(0);
      return;
    }
    
    if (this.amounts.paidAmount > 0 && this.payment.totalDiscount.value && this.amounts.paidAmount >= Number(this.payment.totalDiscount.value)) {
      this.amounts.paidAmount = this.amounts.totalAmount - Number(this.payment.totalDiscount.value);      
    }
    else {
      this.amounts.paidAmount = this.amounts.totalAmount      
    }
    this.payment.paidAmount.patchValue(this.amounts.paidAmount);
    this.purchaseForm.patchValue({paidAmount :this.amounts.paidAmount, totalDiscount:  Number(this.payment.totalDiscount.value)});
  }

  onReceive() {
    if (this.payment.paidAmount.value) {
      this.amounts.totalDues = this.amounts.paidAmount - Number(this.payment.paidAmount.value);      
    }
    else {
      this.amounts.totalDues = this.amounts.paidAmount;
    }    
    this.purchaseForm.patchValue({totalDues :this.amounts.paidAmount, paidAmount : Number(this.payment.paidAmount.value)});
  }
  

  addProductItem() {
    this.submitted = true;
    if (this.productAddForm.invalid || this.f.quantity.value == '0') {
      return;
    }
    var index = this.productForm.value.findIndex((x: any) => x.productId === Number(this.lookupForm.value.productId));
    if (index != -1) {         
      //this.alertService.showError(errorMessage.AlreadyAddedItem);
      //return;
    }   

    this.submitted = false;
    if (this.lookupForm.value && this.lookupForm.value.productId && this.productDetail) {
      let amount = this.getAmount(Number(this.productDetail.salePrice), Number(this.f.quantity.value))
      this.productDetail.amount = amount;
      this.productDetail.quantity = Number(this.f.quantity.value);
      this.lookupPurchaseForm.patchValue({unitId :this.productDetail.unitId});      
      this.productForm.push(this.createProductItem(this.productDetail));
      this.calTotalAmount();
      this.productAddForm.patchValue({ quantity: [] });
      this.lookupForm.patchValue({ productId: '0' });   
      this.isAddedItem =true;
    }
  }

  onRemoveRow(rowIndex:number){
    this.productForm.removeAt(rowIndex);
    this.calTotalAmount();
    this.isAddedItem = this.productForm.length > 0 ? true : false;
    this.paymentForm.patchValue({totalDiscount : 0});
  }

  calTotalAmount() {
    this.amounts.netAmount = 0;
    this.amounts.totalQuantity = 0;
    this.amounts.totalSGST = 0;
    this.amounts.totalCGST = 0;
    this.amounts.totalAmount = 0;
    this.productForm.controls.forEach((item: any) => {
      this.amounts.netAmount = this.amounts.netAmount + item.value.amount;
      this.amounts.totalQuantity = this.amounts.totalQuantity + item.value.quantity;
      let totalCGST = this.getCGST(item.value.amount, item.value.cgst);
      let totalSGST = this.getSGST(item.value.amount, item.value.sgst);
      this.amounts.totalSGST = this.amounts.totalSGST + totalSGST;
      this.amounts.totalCGST = this.amounts.totalCGST + totalCGST;
      this.amounts.totalAmount = Number(parseFloat(this.amounts.netAmount + this.amounts.totalSGST + this.amounts.totalCGST).toFixed(2));
    });
      this.purchaseForm.patchValue({totalSGST :this.amounts.totalSGST, totalCGST: this.amounts.totalCGST, netAmount:this.amounts.netAmount , totalAmount: this.amounts.totalAmount , totalQuantity : this.amounts.totalQuantity, paidAmount : this.amounts.totalAmount});  
      this.payment.paidAmount.patchValue(this.amounts.totalAmount);   
  }

  changeProduct(event: any) {
    this.firstField.nativeElement.focus();
    if (event && event.target.value > 0) {
      this.getProductDetail(Number(event.target.value));
    }
  }

  createDataToSave() {
    this.productItems = [];
    this.productForm.controls.forEach((element: any, index: number) => {
      this.productItems.push(element.value);
    });
  }

  saveAndPay() {
    this.createDataToSave();    
    if (this.paymentForm.invalid || this.isReadonly || this.productItems.length == 0 || !this.isSearchedCustomer) {
      return;
    }

    this.loading = true;
    if (this.purchaseForm.value) {
      this.purchaseForm.value.productItems = this.productItems;
      this.purchaseForm.value.totalItems = this.productItems.length;
      this.purchaseForm.value.paymentType = this.paymentForm.value.lookupForm.paymentType;
      this.purchaseForm.value.venderId = this.vendorForm.value.lookupForm.venderId;
      this.purchaseForm.value.venderMobNo = this.vendorForm.value.venderMobNo;
      this.purchaseForm.value.isActive = this.amounts.totalDues == 0 ? false : true;
    }

    this.prodReceiveService.saveProdReceive(this.purchaseForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.showSuccess(successMessage.Saved);
          this.productForm.controls = [];
          this.productForm.reset();
          this.loading = false;
          this.loading = false;
          this.amounts = { totalQuantity: 0, netAmount: 0, totalAmount: 0, totalSGST: 0, totalCGST: 0, paidAmount : 0, totalDues :0, totalDiscount : 0 };
          this.vendorForm.patchValue({venderId : '0', venderMobNo : null});
          this.paymentForm.patchValue({paidAmount : 0, totalDiscount : 0, venderId: '0'});
          this.isSearchedCustomer = false;
        },
        error => {
          this.alertService.showError(error);
          this.loading = false;
        });
  }
}





/* 
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthService, CommonServices, LookupService } from '../../../_services';
import { ProdReceiveService } from '../product-receive/product-receive.service';
import { successMessage } from '../../../shared/messages/messages';
import { lookupAttribute } from '../../../shared/lookup-attribute/lookup.attribute';
import { CustomValidator } from '../../../_validation/custom.validation';
@Component({
  selector: 'app-product-receive',
  templateUrl: './product-receive.component.html',
  styles: ['thead {color:green; width:50%}  tbody {color:blue;}  tfoot {color:red;}  table, th, td {    border: 1px solid black;  } ']
})

export class ProdReceiveComponent {
    prodReceiveForm: FormGroup;
    loading = false;
    submitted = false;
    public rowData: any;
    public rowSelection: any;
    public gridApi: any;
    public isReadonly = false;
    lookupAttribute: any = { Product: lookupAttribute.Product };
    lookup: any;
    options: any = { products: [] };   
    rowItems: any = [];
    itemForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private prodReceiveService: ProdReceiveService, private authService: AuthService, private commonServices: CommonServices, private lookupService: LookupService) {
    this.rowSelection = "single";
    this.isReadonly = this.authService.isReadonlyUser();   
  }
  
  ngOnInit() {       
      this.prodReceiveForm = this.formBuilder.group({        
      productId: [0],
      stockBalance: [0],
      quantity: [null, Validators.required],
      amount: [0],
      prodName: [{ value: '', disabled: this.isReadonly }, [Validators.maxLength(50)]],
      unitId: [{ value: '0', disabled: this.isReadonly }, [Validators.required, Validators.maxLength(10)]],      
      createdBy: this.authService.loggedUserName(),
      lookupForm: this.formBuilder.group({
        productId: ['0', CustomValidator.lookupRequired]
      }),
    }); 
    this.getLookup(); 
  }

  get f() { return this.prodReceiveForm.controls; }
  get lookupForm(): any { return this.prodReceiveForm.get('lookupForm'); }  

  getLookup() {
    this.lookup = { lookupName: lookupAttribute.Product.lookupName };
    this.lookupService.getLookup(this.lookup).subscribe(
      data => {
        this.options.products = data;
      }
    );
  };

  onSubmit() {
    this.submitted = true;
    if (this.prodReceiveForm.invalid || this.isReadonly) {
      return;
    }

    this.loading = true;
    if (this.prodReceiveForm.value) {
      this.prodReceiveForm.value.prodTypeId = Number(this.lookupForm.value.prodTypeId);
    }
    this.prodReceiveService.saveProdReceive(this.prodReceiveForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.showSuccess(successMessage.Saved);
          this.resetForm();         
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
    this.prodReceiveForm.reset();
    this.submitted = false;
    this.loading = false;
    this.prodReceiveForm.patchValue({ quantity: '' });
    this.lookupForm.patchValue({ productId: '0' });
  }

  addNewRow() {
    this.submitted = true;
    if (this.prodReceiveForm.invalid || this.isReadonly) {
      return;
    }
    this.loading = true;
    this.rowItems.push(this.prodReceiveForm.value);
  }

  onRemoveRow(rowIndex:number){
    this.rowItems.pop(rowIndex);
  }

  createItemFormGroup(): FormGroup {
    return this.formBuilder.group({
      providerId: this.prodReceiveForm.value.productId,
      prodName: this.prodReceiveForm.value.prodName,
      unit: this.prodReceiveForm.value.unit,
      quantity: this.prodReceiveForm.value.quantity,
    });
  } 
}*/
