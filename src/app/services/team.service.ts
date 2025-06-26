import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Team } from '../models/Team';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TeamService {

  private apiUrl = 'http://localhost:8080/api/teams'
  
  constructor(private http: HttpClient) { }

  getAll(): Observable<Team[]> {
    return this.http.get<Team[]>(this.apiUrl);
  }
  getByCompany(companyId: string): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/by-company/${companyId}`);
  }
  create(member: Partial<Team>, companyId: string): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}?companyId=${companyId}`, member);
  }

  update(id: string, member: Team): Observable<Team> {
    return this.http.put<Team>(`${this.apiUrl}/${id}`, member);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  
}
