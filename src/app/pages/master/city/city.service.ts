import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { User } from '../../../_models';

@Injectable({
    providedIn: 'root'
  })
export class CityService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

    getCities() {
        return this.http.get(this.baseUrl + 'City/GetCities');
    }

    getCityById(cityId: number) {
        return this.http.get<User>(this.baseUrl + 'City/GetCities/' + cityId);
    }    

    saveCity(city: any) {
        return this.http.post(this.baseUrl + 'City/SaveCity', city);
    }

    updateCity(user: User) {
        return this.http.put(this.baseUrl + 'Users/' + user.id, user);
    }

    deleteCity(id: number) {
        return this.http.delete(`/users/` + id);
    }    
}