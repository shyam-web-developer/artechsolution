import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class ProdSubCategoryService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

    getProdSubCategories() {
        return this.http.get(this.baseUrl + 'ProdSubCategory/GetProdSubCategories');
    }       

    saveProdSubCategory(prodSubCategory: any) {
        return this.http.post(this.baseUrl + 'ProdSubCategory/SaveProdSubCategory', prodSubCategory);
    }    

    deleteProdSubCategory(prodSubCatId: number) {
        return this.http.delete(this.baseUrl + 'ProdSubCategory/' + prodSubCatId);
    }    
}