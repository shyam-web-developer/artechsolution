import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { State } from '../state/state';

@Injectable({
    providedIn: 'root'
  })
export class StateService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

    getStates() {
        return this.http.get<[State]>(this.baseUrl + 'States/GetStates');
    }

    getStateById(stateId: number) {
        return this.http.get<State>(this.baseUrl + 'States/' + stateId);
    }    
    
    saveState(state: State) {
        return this.http.post(this.baseUrl + 'States/SaveState', state);
    }
    
    updateState(state: State) {
        return this.http.put(this.baseUrl + 'States/' + state.stateId, state);
    }

    deleteState(stateId: number) {
        return this.http.delete(this.baseUrl + 'States/' + stateId);
    }    
}