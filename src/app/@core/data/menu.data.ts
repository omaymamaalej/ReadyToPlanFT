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
        link: '/home/businessPlan/list',
      },
      {
        title: 'Create New Business Plans',
        link: 'businessPlan/createpresentation',
      },
    ],
  },
  {
    title: 'Personal Information',
    icon: 'person-outline',
    link: '/home/profileInformation',
  },
  {
    title: 'Auth',
    icon: 'lock-outline',
    children: [
      // {
      //   title: 'Login',
      //   link: '/auth/login',
      // },
      // {
      //   title: 'Register',
      //   link: '/auth/register',
      // },
      {
        title: 'Request Password',
        link: '/auth/request-password',
      },
      {
        title: 'Reset Password',
        link: '/auth/reset-password',
      },
    ],
  },
];
