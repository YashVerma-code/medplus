export type IconName = "/FaHome" | "/FaStar" | "/FaBriefcaseMedical" | "/FaUser" |"/FaStethoscope" | "/FaChat";
// patient
export const patientNavLinks :{label: string; route: string; icon: IconName }[] = [
  {
    label: 'Home',
    route: '/patient',
    icon: '/FaHome',
  },
  {
    label: 'Medical Info',
    route: '/patient/features/medinfo',
    icon: '/FaStar',
  },  
  {
    label: 'Resources',
    route: '/patient/features/resources',
    icon: '/FaStar',
  },
  {
    label: 'Health Connect',
    route: '/patient/features/health-connect',
    icon: '/FaStethoscope',
  },
  {
    label: 'Chat',
    route: '/chat',
    icon: '/FaChat',
  },
  {
    label: 'Profile',
    route: '/profile',
    icon: '/FaUser',
  },
];
//null
export const nullNavLinks :{label: string; route: string; icon: IconName }[] = [
  {
    label: 'Home',
    route: '/doctor',
    icon: '/FaHome',
  },
  {
    label: 'Feature 1',
    route: '/features/feature1',
    icon: '/FaStar',
  },  
  {
    label: 'Feature 2',
    route: '/features/feature2',
    icon: '/FaStar',
  },
  {
    label: 'Chat',
    route: '/chat',
    icon: '/FaChat',
  },
  {
    label: 'Profile',
    route: '/profile',
    icon: '/FaUser',
  },
];
// doctor
export const doctorNavLinks :{label: string; route: string; icon: IconName }[] = [
  {
    label: 'Home',
    route: '/doctor',
    icon: '/FaHome',
  },
  {
    label: 'Feature 1',
    route: '/doctor/features/feature1',
    icon: '/FaStar',
  },  
  {
    label: 'Feature 2',
    route: '/doctor/features/feature2',
    icon: '/FaStar',
  },
  {
    label: 'Chat',
    route: '/chat',
    icon: '/FaChat',
  },
  {
    label: 'Profile',
    route: '/profile',
    icon: '/FaUser',
  },
];
