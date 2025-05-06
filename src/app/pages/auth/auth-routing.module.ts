import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NbAuthComponent, NbLoginComponent, NbRegisterComponent } from '@nebular/auth';

const routes: Routes = [
  // {
  //   path: 'auth',
  //   component: NbAuthComponent,
  //   children: [

  //     {
  //       path: 'login',
  //       component: NbLoginComponent,
  //     },
  //     {
  //       path: 'register',
  //       component: NbRegisterComponent,
  //     },
  //   ],
  // },

  {path:'auth/login',component:LoginComponent},
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },


  // {
  //   path: 'login',
  //   component: LoginComponent,
  // },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
