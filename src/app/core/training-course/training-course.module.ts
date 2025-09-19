import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TrainingCourseRoutingModule } from './training-course-routing.module';
import { AddTrainingCourseComponent } from './add-training-course/add-training-course.component';
import { ListTrainingCourseComponent } from './list-training-course/list-training-course.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbCardModule, NbButtonModule, NbInputModule, NbSelectModule, NbFormFieldModule, NbIconModule, NbCheckboxModule, NbLayoutModule, NbSpinnerModule, NbStepperModule, NbListModule, NbDialogModule, NbToastrModule } from '@nebular/theme';
import { PresentationDialogComponent } from './presentation-dialog/presentation-dialog.component';
import { AddTrainingCourseStepsComponent } from './add-training-course-steps/add-training-course-steps.component';
import { CourseInformationComponent } from './steps/course-information/course-information.component';
import { CourseContentComponent } from './steps/course-content/course-content.component';
import { CourseDetailsComponent } from './steps/course-details/course-details.component';
import { CoursePlanEditorComponent } from './steps/course-plan-editor/course-plan-editor.component';


@NgModule({
  declarations: [
    AddTrainingCourseComponent,
    ListTrainingCourseComponent,
    PresentationDialogComponent,
    AddTrainingCourseStepsComponent,
    CourseInformationComponent,
    CourseContentComponent,
    CourseDetailsComponent,
    CoursePlanEditorComponent
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
    NbSpinnerModule,
    NbStepperModule,
    NbListModule,
    NbDialogModule.forChild(),
    NbToastrModule,
  ],
  exports: [
    AddTrainingCourseComponent,
    ListTrainingCourseComponent,
    PresentationDialogComponent,
    AddTrainingCourseStepsComponent
  ]
})
export class TrainingCourseModule { }
