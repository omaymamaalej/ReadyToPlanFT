import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BusinessPlanFinal, BusinessPlanFinalDTO } from '../models/BusinessPlanFinal';
import { HttpClient } from '@angular/common/http';
import { Slide } from '../models/Slide';

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

  generateBusinessPlan(companyId: string): Observable<BusinessPlanFinal> {
    return this.http.post<BusinessPlanFinal>(`${this.apiUrl}/generate/${companyId}`, {});
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

  getPresentation(id: string): Observable<Slide[]> {
    return this.http.get<Slide[]>(`${this.apiUrl}/${id}/presentation`);
  }

  updateSlide(id: string, slideIndex: number, content: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}/presentation/${slideIndex}`, { content });
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/business-plan-finals/${id}`);
  }

  download(id: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${id}/download`, {
      responseType: 'blob'
    });
  }

  update(plan: BusinessPlanFinal): Observable<any> {
    return this.http.put(`${this.apiUrl}/business-plan-finals/${plan.id}`, plan);
  }
}
