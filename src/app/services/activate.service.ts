import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivateService {
  constructor(private http: HttpClient) { }

  get(key: string): Observable<{}> {
    return this.http.get(`http://localhost:8080/api/activate/${key}`, {
      params: new HttpParams().set('key', key),
    });
  }
}
