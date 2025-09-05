import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TrainingCourse, TrainingCourseDto } from '../models/training-course';
import { map, Observable } from 'rxjs';
import { TokenStorageService } from '../_services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class TrainingCourseService {

  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient,
    private tokenStorage: TokenStorageService
  ) { }

  create(payload: TrainingCourseDto): Observable<TrainingCourseDto> {
    console.log('Sending payload:', payload);

    const token = this.tokenStorage.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post<TrainingCourseDto>(
      `${this.apiUrl}/training-courses`,
      payload,
      { headers }
    );
  }

  getAll(): Observable<TrainingCourseDto[]> {
    return this.http.get<TrainingCourseDto[]>(`${this.apiUrl}/training-courses`);
  }

  getById(id: string): Observable<TrainingCourseDto> {
    return this.http.get<TrainingCourseDto>(`${this.apiUrl}/training-courses/${id}`);
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

  regeneratePresentation(id: string): Observable<string> {
    return this.http.post(`${this.apiUrl}/training-courses/${id}/regenerate-presentation`, null, { responseType: 'text' });
  }

  savePresentation(id: string, newPresentation: string): Observable<TrainingCourseDto> {
    return this.http.post<TrainingCourseDto>(`${this.apiUrl}/training-courses/${id}/save-presentation`, newPresentation);
  }

  evaluate(courseId: string, satisfaction: number): Observable<any> {
    const url = `${this.apiUrl}/training-courses/${courseId}/evaluate?satisfaction=${satisfaction}`;
    console.log('Evaluation URL:', url);
    return this.http.post(url, {});
  }

  setPublic(courseId: string, isPublic: boolean): Observable<any> {
    const url = `${this.apiUrl}/training-courses/${courseId}/public?isPublic=${isPublic}`;
    console.log('Public URL:', url);
    return this.http.post(url, {});
  }

  getStats(): Observable<{ [key: string]: number }> {
    return this.http.get<{ [key: string]: number }>(`${this.apiUrl}/training-courses/stats/satisfaction`);
  }

  getMyCourses(): Observable<TrainingCourseDto[]> {
    return this.http.get<TrainingCourseDto[]>(`${this.apiUrl}/training-courses/mine`);
  }

  getPublicCourses(): Observable<TrainingCourseDto[]> {
    return this.http.get<TrainingCourseDto[]>(`${this.apiUrl}/training-courses/public`);
  }
}
