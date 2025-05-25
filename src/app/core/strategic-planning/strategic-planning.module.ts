import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StrategicPlanningRoutingModule } from './strategic-planning-routing.module';
import { NbButtonModule, NbCardModule, NbLayoutModule, NbStepperModule } from '@nebular/theme';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StrategicPlanningComponent } from './strategic-planning/strategic-planning.component';
import { ProductSalesComponent } from './product-sales/product-sales.component';


@NgModule({
  declarations: [
    StrategicPlanningComponent,
    ProductSalesComponent
  ],
  imports: [
    CommonModule,
    NbCardModule,
    NbStepperModule



  ],
  exports: [
    StrategicPlanningComponent,
    ProductSalesComponent
  ]
})
export class StrategicPlanningModule { }
