import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { ModalComponent } from 'src/app/_directives/modal-box/modal.component';
import { AddStudentComponent } from './add-student/add-student.component';
import { ClassComponent } from './class/class.component';
import { AddressComponent } from 'src/app/components/address/address.componenet';
import { InstallmentComponent } from './installment/installment.component';
import { FeeStructureComponent } from './fee-structure/fee-structure.component';
import { FeeComponent } from './fee-component/fee-component.component';
import { StreamComponent } from './stream/stream.component';
import { NumericDirective } from 'src/app/_validation/numeric.directive';

const routes: Routes = [ 
  { path: 'addNewStudent', component: AddStudentComponent },
  { path: 'class', component: ClassComponent },
  { path: 'installment', component: InstallmentComponent },
  { path: 'feeStructure', component: FeeStructureComponent },
  { path: 'feeComponent', component: FeeComponent },
  { path: 'stream', component: StreamComponent }
];

@NgModule({
  imports: [
    SharedModule,    
    RouterModule.forChild(routes),
    NgMultiSelectDropDownModule.forRoot()
  ],
  declarations: [  
    StreamComponent,
    ClassComponent,
    AddStudentComponent,    
    AddressComponent,
    InstallmentComponent,
    FeeStructureComponent,
    FeeComponent,
    ModalComponent  
  ]    
})
export class StudentModule { }