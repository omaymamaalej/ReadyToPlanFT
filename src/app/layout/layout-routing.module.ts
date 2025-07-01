import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout.component';
import { AddBusinessPlanComponent } from '../core/business-plan/add-business-plan/add-business-plan.component';
import { ListBusinessPlanComponent } from '../core/business-plan/list-business-plan/list-business-plan.component';
import { StrategicPlanningComponent } from '../core/strategic-planning/strategic-planning/strategic-planning.component';
import { AccountComponent } from '../pages/auth/account/account.component';
import { PasswordSettingsComponent } from '../pages/auth/password-settings/password-settings.component';
import { BusinessPlanListComponent } from '../core/strategic-planning/business-plan-list/business-plan-list.component';
import { ListUserComponent } from '../user/list-user/list-user.component';


const routes: Routes = [
  {path:'header',component:HeaderComponent},

  {
    path: '',
    component: LayoutComponent, 
    children: [
      { path: 'businessPlan/createpresentation', component: AddBusinessPlanComponent },
      { path: 'businessPlan/listBusinessPlan', component: ListBusinessPlanComponent },
      { path: 'strategic-planning', component: StrategicPlanningComponent },
      { path: 'profileInformation/account', component: AccountComponent },
      { path: 'auth/password', component: PasswordSettingsComponent },
      { path: 'business-plan-list', component: BusinessPlanListComponent },
      { path: 'listUser', component: ListUserComponent }



    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
