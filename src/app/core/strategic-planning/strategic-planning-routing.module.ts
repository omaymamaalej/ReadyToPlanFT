import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StrategicPlanningComponent } from './strategic-planning/strategic-planning.component';
import { CompanyComponent } from './company/company.component';
import { BusinessPlanFinalComponent } from './business-plan-final/business-plan-final.component';
import { BusinessPlanListComponent } from './business-plan-list/business-plan-list.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

const routes: Routes = [
  { path: 'strategic-planning', component: StrategicPlanningComponent },
  { path: 'Add_company', component: CompanyComponent },
  { path: 'Add_team', component: CompanyComponent },
  { path: 'Add_marketing', component: CompanyComponent },
  { path: 'business-plan-final', component: BusinessPlanFinalComponent },
  { path: 'business-plan-list', component: BusinessPlanListComponent },
  { path: 'product-detail', component: ProductDetailComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent }


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StrategicPlanningRoutingModule { }
