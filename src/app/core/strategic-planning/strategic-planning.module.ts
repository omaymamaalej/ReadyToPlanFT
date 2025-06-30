import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NbAccordionModule, NbAlertModule, NbButtonModule, NbCardModule, NbDialogModule, NbIconModule, NbInputModule, NbLayoutModule, NbOptionModule, NbSelectModule, NbSpinnerModule, NbStepperModule, NbToastrModule, NbTooltipModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StrategicPlanningComponent } from './strategic-planning/strategic-planning.component';
import { ProductSalesComponent } from './product-sales/product-sales.component';
import { AiResponseDialogComponent } from './ai-response-dialog/ai-response-dialog.component';
import { BusinessPlanFinalComponent } from './business-plan-final/business-plan-final.component';
import { BusinessPlanListComponent } from './business-plan-list/business-plan-list.component';
import { CompanyDetailComponent } from './company-detail/company-detail.component';
import { CompanyComponent } from './company/company.component';
import { MarketingDetailComponent } from './marketing-detail/marketing-detail.component';
import { MarketingComponent } from './marketing/marketing.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { TeamDetailComponent } from './team-detail/team-detail.component';
import { TeamComponent } from './team/team.component';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { BusinessPlanPresentationDialogComponent } from './business-plan-presentation-dialog/business-plan-presentation-dialog.component';
import { UpdateBusinessPlanFinalComponent } from './update-business-plan-final/update-business-plan-final.component';


@NgModule({
  declarations: [
    StrategicPlanningComponent,
    ProductSalesComponent,
    AiResponseDialogComponent,
    BusinessPlanFinalComponent,
    BusinessPlanListComponent,
    CompanyDetailComponent,
    CompanyComponent,
    MarketingDetailComponent,
    MarketingComponent,
    ProductDetailComponent,
    TeamDetailComponent,
    TeamComponent,
    BusinessPlanPresentationDialogComponent,
    UpdateBusinessPlanFinalComponent
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
    NbOptionModule,
    NgxPaginationModule,
    NbIconModule,       
    NbEvaIconsModule,  
    NbAccordionModule,
    NbDialogModule.forChild(),
    FormsModule,
    NbAlertModule,
    NbSpinnerModule,
    NbTooltipModule,
    NbToastrModule,



  ],
  exports: [
    StrategicPlanningComponent,
    ProductSalesComponent,
    AiResponseDialogComponent,
    BusinessPlanFinalComponent,
    BusinessPlanListComponent,
    CompanyDetailComponent,
    CompanyComponent,
    MarketingDetailComponent,
    MarketingComponent,
    ProductDetailComponent,
    TeamDetailComponent,
    TeamComponent,
    BusinessPlanPresentationDialogComponent,
    UpdateBusinessPlanFinalComponent
  ]
})
export class StrategicPlanningModule { }
