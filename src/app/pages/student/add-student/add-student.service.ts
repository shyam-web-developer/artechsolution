import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class AddStudentService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

    getStudents() {
        return this.http.get(this.baseUrl + 'Students/GetStudents');
    }

    getLookup() {
        return this.http.get(this.baseUrl + 'Students/GetLookups');
    }

    getStudentById(studentId: number) {
        return this.http.get(this.baseUrl + 'Students/GetStudents/' + studentId);
    }    

    saveStudent(student: any) {
        return this.http.post(this.baseUrl + 'Students/SaveStudent', student);
    }

    updateStudent(student: any) {
        return this.http.put(this.baseUrl + 'Students/' + student.id, student);
    }

    deleteStudent(studentId: number) {
        return this.http.delete(this.baseUrl + 'Students/' + studentId);
    }    
}