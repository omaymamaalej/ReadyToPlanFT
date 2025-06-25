import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  NbActionsModule,
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbIconModule,
  NbInputModule,
  NbThemeModule,
} from '@nebular/theme';


import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { NbAuthModule } from '@nebular/auth';
import { AccountComponent } from './account/account.component';
import { PasswordStrengthComponent } from './password-strength/password-strength.component';
import { PasswordSettingsComponent } from './password-settings/password-settings.component';

@NgModule({
  declarations: [
    LoginComponent, 
    RegisterComponent, AccountComponent, PasswordStrengthComponent, PasswordSettingsComponent
  ],
  
  imports: [
    CommonModule,
    AuthRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NbInputModule,
    NbButtonModule,
    NbCardModule,
    NbAlertModule,
    NbCheckboxModule,
    TranslateModule,
    NbAuthModule.forRoot(),
    NbIconModule,
    NbThemeModule,
    NbActionsModule

    
  ],
  exports: [LoginComponent, AccountComponent, PasswordStrengthComponent, PasswordSettingsComponent],
})
export class AuthModule {}
