import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  NbMediaBreakpointsService,
  NbMenuService,
  NbSidebarService,
  NbThemeService,
  NbMenuItem,
} from '@nebular/theme';
import { map, Subject, takeUntil } from 'rxjs';
import { ADMIN_MENU_ITEMS, USER_MENU_ITEMS } from 'src/app/@core/data/menu.data';
import { LayoutService } from 'src/app/@core/utils/layout.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { CommunicationService } from 'src/app/services/communication.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  menu: NbMenuItem[] = [];
  favMenu: any[] = [];
  userName: string = '';
  userMenu = [{ title: 'Personal Information', link: 'profileInformation/account' }];
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
  ) { }

  ngOnInit() {
    this.updateMenu();
    const user = this.tokenStorageService.getUser();
    if (user) {
      this.userName = user.login;
    }

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

    this.currentTheme = this.themeService.currentTheme;
    const { xl } = this.breakpointService.getBreakpointsMap();

    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe(isLessThanXl => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);

    this.communicationService.favoriteCourses$.subscribe((courses: any[]) => {
      this.favMenu = courses.map(course => ({
        title: course.title,
        icon: 'eye-outline',
        data: course
      }));
    });

    this.menuService.onItemClick()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ tag, item }) => {
        if (tag === 'favMenuTag' && item.data) {
          this.viewPresentation(item.data);
        }
      });
  }

  viewPresentation(course: any) {
    this.router.navigate(['/trainingCourse/view', course.id]);
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