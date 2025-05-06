import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { NbAuthComponent, NbLoginComponent, NbRegisterComponent } from '@nebular/auth';

const routes: Routes = [
  {path:'auth/login',component:LoginComponent},
  {path:'auth/register',component:RegisterComponent},

  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
