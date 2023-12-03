import PropTypes from 'prop-types';
import { Container, Alert, AlertTitle } from '@mui/material';
import jwtDecode from 'jwt-decode';

// ----------------------------------------------------------------------

RoleBasedGuard.propTypes = {
  accessibleRoles: PropTypes.array, // Example ['admin', 'leader']
  children: PropTypes.node
};

const useCurrentRole = () => {
  
  const token = window.localStorage.getItem('refresh');
  const decodedToken = jwtDecode(token);
  console.log(decodedToken);
  return decodedToken.is_staff ? 'admin' : 'user';
};

export default function RoleBasedGuard({ accessibleRoles, children }) {
  const currentRole = useCurrentRole();

  if (!accessibleRoles.includes(currentRole)) {
    return (
      <Container>
        <Alert severity="error">
          <AlertTitle>Permission Denied</AlertTitle>
          You do not have permission to access this page
        </Alert>
      </Container>
    );
  }

  return <>{children}</>;
}
