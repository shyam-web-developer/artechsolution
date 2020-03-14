import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class SessionService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

    getSessions() {
        return this.http.get(this.baseUrl + 'Sessions/GetSessions');
    }

    getSessionById(sessionId: number) {
        return this.http.get(this.baseUrl + 'Sessions/GetSessions/' + sessionId);
    }    

    saveSession(session: any) {
        return this.http.post(this.baseUrl + 'Sessions/SaveSession', session);
    }

    updateSession(session: any) {
        return this.http.put(this.baseUrl + 'Sessions/' + session.id, session);
    }

    deleteSession(sessionId: number) {
        return this.http.delete(this.baseUrl + 'Sessions/' + sessionId);
    }    
}