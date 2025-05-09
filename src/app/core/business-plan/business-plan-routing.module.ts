import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBusinessPlanComponent } from './add-business-plan/add-business-plan.component';

const routes: Routes = [
  { path: 'createpresentation', component: AddBusinessPlanComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BusinessPlanRoutingModule { }
