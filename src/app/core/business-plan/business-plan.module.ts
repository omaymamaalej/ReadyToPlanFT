import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessPlanRoutingModule } from './business-plan-routing.module';
import { AddBusinessPlanComponent } from './add-business-plan/add-business-plan.component';
import { NbActionsModule, NbAlertModule, NbBadgeModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbContextMenuModule, NbDatepickerModule, NbDialogModule, NbIconModule, NbInputModule, NbLayoutModule, NbMenuModule, NbRadioModule, NbSearchModule, NbSelectModule, NbSidebarModule, NbSpinnerModule, NbTooltipModule, NbTreeGridModule, NbUserModule } from '@nebular/theme';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListBusinessPlanComponent } from './list-business-plan/list-business-plan.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { PresentationDialogComponent } from './presentation-dialog/presentation-dialog.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UpdateBusinessPlanComponent } from './update-business-plan/update-business-plan.component';
import { MarkdownModule } from 'ngx-markdown';


@NgModule({
  declarations: [
    AddBusinessPlanComponent,
    ListBusinessPlanComponent,
    PresentationDialogComponent,
    UpdateBusinessPlanComponent
  ],
  imports: [
    CommonModule,
    BusinessPlanRoutingModule,
    ReactiveFormsModule,

    NbCardModule,
    NbSelectModule,
    NbCheckboxModule,
    NbRadioModule,

    NbInputModule,
    NbLayoutModule,
    NbMenuModule,
    NbSidebarModule,
    FormsModule,

    BrowserAnimationsModule,
    NbIconModule,
    NbBadgeModule,
    NbButtonModule,
    NbAlertModule,
    TranslateModule,
    NbTreeGridModule,
    NbActionsModule,
    NbContextMenuModule,
    NbSearchModule,
    NbUserModule,
    NbEvaIconsModule,
    NbDatepickerModule,
    NgxPaginationModule,
    NbDialogModule.forRoot(),
    SharedModule,
    MarkdownModule,
    NbSpinnerModule,
    NbTooltipModule



  ],
  exports: [
    AddBusinessPlanComponent,
    ListBusinessPlanComponent,
    UpdateBusinessPlanComponent,
    PresentationDialogComponent
  ],
  entryComponents: [PresentationDialogComponent]

})
export class BusinessPlanModule { }
