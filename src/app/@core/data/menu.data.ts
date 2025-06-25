import { NbMenuItem } from '@nebular/theme';

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline',
    link: '/home/dashboard',
  },

  {
    title: 'FEATURES',
    group: true,
  },

  {
    title: 'Business Plans',
    icon: 'briefcase-outline',
    children: [
      {
        title: 'All Business Plans',
        link: 'businessPlan/listBusinessPlan',
      },
      {
        title: 'Create New Business Plans',
        link: 'businessPlan/createpresentation',
      },
    ],
  },
  {
    title: 'Strategic Planning',
    icon: 'pie-chart-outline', 
    link: 'strategic-planning', 
  },
  {
    title: 'Personal Information',
    icon: 'person-outline',
    link: 'profileInformation/account',
  },
  {
    title: 'Auth',
    icon: 'lock-outline',
    children: [
      {
        title: 'Password Settings',
        link: 'auth/password',
      }
    ],
  },
  {
    title: 'Log Out',
    icon: 'log-out-outline',
    link: '/login',
    data: { action: 'logout' },
  },
];
