import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class FeeComponentService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

    getFeeComponent() {
        return this.http.get(this.baseUrl + 'FeeComponents/GetFeeComponents');
    }

    getFeeComponentById(feeCompId: number) {
        return this.http.get(this.baseUrl + 'FeeComponents/GetFeeComponent/' + feeCompId);
    }    

    saveFeeComponent(feeComponent: any) {
        return this.http.post(this.baseUrl + 'FeeComponents/SaveFeeComponent', feeComponent);
    }

    updateFeeComponent(feeComponent: any) {
        return this.http.put(this.baseUrl + 'FeeComponents/' + feeComponent.feeCompId, feeComponent);
    }

    deleteFeeComponent(feeCompId: number) {
        return this.http.delete(this.baseUrl + 'FeeComponents/' + feeCompId);
    }    
}