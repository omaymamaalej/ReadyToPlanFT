import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Company } from '../models/Company';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
private apiUrl='http://localhost:8080/api/companies';
  constructor(private http: HttpClient) { }
  create(payload: Company) {
      return this.http.post<Company>('http://localhost:8080/api/companies', payload);
    }
      updateCompany(company: Company): Observable<Company> {
    return this.http.put<Company>(`${this.apiUrl}/${company.id}`, company);
  }
   getAll():Observable<Company> {
          return this.http.get<Company>(this.apiUrl);
        }
}
