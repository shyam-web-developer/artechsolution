import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { User } from 'src/app/_models';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    public token: string;
    apiServiceUrl = environment.baseUrl;

    constructor(private http: HttpClient) {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.token = currentUser && currentUser.access_token;
    }
    // Uses http.get() to load data from a single API endpoint
    getValues() {
        let httpOptions = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': 'bearer ' + this.token
            })
        };
        return this.http.get(this.apiServiceUrl + 'employees/GetEmployees');
    }

    getUsers() {        
        return this.http.get(this.apiServiceUrl + 'Users/GetUsers');
    }

    getRegisteredUsers() {
        return this.http.get<User[]>(this.apiServiceUrl + 'Users/GetUsers');
    }

    getUserById(id: number) {
        return this.http.get<User>(this.apiServiceUrl + 'Users/GetUserById' + id);
    }
}