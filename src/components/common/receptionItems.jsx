import { BiCalendarStar, BiUserCheck } from "react-icons/bi";
import { MdDashboard, MdNotifications, MdSchedule, MdSpa } from "react-icons/md";



export const ReceptionistItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <MdDashboard size={22} />,
      path: '/reception/dashboard'
    },
    {
      id: 'checkin',
      label: 'Check-In Clients',
      icon: <BiUserCheck size={22} />,
      path: '/reception/check-in'
    },
    {
      id: 'services',
      label: 'Services',
      icon: <MdSpa size={22} />,
      path: '/reception/services'
    },
    {
      id: 'special',
      label: 'Special Offers',
      icon: <BiCalendarStar size={22} />,
      path: '/reception/special-offers'
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <MdNotifications size={22} />,
      path: '/reception/notifications'
    }
  ];
