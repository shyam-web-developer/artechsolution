import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common';
import { configConstant } from '../shared/config/common.config';

@Injectable({
  providedIn: 'root'
})
export class CommonServices {
  constructor(private datePipe: DatePipe) { }
 
  setDateFormat(data : any) {
    return data.value ? this.datePipe.transform(data.value, configConstant.DateFormat) : '';
  }  

}
