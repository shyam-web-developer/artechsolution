import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Lookup, LookupItem} from '../lookup/lookup';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
  })
export class LookupService {
    baseUrl = environment.baseUrl;
    private subject = new Subject<any>();
    constructor(private http: HttpClient) { }

    getLookupItems(lookItems : any, lookup : any) {        
        this.subject.next({ lookItems : lookItems, lookup : lookup });
    }

    getLookup(lookup : Lookup) {        
        return this.http.post(this.baseUrl + 'Lookup/GetLookup', lookup);
    }

    getLookupData(lookup : Lookup) {        
        return this.http.post(this.baseUrl + 'Lookup/GetLookupData', lookup);
    }    

     getLookupDatas(): Observable<any> {
        return this.subject.asObservable();
    } 
}