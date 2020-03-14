import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class InstallmentService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }    
   
    getInstallments() {
        return this.http.get(this.baseUrl + 'Installments/GetInstallments');
    }       

    saveInstallment(installment: any) {
        return this.http.post(this.baseUrl + 'Installments/SaveInstallment', installment);
    }    

    deleteInstallment(installmentId: number) {
        return this.http.delete(this.baseUrl + 'Installments/' + installmentId);
    }    
}