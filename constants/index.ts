export type IconName = "/FaHome" | "/FaStar" | "/FaBriefcaseMedical" | "/FaUser" |"/FaStethoscope";
export const navLinks :{label: string; route: string; icon: IconName }[] = [
  {
    label: 'Home',
    route: '/',
    icon: '/FaHome',
  },
  {
    label: 'Feature 1',
    route: '/features/feature1',
    icon: '/FaStar',
  },  
  {
    label: 'Feature 2',
    route: '/',
    icon: '/FaStar',
  },
  {
    label: 'My Health Vault',
    route: '/features/my-health-vault',
    icon: '/FaBriefcaseMedical',
  },
  {
    label: 'Connect with Doctor',
    route: '/features/connect-with-doctor',
    icon: '/FaStethoscope',
  },
  {
    label: 'Feature 5',
    route: '/',
    icon: '/FaStar',
  },
  {
    label: 'Profile',
    route: '/',
    icon: '/FaUser',
  },
];
