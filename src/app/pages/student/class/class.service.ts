import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class ClassService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

    getClasses() {
        return this.http.get(this.baseUrl + 'Classes/GetClasses');
    }

    getClassById(classId: number) {
        return this.http.get(this.baseUrl + 'Classes/GetClasses/' + classId);
    }    

    saveClass(classes: any) {
        return this.http.post(this.baseUrl + 'Classes/SaveClass', classes);
    }

    updateClass(classes: any) {
        return this.http.put(this.baseUrl + 'Classes/' + classes.id, classes);
    }

    deleteClass(classId: number) {
        return this.http.delete(this.baseUrl + 'Classes/' + classId);
    }    
}