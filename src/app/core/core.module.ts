import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CoreRoutingModule } from './core-routing.module';
import { BusinessPlanModule } from './business-plan/business-plan.module';
import { NbActionsModule, NbAlertModule, NbBadgeModule, NbButtonModule, NbCardModule, NbCheckboxModule, NbContextMenuModule, NbDatepickerModule, NbIconModule, NbInputModule, NbLayoutModule, NbMenuModule, NbSearchModule, NbSelectModule, NbSidebarModule, NbTreeGridModule, NbUserModule } from '@nebular/theme';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LayoutModule } from '../layout/layout.module';
import { StrategicPlanningModule } from './strategic-planning/strategic-planning.module';


@NgModule({
  declarations: [
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    CoreRoutingModule,
    BusinessPlanModule,
    StrategicPlanningModule,
    NbLayoutModule,
    LayoutModule,
    NbDatepickerModule,
    NbSidebarModule,
    BrowserAnimationsModule,
    NbMenuModule,
    NbIconModule,
    NbBadgeModule,
    NbInputModule,
    NbButtonModule,
    NbCardModule,
    NbAlertModule,
    NbCheckboxModule,
    TranslateModule,
    NbTreeGridModule,
    NbSelectModule,
    NbActionsModule,
    NbContextMenuModule,
    NbSearchModule,
    NbUserModule,
    NbEvaIconsModule
  ],
  exports: [
    DashboardComponent
  ]
})
export class CoreModule { }
