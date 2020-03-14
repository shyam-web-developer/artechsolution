import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { User } from '../_models';

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'No-Auth': 'True'
    })
};

@Injectable({
    providedIn: 'root'
})
export class UserService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

    getUsers() {
        return this.http.get<User[]>(this.baseUrl + 'Users');
    }

    getUserById(id: number) {
        return this.http.get<User>(this.baseUrl + 'Users/' + id);
    }

    register(user: User) {
        return this.http.post(this.baseUrl + 'Login/RegisterUser', user, httpOptions);
    }

    createUser(user: User) {
        return this.http.post(this.baseUrl + 'Users/createUser', user);
    }

    update(user: User) {
        return this.http.put(this.baseUrl + 'Users/' + user.id, user);
    }

    delete(id: number) {
        return this.http.delete(`/users/` + id);
    }

    changePassword(user: User) {
        return this.http.post(this.baseUrl + 'Users/ChangePassword', user);
    }
}