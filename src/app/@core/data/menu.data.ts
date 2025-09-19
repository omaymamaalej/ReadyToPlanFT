import { NbMenuItem } from '@nebular/theme';

export const ADMIN_MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline', 
    link: '/dashboard',
  },

  {
    title: 'Profile',
    icon: 'edit-outline',
    link: 'profileInformation/account',
  },



  {
    title: 'FEATURES',
    group: true,
  },

  {
    title: 'List User',
    icon: 'list-outline',
    link: '/listUser',
  },
  // {
  //   title: 'Business Plans',
  //   icon: 'briefcase-outline',
  //   children: [
  //     {
  //       title: 'All Business Plans',
  //       link: 'businessPlan/listBusinessPlan',
  //     },
  //   ],
  // },
  // {
  //   title: 'Strategic Planning',
  //   icon: 'pie-chart-outline',
  //   children: [
  //     {
  //       title: 'All Strategies',
  //       link: '/business-plan-list/',
  //     },
  //   ],
  // },
  
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
  // {
  //   title: 'Log Out',
  //   icon: 'log-out-outline',
  //   link: '/login',
  //   data: { action: 'logout' },
  // },
];

export const USER_MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'Dashboard',
    icon: 'home-outline', 
    link: '/dashboard',
  },
  {
    title: 'Profile',
    icon: 'edit-outline',
    link: 'profileInformation/account',
  },
  {
    title: 'FEATURES',
    group: true,
  },
  {
    title: 'Training Course',
    icon: 'book-outline',
    children: [
      {
        title: 'All Courses',
        link: 'trainingCourse/AllTrainingCourse',
      },
      {
        title: 'Add New Course (Automatic)',
        link: 'trainingCourse/addTrainingCourseAutomatic',
      },
      {
        title: 'Add New Course (With Steps)',
        link: 'trainingCourse/addTrainingCourseSteps',
      },
    ],
  },
  // {
  //   title: 'Business Plans',
  //   icon: 'briefcase-outline',
  //   children: [
  //     {
  //       title: 'All Business Plans',
  //       link: 'businessPlan/listBusinessPlan',
  //     },
  //     {
  //       title: 'Create New Business Plans',
  //       link: 'businessPlan/createpresentation',
  //     },
  //   ],
  // },
  // {
  //   title: 'Strategic Planning',
  //   icon: 'pie-chart-outline',
  //   children: [
  //     {
  //       title: 'Add Strategy',
  //       link: '/strategic-planning/',
  //     },
  //     {
  //       title: 'All Strategies',
  //       link: '/business-plan-list/',
  //     },
  //   ],
  // },
  // {
  //   title: 'Profile',
  //   icon: 'edit-outline',
  //   link: 'profileInformation/account',
  // },
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
  // {
  //   title: 'Log Out',
  //   icon: 'log-out-outline',
  //   link: '/login',
  //   data: { action: 'logout' },
  // },
];