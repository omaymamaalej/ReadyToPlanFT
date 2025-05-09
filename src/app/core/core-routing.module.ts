import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBusinessPlanComponent } from './business-plan/add-business-plan/add-business-plan.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
  { path: 'home/dashboard', component: DashboardComponent },
  // { path: 'businessPlan/createpresentation', component: AddBusinessPlanComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CoreRoutingModule { }
