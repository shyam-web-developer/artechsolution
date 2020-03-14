import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class DesignationService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

    getDesignations() {
        return this.http.get(this.baseUrl + 'Designations/GetDesignations');
    }

    getDesignationById(desigId: number) {
        return this.http.get(this.baseUrl + 'Designations/GetDesignations/' + desigId);
    }    

    saveDesignation(designation: any) {
        return this.http.post(this.baseUrl + 'Designations/SaveDesignation', designation);
    }

    updateDesignation(designation: any) {
        return this.http.put(this.baseUrl + 'Designations/' + designation.id, designation);
    }

    deleteDesignation(desigId: number) {
        return this.http.delete(this.baseUrl + 'Designations/' + desigId);
    }    
}