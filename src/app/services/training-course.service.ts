import { HttpClient } from '@angular/common/http'; 
import { Injectable } from '@angular/core';
import { TrainingCourse, TrainingCourseDto } from '../models/training-course';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TrainingCourseService {

  private apiUrl = 'http://localhost:8080/api'; 

  constructor(private http: HttpClient) { }

  getAll(): Observable<TrainingCourseDto[]> {
    return this.http.get<TrainingCourseDto[]>(`${this.apiUrl}/training-courses`);
  }

  getById(id: string): Observable<TrainingCourseDto> {
    return this.http.get<TrainingCourseDto>(`${this.apiUrl}/training-courses/${id}`);
  }

  create(payload: TrainingCourseDto): Observable<TrainingCourseDto> {
    return this.http.post<TrainingCourseDto>(`${this.apiUrl}/training-courses`, payload);
  }

  update(payload: TrainingCourseDto): Observable<TrainingCourseDto> {
    return this.http.put<TrainingCourseDto>(`${this.apiUrl}/training-courses/${payload.id}`, payload);
  }

  partialUpdate(course: Partial<TrainingCourseDto> & { id: string }): Observable<TrainingCourseDto> {
    return this.http.patch<TrainingCourseDto>(`${this.apiUrl}/training-courses/${course.id}`, course);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/training-courses/${id}`);
  }

  getPresentation(id: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/training-courses/${id}/presentation`, { responseType: 'text' });
  }

  // Récupérer une nouvelle présentation générée (non sauvegardée)
  regeneratePresentation(id: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/training-courses/${id}/regenerate-presentation`, null, { responseType: 'text' });
  }

  // Sauvegarder la nouvelle présentation générée
  savePresentation(id: string, newPresentation: string): Observable<TrainingCourseDto> {
    return this.http.post<TrainingCourseDto>(`${this.apiUrl}/training-courses/${id}/save-presentation`, newPresentation);
  }

}
