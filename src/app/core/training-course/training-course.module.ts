import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainingCourseRoutingModule } from './training-course-routing.module';
import { AddTrainingCourseComponent } from './add-training-course/add-training-course.component';
import { ListTrainingCourseComponent } from './list-training-course/list-training-course.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbButtonModule, NbInputModule, NbSelectModule, NbFormFieldModule, NbIconModule, NbCheckboxModule, NbLayoutModule, NbSpinnerModule } from '@nebular/theme';
import { PresentationDialogComponent } from './presentation-dialog/presentation-dialog.component';


@NgModule({
  declarations: [
    AddTrainingCourseComponent,
    ListTrainingCourseComponent,
    PresentationDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    TrainingCourseRoutingModule,
    ReactiveFormsModule,
    FormsModule,

    NbCardModule,
    NbButtonModule,
    NbInputModule,
    NbSelectModule,
    NbFormFieldModule,
    NbIconModule,
    NbCheckboxModule,
    NbLayoutModule,
    NbSpinnerModule
  ],
  exports: [
    AddTrainingCourseComponent,
    ListTrainingCourseComponent,
    PresentationDialogComponent
  ]
})
export class TrainingCourseModule { }
