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
        const token = window.localStorage.getItem('accessToken');
        if (token && isValidToken(token)) {
          setSession(token);
          const { data } = await axios.get('http://10.6.0.56:8080/accounts/user/', { headers: { Authorization: `Bearer ${token}` } });
          const user_details = data;
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user_details,
            },
          });
        }
        else if (token && !isValidToken(token)) {
          const response = await axios.post("http://10.6.0.56:8080/accounts/refresh/", {}, { withCredentials: true });
          if (response.status === 200) {
            setSession(response.data.token);
            const { data } = await axios.get('http://10.6.0.56:8080/accounts/user/', { headers: { Authorization: `Bearer ${response.data.token}` } });
            const user_details = data;
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: true,
                user_details,
              },
            });
          }
          else {
            setSession(null);
            dispatch({
              type: 'INITIALIZE',
              payload: {
                isAuthenticated: false,
                user_details: null,
              },
            });
          }
        }
        else {
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
  }, []);

  const login = async (email, password) => {
    try {
      const formData = new FormData();
      formData.append('email', email);
      formData.append('password', password);

      const { data } = await axios.post(`http://10.6.0.56:8080/accounts/login/`, formData, { withCredentials: true });
      /* eslint-disable camelcase */
      const { token, user_details } = data;
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


    const { data } = await axios.post(`http://10.6.0.56:8080/accounts/register/`, formData);
    const { token, user_details } = data;
    localStorage.setItem('token', token);
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
