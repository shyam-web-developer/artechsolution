import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class ProdCategoryService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

    getProdCategories() {
        return this.http.get(this.baseUrl + 'ProdCategory/GetProdCategories');
    }       

    saveProdCategory(prodCategory: any) {
        return this.http.post(this.baseUrl + 'ProdCategory/SaveProdCategory', prodCategory);
    }    

    deleteProdCategory(prodCatId: number) {
        return this.http.delete(this.baseUrl + 'ProdCategory/' + prodCatId);
    }    
}