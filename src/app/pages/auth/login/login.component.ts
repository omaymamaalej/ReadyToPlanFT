import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';

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
    private authService: AuthService,
    private tokenStorage: TokenStorageService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  getConfigValue(key: string): any {
    return this.config[key];
  }

  rememberMe = true;

  // socialLinks = [
  //   {
  //     title: 'Google',
  //     icon: 'fa fa-google',
  //     url: 'https://google.com',
  //     target: '_blank',
  //   },
  //   {
  //     title: 'Facebook',
  //     icon: 'fa fa-facebook',
  //     link: '/auth/facebook',
  //     target: '_self',
  //   },
  // ];

  login(): void {
    this.submitted = true;
    this.authService.login(this.user.username, this.user.password).subscribe({
      next: data => {
        const token = data.id_token;
        this.tokenStorage.saveToken(token);
        this.tokenStorage.saveUser({ ...this.user, token });

        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.messages = ['Login successful!'];
        this.errors = [];

        this.router.navigate(['/home']);
      },
      error: err => {
        this.errorMessage = err.error?.message || 'Login failed.';
        this.errors = [this.errorMessage];
        this.messages = [];
        this.isLoginFailed = true;
        this.submitted = false;
      }
    });
  }
}
