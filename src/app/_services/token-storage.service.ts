import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { UserService } from '../services/user.service';
import { BehaviorSubject } from 'rxjs';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
 private loggedIn = new BehaviorSubject<boolean>(this.hasToken());
  loggedIn$ = this.loggedIn.asObservable();

  constructor() {}

  signOut(): void {
    window.sessionStorage.clear();
    this.loggedIn.next(false);
  }

  private hasToken(): boolean {
    return !!this.getToken();
  }

  saveToken(token: string): void {
    window.sessionStorage.setItem(TOKEN_KEY, token);
    this.loggedIn.next(true);
  }

  getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  saveUser(user: any): void {
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if (user) {
      return JSON.parse(user);
    }
    return null;
  }

  public getUserRole(): string {
  const user = this.getUser();
  if (user && user.authorities && user.authorities.length > 0) {
    return user.authorities[0];
  }
  return 'ROLE_USER';
}

  isAdmin(): boolean {
    const user = this.getUser();
    const roles = user?.authorities || [];
    return roles.includes('ROLE_ADMIN');
  }

}