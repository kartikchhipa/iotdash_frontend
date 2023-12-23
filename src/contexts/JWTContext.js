import { createContext, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
// utils
import axios from '../utils/axios';
import { isValidToken, setSession } from '../utils/jwt';
// import environment variables from root .env file


// ----------------------------------------------------------------------

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user_details: null,
};

// ignore camel case in this file
/* eslint camelcase: ["error", {ignoreDestructuring: true, allow: ["user_details"]}] */
/* eslint-disable camelcase */


const django_app_host = 'http://10.6.0.56:8080'

const handlers = {
  INITIALIZE: (state, action) => {
    const { isAuthenticated, user_details } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user_details,
    };
  },
  LOGIN: (state, action) => {
    const { user_details } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user_details,
    };
  },
  LOGOUT: (state) => ({
    ...state,
    isAuthenticated: false,
    user_details: null,
  }),
  REGISTER: (state, action) => {
    const { user_details } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user_details,
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

          const response = await axios.get(`${django_app_host}/accounts/getUser/`);
          const user_details = response.data;
          console.log("Hello");
          console.log(user_details);
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user_details,
            },
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user_details: null,
            },
          });
        }
      } catch (err) {
        console.error(err);
        dispatch({
          type: 'INITIALIZE',
          payload: {
            isAuthenticated: false,
            user_details: null,
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
  
      const response = await axios.post(`${django_app_host}/accounts/login/`, formData);

  
      console.log(response.data);
      
      /* eslint-disable camelcase */
      const { token,  user_details} = response.data;
      localStorage.setItem('token', token.access)
      localStorage.setItem('refresh', token.refresh)
      setSession(token);
      dispatch({
        type: 'LOGIN',
        payload: {
          user_details,
        },
      });
      console.log(handlers)
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
    
    
    const response = await axios.post(`${django_app_host}/accounts/register/`, formData); 
    console.log(response.data);
    const { token, user_details } = response.data;
    console.log(user_details)
    localStorage.setItem('token', token.access);
    localStorage.setItem('user_details', user_details);
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
