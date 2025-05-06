import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user = {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  };

  submitted = false;
  isSignUpFailed = false;
  errorMessage = '';
  messages: string[] = [];
  errors: string[] = [];

  showMessages = {
    success: true,
    error: true,
  };

  config: { [key: string]: any } = {
    'forms.validation.username.required': true,
    'forms.validation.username.minLength': 3,
    'forms.validation.username.maxLength': 50,
    'forms.validation.email.required': true,
    'forms.validation.password.required': true,
    'forms.validation.password.minLength': 5,
    'forms.validation.password.maxLength': 20,
    'forms.register.terms': true,
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

  register(): void {
    this.submitted = true;

    if (this.user.password !== this.user.confirmPassword) {
      this.errors = ['Passwords do not match.'];
      this.submitted = false;
      return;
    }

    if (this.getConfigValue('forms.register.terms') && !this.user.terms) {
      this.errors = ['You must agree to the Terms & Conditions.'];
      this.submitted = false;
      return;
    }

    this.authService.register(this.user.username, this.user.email, this.user.password).subscribe({
      next: response => {
        this.messages = ['Registration successful!'];
        this.errors = [];
        this.isSignUpFailed = false;
        this.submitted = false;
        this.router.navigate(['/login']);
      },
      error: err => {
        this.errors = [err.error?.message || 'Registration failed.'];
        this.messages = [];
        this.isSignUpFailed = true;
        this.submitted = false;
      }
    });
  }

}
