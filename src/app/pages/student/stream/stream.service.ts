import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
  })
export class StreamService {
    baseUrl = environment.baseUrl;
    constructor(private http: HttpClient) { }

    getStream() {
        return this.http.get(this.baseUrl + 'Streams/GetStreams');
    }      

    saveStream(stream: any) {
        return this.http.post(this.baseUrl + 'Streams/SaveStream', stream);
    }    

    deleteStream(streamId: number) {
        return this.http.delete(this.baseUrl + 'Streams/' + streamId);
    }    
}