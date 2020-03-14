import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';

import { LookupComponent } from '../components/lookup/lookup.component';
import { NumericDirective } from '../_validation/numeric.directive';


@NgModule({
  imports: [ 
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      AgGridModule.withComponents([]),    
      Ng2FlatpickrModule      
    ],
  exports : [
    CommonModule,
    FormsModule,
    ReactiveFormsModule, 
    AgGridModule,     
    Ng2FlatpickrModule,
    LookupComponent,
    NumericDirective
  ],
  declarations: [ LookupComponent, NumericDirective],
})
export class SharedModule { }