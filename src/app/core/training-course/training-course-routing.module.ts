import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddTrainingCourseComponent } from './add-training-course/add-training-course.component';
import { ListTrainingCourseComponent } from './list-training-course/list-training-course.component';

const routes: Routes = [
    { path: 'addTrainingCourse', component: AddTrainingCourseComponent },
    { path: 'listTrainingCourse', component: ListTrainingCourseComponent },

  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TrainingCourseRoutingModule { }
