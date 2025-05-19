import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { UserService } from '../services/user.service';

const TOKEN_KEY = 'auth-token';
const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  user: User = new User;

  constructor(private userService: UserService) { }

  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveToken(token: string): void {
    window.sessionStorage.removeItem(TOKEN_KEY);
    window.sessionStorage.setItem(TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return window.sessionStorage.getItem(TOKEN_KEY);
  }

  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  }

 
 public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    console.log("************user in token storage***********",user)
    if (user) {
      return JSON.parse(user);
    }
    return {};
  }

}
