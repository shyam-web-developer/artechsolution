import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';

import { UnitComponent } from './unit/unit.component';
import { ProductTypeComponent } from './product-type/product-type.component';
import { ProdSubCategoryComponent } from './product-sub-category/product-sub-category.component';
import { ProductComponent } from './product/product.component';
import { ProdCategoryComponent } from './product-category/product-category.component';
import { ProdReceiveComponent } from './product-receive/product-receive.component';
import { ProductSaleComponent } from './product-sale/product-sale.component';

const routes: Routes = [ 
  { path: 'prodUnit', component: UnitComponent },
  { path: 'productType', component: ProductTypeComponent },
  { path: 'productCat', component: ProdCategoryComponent },
  { path: 'productSubCat', component: ProdSubCategoryComponent },
  { path: 'product', component: ProductComponent },
  { path: 'prodReceive', component: ProdReceiveComponent },
  { path: 'prodSale', component: ProductSaleComponent }
];

@NgModule({
  imports: [
    SharedModule,    
    RouterModule.forChild(routes)
  ],
  declarations: [     
    UnitComponent,
    ProductTypeComponent,   
    ProdCategoryComponent,
    ProdSubCategoryComponent,
    ProductComponent,
    ProdReceiveComponent,
    ProductSaleComponent
  ]  
})
export class InventoryModule { }