import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BusinessPlan } from '../models/BusinessPlan';
import { Observable } from 'rxjs';
import { SlideUpdateRequestPatch } from '../models/slide-update-request';
import { Slide } from '../models/Slide';


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

  regeneratePresentation(id: string): Observable<BusinessPlan> {
    return this.http.post<BusinessPlan>(`http://localhost:8080/api/business-plans/${id}/regenerate`, {});
  }

  getPresentation(companyName: string): Observable<Slide[]> {
    const cleanedName = companyName.trim();
    return this.http.get<Slide[]>(`http://localhost:8080/api/business-plans/${cleanedName}/presentation`);
  }

  getPresentationText(companyName: string): Observable<string> {
    const cleanedName = companyName.trim();
    return this.http.get(`http://localhost:8080/api/business-plans/${cleanedName}/presentation/text`, { responseType: 'text' });
  }


  updateSlide(id: string, slideIndex: number, newContent: string): Observable<BusinessPlan> {
    const body: SlideUpdateRequestPatch = { newContent: newContent };
    return this.http.patch<BusinessPlan>(`http://localhost:8080/api/business-plans/${id}/presentation/slide/${slideIndex}`, body);
  }

  downloadPresentation(companyName: string, format: 'PDF' | 'PPTX'): Observable<Blob> {
    const headers = new HttpHeaders().set('Accept', 'application/octet-stream');
    return this.http.get(
      `http://localhost:8080/api/business-plans/${companyName}/export?format=${format}`, 
      {
        responseType: 'blob',
        headers: headers
      }
    );
  }


  delete(id: string) {
    return this.http.delete<BusinessPlan>(`http://localhost:8080/api/business-plans/${id}`);
  }

}
