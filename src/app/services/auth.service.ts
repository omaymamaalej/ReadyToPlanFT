import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8080/api/auth/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';


  constructor(private http: HttpClient) { }

  // login(credentials: { username: string; password: string }) {
  //   return this.http.post<{ id_token: string }>(`${this.apiUrl}/login`, credentials);
  // }

  // register(data: any) {
  //   return this.http.post(`${this.apiUrl}/register`, data);
  // }



  login(username: string, password: string): Observable<any> {
    return this.http.post('http://localhost:8080/api/authenticate', {
      'username' : username,
      'password' : password
    }, httpOptions);
  }

  register(username: string, email: string, password: string): Observable<any> {
    return this.http.post('http://localhost:8080/api/register', {
      'login' : username,
      'email' : email,
      'password' : password,
      'langKey': 'en'
    }, httpOptions);
  }
}
