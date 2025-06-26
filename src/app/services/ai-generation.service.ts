import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiGenerationService {

  private baseUrl = 'http://localhost:8080/api/ai-responses'; 

  constructor(private http: HttpClient) { }

  getAIResponse(entityType: string, entityId: string): Observable<{ aiResponse: string }> {
    return this.http.get<{ aiResponse: string }>(
      `${this.baseUrl}/${entityType}/${entityId}`
    );
  }
  getBusinessPlanFinal(entityId: string): Observable<string> {
    return this.http.get(`http://localhost:8080/api/businessPlan/final/${entityId}`, { responseType: 'text' });
  }
}
