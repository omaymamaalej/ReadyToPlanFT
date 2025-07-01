import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountComponent } from '../pages/auth/account/account.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { ListUserComponent } from '../user/list-user/list-user.component';
import { AdminGuard } from '../_guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    component: DashboardAdminComponent,
    canActivate: [AdminGuard],
    children: [
      { path: '', redirectTo: 'admin', pathMatch: 'full' },
      { path: 'account', component: AccountComponent },
      { path: 'listUser', component: ListUserComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
