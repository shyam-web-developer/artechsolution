import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class FeeStructureService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }
    
    getLookup() {
        return this.http.get(this.baseUrl + 'FeeStructures/GetLookups');
    }
    getFeeStructures(parameter : any) {
        return this.http.post(this.baseUrl + 'FeeStructures/GetFeeStructures', parameter);
    }       

    saveFeeStructure(feeSetups : any) {
        return this.http.post(this.baseUrl + 'FeeStructures/SaveFeeStructure',feeSetups);
    }
    
    saveFeeInstallmentSetup(feeInstallmentSetups : any) {
        return this.http.post(this.baseUrl + 'FeeStructures/SaveFeeInstallmentSetup',feeInstallmentSetups);
    }

    deleteFeeStructure(feeSetupId: number) {
        return this.http.delete(this.baseUrl + 'FeeStructures/' + feeSetupId);
    }    
}