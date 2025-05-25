import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StrategicPlanningComponent } from './strategic-planning/strategic-planning.component';

const routes: Routes = [
  { path: 'strategic-planning', component: StrategicPlanningComponent },
  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StrategicPlanningRoutingModule { }
