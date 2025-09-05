import { Component, OnInit } from '@angular/core';
import { Color, ScaleType } from '@swimlane/ngx-charts';
import { TrainingCourseService } from 'src/app/services/training-course.service';
import { NbDialogService } from '@nebular/theme';
import { CommunicationService } from 'src/app/services/communication.service';
import { PresentationDialogComponent } from '../training-course/presentation-dialog/presentation-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  stats: any;
  publicCourses: any[] = [];
  totalCourses: number = 0;
  userStats: any = {
    totalUsers: 0,
    activeUsers: 0,
    coursesCreated: 0
  };

  colorScheme: Color = {
    name: 'customScheme',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: ['#5AA454', '#A10A28', '#C9C9C9']
  };

  constructor(
    private trainingService: TrainingCourseService,
    private userService: UserService,
    private communicationService: CommunicationService,
    private dialogService: NbDialogService,
    public tokenStorage: TokenStorageService
  ) { }

  ngOnInit(): void {
    this.trainingService.getPublicCourses().subscribe({
      next: (courses) => {
        this.publicCourses = courses;
      },
      error: (err) => console.error(err)
    });
  }


  loadAllData() {
    this.loadStats();
    this.loadPublicCourses();
    this.loadTotalCourses();
    this.loadUserStats();
  }

  loadStats() {
    this.trainingService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        if (this.totalCourses > 0) {
          this.stats.NotRated = this.totalCourses - (this.stats.Satisfied + this.stats.NotSatisfied);
        }
      },
      error: (err) => console.error(err),
    });
  }

  loadPublicCourses() {
    this.trainingService.getAll().subscribe({
      next: (courses) => {
        this.publicCourses = courses
          .filter(course => course.publicPresentation === true)
          .map(course => ({
            ...course,
            createdBy: course.createdBy || '',
            createdByLogin: course.createdByLogin || '',
            isFavorite: false
          }));

        console.log('Public courses with creator info:', this.publicCourses.map(c => ({
          id: c.id,
          title: c.title,
          createdBy: c.createdBy,
          createdByLogin: c.createdByLogin,
          publicPresentation: c.publicPresentation
        })));
      },
      error: (err) => console.error(err),
    });
  }

  loadTotalCourses() {
    this.trainingService.getAll().subscribe({
      next: (courses) => {
        this.totalCourses = courses.length;
        if (this.stats) {
          this.stats.NotRated = this.totalCourses - (this.stats.Satisfied + this.stats.NotSatisfied);
        }
      },
      error: (err) => console.error(err),
    });
  }

  loadUserStats() {
    if (this.tokenStorage.isAdmin()) {
      this.userService.getUserStats().subscribe({
        next: (stats) => {
          this.userStats = stats;
        },
        error: (err) => {
          console.error('Error loading user stats:', err);
          this.userStats = {
            totalUsers: 0,
            activeUsers: 0,
            coursesCreated: this.totalCourses
          };
        }
      });
    } else {
      this.userStats = {
        totalUsers: 0,
        activeUsers: 0,
        coursesCreated: this.totalCourses
      };
    }
  }

  viewPresentation(course: any) {
    course.loadingPresentation = true;
    this.trainingService.getPresentation(course.id).subscribe({
      next: (presentation: string) => {
        course.loadingPresentation = false;
        this.dialogService.open(PresentationDialogComponent, {
          context: {
            presentationText: presentation,
            courseData: course
          },
          autoFocus: true,
          closeOnBackdropClick: true,
        });
      },
      error: (err) => {
        course.loadingPresentation = false;
        console.error(err);
        alert("Impossible de récupérer la présentation.");
      }
    });
  }

  toggleFavorite(course: any) {
    course.isFavorite = !course.isFavorite;
  }

  getCreatedBy(course: any): string {
    return course.createdByLogin || course.createdBy || 'Nom inconnu';
  }

  evaluateCourse(courseId: string, satisfaction: number) {
    this.trainingService.evaluate(courseId, satisfaction).subscribe({
      next: () => {
        this.loadAllData();
        this.communicationService.notifyStatsUpdate();
      },
      error: (err) => console.error(err)
    });
  }
}
