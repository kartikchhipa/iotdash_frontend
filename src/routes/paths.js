// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  register: path(ROOTS_AUTH, '/register'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  verify: path(ROOTS_AUTH, '/verify')
};

export const PATH_PAGE = {  
  page404: '/404',
  page500: '/500',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),   
  },
  add: path(ROOTS_DASHBOARD, '/add'),
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    sensors: path(ROOTS_DASHBOARD, '/user/sensors'),
    devices: path(ROOTS_DASHBOARD, '/user/devices'),
    allocation: path(ROOTS_DASHBOARD, '/user/allocation'),
    account: path(ROOTS_DASHBOARD, '/user/account')
  },
};

export const PATH_DOCS = 'https://docs-minimals.vercel.app/introduction';
