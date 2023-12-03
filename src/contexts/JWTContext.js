import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';

// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state, action) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
};

const reducer = (state, action) => (handlers[action.type] ? handlers[action.type](state, action) : state);

const AuthContext = createContext({
  ...initialState,
  method: 'jwt',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const initialize = async () => {
      try {
        const token = window.localStorage.getItem('token');

        if (token && isValidToken(token)) {
          setSession(token);

          const response = await axios.get('http://localhost:8080/accounts/getUser');
          const user = response.data;
          console.log("Hello");
          console.log(user);
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user,
            },
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  },[]);

  const login = async (email, password) => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);
  
      const response = await axios.post('http://localhost:8080/accounts/login/', formData);
  
      console.log(response.data);
      
      /* eslint-disable camelcase */
      const { token, user_details } = response.data;
      
      localStorage.setItem('token', token.access)
      setSession(token);
      dispatch({
        type: 'LOGIN',
        payload: {
          user_details,
        },
      });
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Login failed:', error.response.data);
      } else {
        console.error('Login failed:', error.message);
      }
    }
  };
  
  
  const register = async (email, password, firstName, lastName) => {
    const formData = new FormData();
      formData.append('email', email);
      formData.append('name', `${firstName} ${lastName}`);
      formData.append('password', password);
      formData.append('password2', password);
    const response = await axios.post('http://localhost:8080/accounts/register/', formData); 
    console.log(response.data);
    const { token, user_details } = response.data;

    localStorage.setItem('token', token.access);
    dispatch({
      type: 'REGISTER',
      payload: {
        user_details,
      },
    });
  };

  const logout = async () => {
    setSession(null);
    dispatch({ type: 'LOGOUT' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'jwt',
        login,
        logout,
        register,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
