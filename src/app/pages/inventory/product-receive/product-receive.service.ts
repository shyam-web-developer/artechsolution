import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class ProdReceiveService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

    getProdReceives() {
        return this.http.get(this.baseUrl + 'Purchases/GetProdReceives');
    }   
    
    getProductDetail(productId : any) {
        return this.http.get(this.baseUrl + 'Purchases/GetProductDetail?productId=' +productId);
    }

    saveProdReceive(prodReceives: any) {
        return this.http.post(this.baseUrl + 'Purchases/SaveProductReceive', prodReceives);
    }    

    deleteProdReceive(pReceiveId: number) {
        return this.http.delete(this.baseUrl + 'ProdReceive/' + pReceiveId);
    }    
}