import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService } from '@nebular/theme';
import { map, Subject, takeUntil } from 'rxjs';
import { MENU_ITEMS } from 'src/app/@core/data/menu.data';
import { LayoutService } from 'src/app/@core/utils/layout.service';
import { TokenStorageService } from 'src/app/_services/token-storage.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {

  menu = MENU_ITEMS;


  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: { name: string; picture: string } = {
    name: 'John Doe',
    picture: 'https://example.com/path-to-image.jpg'
  };

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  currentTheme = 'default';

  userMenu = [{ title: 'Profile' }, { title: 'Log out' }];

  constructor(private sidebarService: NbSidebarService,
    private menuService: NbMenuService,
    private themeService: NbThemeService,
    private userService: UserService,
    private layoutService: LayoutService,
    private breakpointService: NbMediaBreakpointsService,
    public tokenStorageService: TokenStorageService,
    private router: Router) { }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    this.userService.get()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => {
        this.user = {
          name: users.nick?.name ?? 'Invité',
          picture: users.nick?.picture ?? 'assets/images/default-avatar.png',
        };
      });


    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
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
}
