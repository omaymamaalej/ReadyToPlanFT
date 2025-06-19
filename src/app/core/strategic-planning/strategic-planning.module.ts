import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StrategicPlanningRoutingModule } from './strategic-planning-routing.module';
import { NbButtonModule, NbCardModule, NbInputModule, NbLayoutModule, NbOptionModule, NbSelectModule, NbStepperModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StrategicPlanningComponent } from './strategic-planning/strategic-planning.component';
import { ProductSalesComponent } from './product-sales/product-sales.component';
import { CompanyComponent } from './company/company.component';
import { RouterModule } from '@angular/router';
import { TeamComponent } from './team/team.component';
import { MarketingComponent } from './marketing/marketing.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { MarketingDetailComponent } from './marketing-detail/marketing-detail.component';
import { OthersComponent } from './others/others.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { AiResponseDialogComponent } from './ai-response-dialog/ai-response-dialog.component';
import { BusinessPlanFinalComponent } from './business-plan-final/business-plan-final.component';


@NgModule({
  declarations: [
    StrategicPlanningComponent,
    ProductSalesComponent,
    CompanyComponent,
    TeamComponent,
    MarketingComponent,
    ProductDetailComponent,
    TeamDetailComponent,
    MarketingDetailComponent,
    OthersComponent,
    CompanyDetailComponent,
    AiResponseDialogComponent,
    BusinessPlanFinalComponent
  ],
  imports: [
    RouterModule,
    CommonModule,
    NbCardModule,
    NbStepperModule,
    ReactiveFormsModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    NbSelectModule,
    NbOptionModule


  ],
  exports: [
    StrategicPlanningComponent,
    ProductSalesComponent,
    CompanyComponent
  ]
})
export class StrategicPlanningModule { }
