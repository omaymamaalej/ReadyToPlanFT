import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StrategicPlanningComponent } from './strategic-planning/strategic-planning.component';
import { CompanyComponent } from './company/company.component';
import { NbDialogModule } from '@nebular/theme';
import { BusinessPlanFinalComponent } from './business-plan-final/business-plan-final.component';

const routes: Routes = [
  { path: 'strategic-planning', component: StrategicPlanningComponent },
   { path: 'Add_company', component: CompanyComponent },
   { path: 'Add_team', component: CompanyComponent },
     { path: 'Add_marketing', component: CompanyComponent },
     { path: 'business-plan-final', component: BusinessPlanFinalComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes), NbDialogModule.forChild()],
 
  exports: [RouterModule]
})
export class StrategicPlanningRoutingModule { }
