import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { LayoutComponent } from './layout.component';
import { AddBusinessPlanComponent } from '../core/business-plan/add-business-plan/add-business-plan.component';
import { ListBusinessPlanComponent } from '../core/business-plan/list-business-plan/list-business-plan.component';
import { StrategicPlanningComponent } from '../core/strategic-planning/strategic-planning/strategic-planning.component';
import { AccountComponent } from '../pages/auth/account/account.component';
import { PasswordSettingsComponent } from '../pages/auth/password-settings/password-settings.component';
import { BusinessPlanListComponent } from '../core/strategic-planning/business-plan-list/business-plan-list.component';
import { ListUserComponent } from '../user/list-user/list-user.component';
import { AddTrainingCourseComponent } from '../core/training-course/add-training-course/add-training-course.component';
import { ListTrainingCourseComponent } from '../core/training-course/list-training-course/list-training-course.component';
import { DashboardComponent } from '../core/dashboard/dashboard.component';
import { AddTrainingCourseStepsComponent } from '../core/training-course/add-training-course-steps/add-training-course-steps.component';


const routes: Routes = [
  {path:'header',component:HeaderComponent},

  {
    path: '',
    component: LayoutComponent, 
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'businessPlan/createpresentation', component: AddBusinessPlanComponent },
      { path: 'businessPlan/listBusinessPlan', component: ListBusinessPlanComponent },
      { path: 'strategic-planning', component: StrategicPlanningComponent },
      { path: 'profileInformation/account', component: AccountComponent },
      { path: 'auth/password', component: PasswordSettingsComponent },
      { path: 'business-plan-list', component: BusinessPlanListComponent },
      { path: 'listUser', component: ListUserComponent },
      { path: 'trainingCourse/addTrainingCourse', component: AddTrainingCourseComponent },
      { path: 'trainingCourse/addTrainingCourseSteps', component: AddTrainingCourseStepsComponent },
      { path: 'trainingCourse/AllTrainingCourse', component: ListTrainingCourseComponent },

    ],
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
