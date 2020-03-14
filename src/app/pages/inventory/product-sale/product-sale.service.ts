import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class ProductSaleService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }
    
    getLookup() {
        return this.http.get(this.baseUrl + 'Sales/GetLookups');
    }
    getProductDetail(productId : any) {
        return this.http.get(this.baseUrl + 'Sales/GetProductDetail?productId=' +productId);
    }       
 
    saveProductSale(products : any) {
        return this.http.post(this.baseUrl + 'Sales/SaveProductSale',products);
    } 
    

    deleteSale(productId: number) {
        return this.http.delete(this.baseUrl + 'Sales/' + productId);
    }    
}