import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
//import {Observable} from 'rxjs/Observable';

@Injectable()
export class AboutService {
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
        return this.http.get(this.apiServiceUrl + 'employee/GetEmployees');
    }
}