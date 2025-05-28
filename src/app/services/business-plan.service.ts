import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BusinessPlan } from '../models/BusinessPlan';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BusinessPlanService {

  constructor(private http: HttpClient) { }

  get() {
    return this.http.get<BusinessPlan[]>('http://localhost:8080/api/business-plans');
  }

  create(payload: BusinessPlan) {
    return this.http.post<BusinessPlan>('http://localhost:8080/api/business-plans', payload);
  }

  getById(id: string) {
    return this.http.get<BusinessPlan>(`http://localhost:8080/api/business-plans/${id}`);
  }


  update(payload: BusinessPlan): Observable<BusinessPlan> {
    return this.http.put<BusinessPlan>(`http://localhost:8080/api/business-plans/${payload.id}`, payload);
  }

  generateBusinessPlan(businessPlan: BusinessPlan): Observable<string> {
    const copy = { ...businessPlan };
    return this.http.post(`http://localhost:8080/api/business-plans/generate`, copy, { responseType: 'text' });
  }

  delete(id: string) {
    return this.http.delete<BusinessPlan>(`http://localhost:8080/api/products/${id}`);
  }

}
