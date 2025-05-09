import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BusinessPlanRoutingModule } from './business-plan-routing.module';
import { AddBusinessPlanComponent } from './add-business-plan/add-business-plan.component';
import { NbActionsModule, NbAlertModule, NbBadgeModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbContextMenuModule, NbDatepickerModule, NbIconModule, NbInputModule, NbLayoutModule, NbMenuModule, NbRadioModule, NbSearchModule, NbSelectModule, NbSidebarModule, NbTreeGridModule, NbUserModule } from '@nebular/theme';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NbEvaIconsModule } from '@nebular/eva-icons';


@NgModule({
  declarations: [
    AddBusinessPlanComponent
  ],
  imports: [
    CommonModule,
    BusinessPlanRoutingModule,

    NbCardModule,
    NbSelectModule,
    NbCheckboxModule,
    NbRadioModule,

    NbInputModule,
    NbLayoutModule,
    NbMenuModule,
    NbSidebarModule,

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
    NbDatepickerModule


  ],
  exports: [
    AddBusinessPlanComponent
  ]
})
export class BusinessPlanModule { }
