import { Injectable } from '@angular/core';
import { Marketing } from '../models/Marketing';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MarketingService {

  constructor(private http: HttpClient) { }

  create(payload: Marketing, companyId: string) {
    return this.http.post<Marketing>(`http://localhost:8080/api/marketings?companyId=${companyId}`, payload);
  }

  update(id: string, payload: Marketing) {
    return this.http.put<Marketing>(`http://localhost:8080/api/marketings/${id}`, payload);
  }

  getByCompanyId(companyId: string): Observable<Marketing[]> {
    return this.http.get<Marketing[]>(`http://localhost:8080/api/marketings/by-company/${companyId}`);
  }

  delete(id: string) {
    return this.http.delete<void>(`http://localhost:8080/api/marketings/${id}`);
  }
  
}
