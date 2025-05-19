import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBusinessPlanComponent } from './add-business-plan/add-business-plan.component';
import { ListBusinessPlanComponent } from './list-business-plan/list-business-plan.component';

const routes: Routes = [
  { path: 'createpresentation', component: AddBusinessPlanComponent },
  { path: 'listBusinessPlan', component: ListBusinessPlanComponent },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessPlanRoutingModule { }
