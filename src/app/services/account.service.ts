import { Injectable } from '@angular/core';
import { User } from '../models/User';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { PasswordChangeDTO } from '../models/PasswordChange';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

constructor(private http: HttpClient) {}

  getAccount(): Observable<User> {
    return this.http.get<User>('http://localhost:8080/api/account');
  }

  updateAccount(payload: User) {
    return this.http.post('http://localhost:8080/api/account', payload);
  }

  updatePwd(payload: PasswordChangeDTO) {
    return this.http.post(
      'http://localhost:8080/api/account/change-password',
      payload
    );
  }

}
