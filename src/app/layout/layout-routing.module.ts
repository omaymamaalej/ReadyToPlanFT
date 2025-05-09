import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout.component';
import { DashboardComponent } from '../core/dashboard/dashboard.component';
import { AddBusinessPlanComponent } from '../core/business-plan/add-business-plan/add-business-plan.component';


const routes: Routes = [
  {path:'header',component:HeaderComponent},

  {
    path: '',
    component: LayoutComponent, // Layout avec header
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'businessPlan/createpresentation', component: AddBusinessPlanComponent },
      // d'autres routes enfants ici
    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
