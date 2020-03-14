import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { ModalComponent } from 'src/app/_directives/modal-box/modal.component';
import { AddressComponent } from 'src/app/components/address/address.componenet';
import { AddEmployeeComponent } from './add-employee/add-employee.component';

const routes: Routes = [ 
  { path: 'addNewEmployee', component: AddEmployeeComponent } 
];

@NgModule({
  imports: [
    SharedModule,    
    RouterModule.forChild(routes),
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [  
    AddEmployeeComponent,       
    AddressComponent,   
    ModalComponent  
  ]    
})
export class EmployeeModule { }