import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class ProductTypeService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

    getProductTypes() {
        return this.http.get(this.baseUrl + 'ProductTypes/GetProductTypes');
    }

    getProductTypeById(prodTypeId: number) {
        return this.http.get(this.baseUrl + 'ProductTypes/GetProductTypes/' + prodTypeId);
    }    

    saveProductType(productType: any) {
        return this.http.post(this.baseUrl + 'ProductTypes/SaveProductType', productType);
    }    

    deleteProductType(prodTypeId: number) {
        return this.http.delete(this.baseUrl + 'ProductTypes/' + prodTypeId);
    }    
}