// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import SvgIconStyle from '../../../components/SvgIconStyle';

// ----------------------------------------------------------------------

const getIcon = (name) => <SvgIconStyle src={`/icons/${name}.svg`} sx={{ width: 1, height: 1 }} />;

const ICONS = {
  blog: getIcon('ic_blog'),
  cart: getIcon('ic_cart'),
  chat: getIcon('ic_chat'),
  mail: getIcon('ic_mail'),
  user: getIcon('ic_user'),
  kanban: getIcon('ic_kanban'),
  banking: getIcon('ic_banking'),
  calendar: getIcon('ic_calendar'),
  ecommerce: getIcon('ic_ecommerce'),
  analytics: getIcon('ic_analytics'),
  dashboard: getIcon('ic_dashboard'),
  booking: getIcon('ic_booking'),
  add: getIcon('ic_add'),
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'app', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
        {
          title: 'user',
          path: PATH_DASHBOARD.user.root,
          icon: ICONS.user,
          children: [
            { title: 'sensors', path: PATH_DASHBOARD.user.sensors },
            { title: 'devices', path: PATH_DASHBOARD.user.devices },
            { title: 'allocation', path: PATH_DASHBOARD.user.allocation },
            { title: 'account', path: PATH_DASHBOARD.user.account },
          ],
        },

        { title: 'Add Device/Sensor', path: PATH_DASHBOARD.add, icon: ICONS.add },

    ],
  },
];

export default navConfig;
