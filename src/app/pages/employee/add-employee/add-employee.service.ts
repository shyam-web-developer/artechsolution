import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class AddEmployeeService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

    getEmployees() {
        return this.http.get(this.baseUrl + 'Employees/GetEmployees');
    }

    getLookups() {
        return this.http.get(this.baseUrl + 'Employees/GetLookups');
    }

    getEmployeeById(empId: number) {
        return this.http.get(this.baseUrl + 'Employees/GetEmployees/' + empId);
    }    

    saveNewEmployee(emp: any) {
        return this.http.post(this.baseUrl + 'Employees/SaveNewEmployee', emp);
    }

    updateEmployee(emp: any) {
        return this.http.put(this.baseUrl + 'Employees/' + emp.id, emp);
    }

    deleteEmployee(empId: number) {
        return this.http.delete(this.baseUrl + 'Employees/' + empId);
    }    
}