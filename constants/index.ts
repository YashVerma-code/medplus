export type IconName = "/FaHome" | "/FaStar" | "/FaBriefcaseMedical" | "/FaUser" |"/FaStethoscope" | "/FaChat" | "/FaCalendarPlus2" | "/FaHousePlus";;
// patient
export const patientNavLinks :{label: string; route: string; icon: IconName }[] = [
  {
    label: 'Home',
    route: '/patient',
    icon: '/FaHome',
  },
  {
    label: 'Health Calendar',
    route: '/patient/features/health-calendar',
    icon: '/FaCalendarPlus2',
  },  
  {
    label: 'Care Finder',
    route: '/patient/features/care-finder',
    icon: '/FaHousePlus',
  },
  {
    label: 'Health Connect',
    route: '/patient/features/health-connect',
    icon: '/FaStethoscope',
  },
  {
    label: 'MedInfo',
    route: '/patient/features/medinfo',
    icon: '/FaHome',
  },
  {
    label: 'Chat',
    route: '/chat',
    icon: '/FaChat',
  },
  {
    label: 'resources',
    route: '/patient/features/resources',
    icon: '/FaHome',
  },
  {
    label: 'Profile',
    route: '/profile',
    icon: '/FaUser',
  }
  
 
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
    label: 'Appointment Calendar',
    route: '/doctor/features/appointment-calendar',
    icon: '/FaStar',
  },  
  {
    label: 'healthRecord',
    route: '/doctor/features/healthRecord',
    icon: '/FaStar',
  },
  {
    label: 'resources',
    route: '/doctor/features/resources',
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
