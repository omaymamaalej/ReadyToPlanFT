import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { User } from '../models/User';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {

  private userSubject: BehaviorSubject<User | null>;  
  public user: Observable<User | null>;  

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.userSubject = new BehaviorSubject<User | null>(
      localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null
    );
    this.user = this.userSubject.asObservable();
  }

  public get userValue(): User | null {
    return this.userSubject.value;
  }

  login(username: string, password: string) {
    return this.http.post<any>(`http://localhost:4000/users/authenticate`, { username, password })
      .pipe(map(user => {
        localStorage.setItem('user', JSON.stringify(user));
        this.userSubject.next(user);
        return user;
      }));
  }

  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);  
    this.router.navigate(['/login']);
  }
}
