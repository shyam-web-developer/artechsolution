import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class SectionService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

    getSections() {
        return this.http.get(this.baseUrl + 'Sections/GetSections');
    }

    getSectionById(sectionId: number) {
        return this.http.get(this.baseUrl + 'Sections/GetSections/' + sectionId);
    }    

    saveSection(section: any) {
        return this.http.post(this.baseUrl + 'Sections/SaveSection', section);
    }

    updateSection(section: any) {
        return this.http.put(this.baseUrl + 'Sections/' + section.id, section);
    }

    deleteSection(sectionId: number) {
        return this.http.delete(this.baseUrl + 'Sections/' + sectionId);
    }    
}