import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { first } from 'rxjs/operators';
import { AlertService, AuthService, CommonServices, LookupService } from '../../../_services';
import { ProductSaleService } from './product-sale.service';
import { successMessage, errorMessage } from '../../../shared/messages/messages';
import { lookupAttribute } from '../../../shared/lookup-attribute/lookup.attribute';
import { CustomValidator } from 'src/app/_validation/custom.validation';

@Component({
  selector: 'app-product-sale',
  templateUrl: './product-sale.component.html',
  styleUrls : ['./product-sale.component.css'], 
})

export class ProductSaleComponent {
  productSaleForm: FormGroup;
  productAddForm: FormGroup;
  paymentForm: FormGroup;
  customerForm: FormGroup;
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
  public amounts : any = {totalQuantity : 0,  netAmount : 0, totalAmount : 0, totalSGST : 0, totalCGST : 0, totalDues : 0, totalDiscount : 0, receiveAmount :0};
  @ViewChild("quantity", {static: true}) firstField: ElementRef;
  constructor(
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private productSaleService: ProductSaleService, private authService: AuthService, private commonServices: CommonServices, private lookupService: LookupService) {
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
      receiveAmount: [null, Validators.required],
      totalDiscount: [0],
      custMobNo : ['', Validators.required],
      lookupForm: this.formBuilder.group({
        paymentType: ['Cash', CustomValidator.lookupRequired]
      }),
    });

    this.customerForm = this.formBuilder.group({
      custMobNo: [null, Validators.required],            
    });

    this.productSaleForm = this.formBuilder.group({      
      quantity: [0],
      totalQuantity: [0],
      totalItems: [0],
      netAmount: [0],
      totalAmount: [0],
      receiveAmount: [0],
      totalDiscount: [0],
      totalSGST: [0],
      totalCGST: [0],
      paymentType: [''],
      custMobNo : [''],
      isActive: [true],     
      createdBy: [this.authService.loggedUserName()],
      createdDate: [new Date()],      
      productForm: this.formBuilder.array([
      ]),
      lookupSaleForm: this.formBuilder.group({
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
  get lookupSaleForm(): any { return this.productSaleForm.get('lookupSaleForm'); }
  get productForm(): any { return this.productSaleForm.get('productForm') as FormArray; }


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
    this.productSaleService.getProductDetail(productId).subscribe(
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

  searchCustomer() {
    if (this.customerForm.value.custMobNo) {
      this.paymentForm.patchValue({ custMobNo: this.customerForm.value.custMobNo });
      this.isSearchedCustomer = true;
    }
  }

  onDiscount() {
    if (this.amounts.totalAmount ==0){
      this.payment.totalDiscount.patchValue(0);
      return;
    }
    
    if (this.amounts.receiveAmount > 0 && this.payment.totalDiscount.value && this.amounts.receiveAmount >= Number(this.payment.totalDiscount.value)) {
      this.amounts.receiveAmount = this.amounts.totalAmount - Number(this.payment.totalDiscount.value);      
    }
    else {
      this.amounts.receiveAmount = this.amounts.totalAmount      
    }
    this.payment.receiveAmount.patchValue(this.amounts.receiveAmount);
    this.productSaleForm.patchValue({receiveAmount :this.amounts.receiveAmount, totalDiscount:  Number(this.payment.totalDiscount.value)});
  }

  onReceive() {
    if (this.payment.receiveAmount.value) {
      this.amounts.totalDues = this.amounts.totalAmount - Number(this.payment.receiveAmount.value);      
    }
    else {
      this.amounts.totalDues = this.amounts.totalAmount;
    }    
    this.productSaleForm.patchValue({totalDues :this.amounts.receiveAmount, receiveAmount : Number(this.payment.receiveAmount.value)});
  }
  

  addProductItem() {
    this.submitted = true;
    if (this.productAddForm.invalid || this.f.quantity.value == '0') {
      return;
    }
    var index = this.productForm.value.findIndex((x: any) => x.productId === Number(this.lookupForm.value.productId));
    if (index != -1) {         
      this.alertService.showError(errorMessage.AlreadyAddedItem);
      return;
    }
    if (Number(this.f.quantity.value) > this.productDetail.stockBalance) {
      this.alertService.showSuccess("Only " + this.productDetail.stockBalance + " items are available in stock.");
      return;
    }

    this.submitted = false;
    if (this.lookupForm.value && this.lookupForm.value.productId && this.productDetail) {
      let amount = this.getAmount(Number(this.productDetail.salePrice), Number(this.f.quantity.value))
      this.productDetail.amount = amount;
      this.productDetail.quantity = Number(this.f.quantity.value);
      this.lookupSaleForm.patchValue({unitId :this.productDetail.unitId});      
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
      this.productSaleForm.patchValue({totalSGST :this.amounts.totalSGST, totalCGST: this.amounts.totalCGST, netAmount:this.amounts.netAmount , totalAmount: this.amounts.totalAmount , totalQuantity : this.amounts.totalQuantity, receiveAmount : this.amounts.totalAmount});  
      this.payment.receiveAmount.patchValue(this.amounts.totalAmount);   
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
    if (this.productSaleForm.value) {
      this.productSaleForm.value.productItems = this.productItems;
      this.productSaleForm.value.totalItems = this.productItems.length;
      this.productSaleForm.value.paymentType = this.paymentForm.value.lookupForm.paymentType;
      this.productSaleForm.value.custMobNo = this.customerForm.value.custMobNo;
      this.productSaleForm.value.isActive = this.amounts.totalDues == 0 ? false : true;
    }

    this.productSaleService.saveProductSale(this.productSaleForm.value)
      .pipe(first())
      .subscribe(
        data => {
          this.alertService.showSuccess(successMessage.Saved);
          this.productForm.controls = [];
          this.productForm.reset();
          this.loading = false;
          this.loading = false;
          this.amounts = { totalQuantity: 0, netAmount: 0, totalAmount: 0, totalSGST: 0, totalCGST: 0, receiveAmount : 0, totalDues :0, totalDiscount : 0 };
          this.customerForm.reset();
          this.paymentForm.patchValue({receiveAmount : 0, totalDiscount : 0, custMobNo: null});
          this.isSearchedCustomer = false;
        },
        error => {
          this.alertService.showError(error);
          this.loading = false;
        });
  }
}
