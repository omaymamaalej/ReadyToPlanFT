import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';
import { AccountService } from 'src/app/services/account.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {

  user = {
    username: '',
    password: '',
    rememberMe: false,
  };

  submitted = false;
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';
  messages: string[] = [];
  errors: string[] = [];
  showMessages = {
    success: true,
    error: true,
  };

  currentUser: User = {
    id: '',
    login: '',
    firstName: '',
    lastName: '',
    email: '',
    activated: false,
    langKey: '',
    authorities: [],
    createdBy: '',
    createdDate: new Date(),
    lastModifiedBy: '',
    lastModifiedDate: new Date(),
  };

  // ✅ Déclare config comme une propriété d'instance
  config: { [key: string]: any } = {
    'forms.validation.email.required': true,
    'forms.validation.password.required': true,
    'forms.validation.password.minLength': 5,
    'forms.validation.password.maxLength': 20,
  };

  constructor(
    private accountService: AccountService,
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  getConfigValue(key: string): any {
    return this.config[key];
  }

  rememberMe = true;

  login(): void {
    this.submitted = true;
    this.isLoginFailed = false;
    this.errorMessage = '';

    this.authService.login(this.user.username, this.user.password).subscribe({
      next: (authResponse) => {
        // 1. Sauvegarde du token JWT
        this.tokenStorage.saveToken(authResponse.id_token || authResponse.token);
        
        // 2. Récupération des infos utilisateur complètes
        this.accountService.getAccount().subscribe({
          next: (userData) => {
            // 3. Sauvegarde des données utilisateur avec les authorities
            const userWithToken = {
              ...userData,
              token: authResponse.id_token || authResponse.token
            };
            this.tokenStorage.saveUser(userWithToken);
            
            // 4. Redirection selon le rôle
            if (this.isAdminUser(userData)) {
              this.router.navigate(['/listUser']).then(() => {
                window.location.reload();
              });
            } else {
              this.router.navigate(['/profileInformation/account']);
            }
          },
          error: (err) => {
            console.error('Failed to fetch user account', err);
            this.handleError("Échec de la récupération du profil utilisateur");
          }
        });
      },
      error: (err) => {
        console.error('Login error', err);
        this.handleError(err.error?.message || err.error?.title || 'Échec de la connexion');
      }
    });
  }

  private isAdminUser(user: any): boolean {
    return user?.authorities?.includes('ROLE_ADMIN');
  }

  private handleError(errorMsg: string): void {
    this.errorMessage = errorMsg;
    this.isLoginFailed = true;
    this.submitted = false;
    this.tokenStorage.signOut();
  }


  reloadPage(): void {
    window.location.reload();
  }
}


