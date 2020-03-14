import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class DepartmentService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

    getDepartments() {
        return this.http.get(this.baseUrl + 'Departments/GetDepartments');
    }

    getDepartmentById(departmentId: number) {
        return this.http.get(this.baseUrl + 'Departments/GetDepartments/' + departmentId);
    }    

    saveDepartment(department: any) {
        return this.http.post(this.baseUrl + 'Departments/SaveDepartment', department);
    }

    updateDepartment(department: any) {
        return this.http.put(this.baseUrl + 'Departments/' + department.id, department);
    }

    deleteDepartment(departmentId: number) {
        return this.http.delete(this.baseUrl + 'Departments/' + departmentId);
    }    
}