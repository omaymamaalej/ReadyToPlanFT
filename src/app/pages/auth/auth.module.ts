// import { NgModule } from '@angular/core';
// import { CommonModule } from '@angular/common';

// import { AuthRoutingModule } from './auth-routing.module';
// import { LoginComponent } from './login/login.component';
// import { RegisterComponent } from './register/register.component';
// import { ReactiveFormsModule } from '@angular/forms';
// import { NbAlertModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbInputModule, NbThemeModule } from '@nebular/theme';
// import { NbAuthModule } from '@nebular/auth';


// @NgModule({
//   declarations: [
//     LoginComponent,
//     RegisterComponent
//   ],
//   imports: [
//     CommonModule,
//     AuthRoutingModule,
//     ReactiveFormsModule,
//     NbInputModule,
//     NbButtonModule,
//     NbCardModule,
//     NbAlertModule,
//     NbCheckboxModule,
//     NbThemeModule.forRoot({
//       name: 'default', 
//     }),
//     NbAuthModule.forRoot({
//       strategies: [],
//       forms: {},
//     }),

//   ],
//   exports: [
//     LoginComponent,
//     RegisterComponent
//   ]
// })
// export class AuthModule { }


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthRoutingModule } from './auth-routing.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
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

@NgModule({
  declarations: [
    LoginComponent, 
    RegisterComponent
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
    NbThemeModule

    
  ],
  exports: [LoginComponent],
})
export class AuthModule {}
