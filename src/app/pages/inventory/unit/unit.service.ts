import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class UnitService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

    getUnits() {
        return this.http.get(this.baseUrl + 'Units/GetUnits');
    }

    getUnitById(unitId: number) {
        return this.http.get(this.baseUrl + 'Units/GetUnits/' + unitId);
    }    

    saveUnit(unit: any) {
        return this.http.post(this.baseUrl + 'Units/SaveUnit', unit);
    }    

    deleteUnit(unitId: number) {
        return this.http.delete(this.baseUrl + 'Units/' + unitId);
    }    
}