import { NbMenuItem } from '@nebular/theme';

export const ADMIN_MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'List User',
    icon: 'list-outline',
    link: '/listUser',
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
    ],
  },
  {
    title: 'Strategic Planning',
    icon: 'pie-chart-outline',
    children: [
      {
        title: 'All Strategies',
        link: '/business-plan-list/',
      },
    ],
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
      },
    ],
  },
  {
    title: 'Log Out',
    icon: 'log-out-outline',
    link: '/login',
    data: { action: 'logout' },
  },
];

export const USER_MENU_ITEMS: NbMenuItem[] = [
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
    children: [
      {
        title: 'Add Strategy',
        link: '/strategic-planning/',
      },
      {
        title: 'All Strategies',
        link: '/business-plan-list/',
      },
    ],
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
      },
    ],
  },
  {
    title: 'Log Out',
    icon: 'log-out-outline',
    link: '/login',
    data: { action: 'logout' },
  },
];