import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
  NbMenuItem,
  NbDialogService,
} from '@nebular/theme';
import { map, Subject, takeUntil } from 'rxjs';
import { ADMIN_MENU_ITEMS, USER_MENU_ITEMS } from 'src/app/@core/data/menu.data';
import { LayoutService } from 'src/app/@core/utils/layout.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { PresentationDialogComponent } from 'src/app/core/training-course/presentation-dialog/presentation-dialog.component';
import { CommunicationService } from 'src/app/services/communication.service';
import { TrainingCourseService } from 'src/app/services/training-course.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  menu: NbMenuItem[] = [];
  favCourses: any[] = [];
  userName: string = '';
  isUserMenuOpen = false;

  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly = false;
  currentTheme = 'default';

  constructor(
    private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    public tokenStorageService: TokenStorageService,
    private router: Router,
    private communicationService: CommunicationService,
    private trainingService: TrainingCourseService,
    private dialogService: NbDialogService,
  ) { }

  ngOnInit() {
    this.updateMenu();

    const user = this.tokenStorageService.getUser();
    if (user) this.userName = user.login;

    // Mettre à jour la liste des favoris dynamiquement
    this.communicationService.favoriteCourses$
      .pipe(takeUntil(this.destroy$))
      .subscribe(courses => this.favCourses = courses);

    // Gestion des menus utilisateur
    this.tokenStorageService.loggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoggedIn => {
        if (isLoggedIn) {
          this.updateMenu();
          const user = this.tokenStorageService.getUser();
          this.userName = user.login;
        } else {
          this.menu = [];
          this.userName = '';
        }
      });

    // Media & Theme
    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(map(([, currentBreakpoint]) => currentBreakpoint.width < xl), takeUntil(this.destroy$))
      .subscribe(isLessThanXl => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(map(({ name }) => name), takeUntil(this.destroy$))
      .subscribe(themeName => this.currentTheme = themeName);
  }

  // viewPresentation(course: any) {
  //   this.router.navigate(['/trainingCourse/view', course.id]);
  // }

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

  removeFromFav(course: any) {
    this.communicationService.removeFavorite(course);
  }


  private updateMenu() {
    this.menu = this.tokenStorageService.isAdmin() ? ADMIN_MENU_ITEMS : USER_MENU_ITEMS;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();
    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

  logout(): void {
    this.tokenStorageService.signOut();
    this.router.navigate(['/login']);
  }

  toggleUserMenu() {
    this.isUserMenuOpen = !this.isUserMenuOpen;
  }
}
