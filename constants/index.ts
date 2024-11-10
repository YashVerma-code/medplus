export const navLinks = [
    {
      label: 'Home',
      route: '/',
      icon: '/assets/icons/home.svg',
    },
    {
      label: 'Feature 1',
      route: '/features/feature1',
      icon: '/assets/icons/stars.svg',
    },
    {
      label: 'Feature 2',
      route: '/',
      icon: '/assets/icons/stars.svg',
    },
    {
      label: 'Feature 3',
      route: '/',
      icon: '/assets/icons/stars.svg',
    },
    {
      label: 'Feature 4',
      route: '/',
      icon: '/assets/icons/stars.svg',
    },
    {
      label: 'Feature 5',
      route: '/',
      icon: '/assets/icons/stars.svg',
    },
    {
      label: 'Profile',
      route: '/',
      icon: '/assets/icons/profile.svg',
    },
    {
      label: 'Buy Credits',
      route: '/',
      icon: '/assets/icons/bag.svg',
    },
  ]
  
  export const plans = [
    {
      _id: 1,
      name: 'Free',
      icon: '/assets/icons/free-plan.svg',
      price: 0,
      credits: 20,
      inclusions: [
        {
          label: '20 Free Credits',
          isIncluded: true,
        },
        {
          label: 'Basic Access to Services',
          isIncluded: true,
        },
        {
          label: 'Priority Customer Support',
          isIncluded: false,
        },
        {
          label: 'Priority Updates',
          isIncluded: false,
        },
      ],
    },
    {
      _id: 2,
      name: 'Pro Package',
      icon: '/assets/icons/free-plan.svg',
      price: 299,
      credits: 120,
      inclusions: [
        {
          label: '120 Credits',
          isIncluded: true,
        },
        {
          label: 'Full Access to Services',
          isIncluded: true,
        },
        {
          label: 'Priority Customer Support',
          isIncluded: true,
        },
        {
          label: 'Priority Updates',
          isIncluded: false,
        },
      ],
    },
    {
      _id: 3,
      name: 'Premium Package',
      icon: '/assets/icons/free-plan.svg',
      price: 599,
      credits: 2000,
      inclusions: [
        {
          label: '2000 Credits',
          isIncluded: true,
        },
        {
          label: 'Full Access to Services',
          isIncluded: true,
        },
        {
          label: 'Priority Customer Support',
          isIncluded: true,
        },
        {
          label: 'Priority Updates',
          isIncluded: true,
        },
      ],
    },
  ]
  export const creditFee = -1