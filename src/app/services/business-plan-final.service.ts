import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BusinessPlanFinal, BusinessPlanFinalDTO } from '../models/BusinessPlanFinal';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BusinessPlanFinalService {

  private apiUrl = 'http://localhost:8080/api';
  constructor(private http: HttpClient) { }
  getAll(): Observable<BusinessPlanFinalDTO[]> {
    return this.http.get<BusinessPlanFinalDTO[]>(`${this.apiUrl}/business-plan-final`);
  }

  getAIOnlyBusinessPlan(companyId: string): Observable<BusinessPlanFinalDTO> {
    return this.http.get<BusinessPlanFinalDTO>(`${this.apiUrl}/business-plan-final/ai-only/${companyId}`);
  }


  getAIResponse(type: string, id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/ai-responses/${type}/${id}`);
  }
  getById(id: string): Observable<any> {
    return this.http.get<BusinessPlanFinal>(`${this.apiUrl}/business-plan-finals/${id}`);
  }
  getBusinessPlansByCompany(companyId: string): Observable<BusinessPlanFinal[]> {
    return this.http.get<BusinessPlanFinal[]>(`${this.apiUrl}/business-plan-finals/by-company/${companyId}`);
  }
  getAllByCompany(companyId: string): Observable<BusinessPlanFinalDTO[]> {
    return this.http.get<BusinessPlanFinalDTO[]>(`${this.apiUrl}/business-plan-final/by-company/${companyId}`);
  }
}
