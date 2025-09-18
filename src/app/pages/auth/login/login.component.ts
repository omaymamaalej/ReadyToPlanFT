import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';
import { AccountService } from 'src/app/services/account.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('form') loginForm!: NgForm;
  
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
  ) { }

  ngOnInit(): void { }

  getConfigValue(key: string): any {
    return this.config[key];
  }

  rememberMe = true;

  login(): void {
    this.submitted = true;
    this.isLoginFailed = false;
    this.errorMessage = '';
    this.errors = []; // reset errors

    if (this.loginForm) {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.controls[key].markAsTouched();
      });
    }

    if (this.loginForm && this.loginForm.invalid) {
      return;
    }

    this.authService.login(this.user.username, this.user.password).subscribe({
      next: (authResponse) => {
        this.tokenStorage.saveToken(authResponse.id_token || authResponse.token);
        this.accountService.getAccount().subscribe({
          next: (userData) => {
            const userWithToken = {
              ...userData,
              token: authResponse.id_token || authResponse.token
            };
            this.tokenStorage.saveUser(userWithToken);

            if (this.isAdminUser(userData)) {
              this.router.navigate(['/dashboard']).then(() => {
                window.location.reload();
              });
            } else {
              this.router.navigate(['/dashboard']);
            }
          },
          error: () => {
            this.handleError("Failed to fetch user profile.");
          }
        });
      },
      error: (err) => {
        console.error('Login error', err);

        if (this.loginForm) {
          this.loginForm.controls['username'].setErrors({'incorrect': true});
          this.loginForm.controls['password'].setErrors({'incorrect': true});
        }

        if (err.status === 401) {
          this.handleError("Invalid username or password.");
        } else if (err.status === 404) {
          this.handleError("User does not exist.");
        } else {
          this.handleError("An unexpected error occurred. Please try again.");
        }
      }
    });
  }

  private isAdminUser(user: any): boolean {
    return user?.authorities?.includes('ROLE_ADMIN');
  }

  private handleError(errorMsg: string): void {
    this.errors = [errorMsg];   
    this.isLoginFailed = true;
    this.submitted = false;
    this.tokenStorage.signOut();
  }


  reloadPage(): void {
    window.location.reload();
  }
}


