import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenStorageService } from '../_services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private tokenStorageService: TokenStorageService, private router: Router) {}

  canActivate(): boolean {
    const role = this.tokenStorageService.getUserRole();
    if (role === 'ROLE_ADMIN') {
      return true;
    }
    this.router.navigate(['profileInformation/account']); 
    return false;
  }
}
