import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class ProductService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

    getProducts() {
        return this.http.get(this.baseUrl + 'Products/GetProducts');
    }

    getProductById(productId: number) {
        return this.http.get(this.baseUrl + 'Products/GetProducts/' + productId);
    }    

    saveProduct(product: any) {
        return this.http.post(this.baseUrl + 'Products/SaveProduct', product);
    }    

    deleteProduct(productId: number) {
        return this.http.delete(this.baseUrl + 'Products/' + productId);
    }    
}