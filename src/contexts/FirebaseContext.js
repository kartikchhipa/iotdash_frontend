import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer, useState } from 'react';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from 'firebase/auth';
import { getFirestore, collection, doc, getDoc, setDoc } from 'firebase/firestore';
//
import { Navigate } from 'react-router';
import { FIREBASE_API } from '../config';

// ----------------------------------------------------------------------

const ADMIN_EMAILS = ['demo@minimals.cc'];

const firebaseApp = initializeApp(FIREBASE_API);

const AUTH = getAuth(firebaseApp);

const DB = getFirestore(firebaseApp);

const initialState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const reducer = (state, action) => {
  if (action.type === 'INITIALISE') {
    const { isAuthenticated, user } = action.payload;
    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  }

  return state;
};

const AuthContext = createContext({
  ...initialState,
  method: 'firebase',
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});

// ----------------------------------------------------------------------

AuthProvider.propTypes = {
  children: PropTypes.node,
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const [profile, setProfile] = useState(null);

  useEffect(
    () =>
      onAuthStateChanged(AUTH, async (user) => {
        if (user && user.emailVerified) {        
          const userRef = doc(DB, 'users', user.uid);

          const docSnap = await getDoc(userRef);

          if (docSnap.exists()) {
            setProfile(docSnap.data());
          }
          dispatch({
            type: 'INITIALISE', 
            payload: { isAuthenticated: true, user },
          });
        } else {
          dispatch({
            type: 'INITIALISE',
            payload: { isAuthenticated: false, user: null },
          });
        }
      }),
    [dispatch]
  );

  const login = (email, password) => {
    signInWithEmailAndPassword(AUTH, email, password)
      .then((userCredential) => {
        // Check if the user's email is verified
        const user = userCredential.user;
        if (user && !user.emailVerified) {
          // The user's email is not verified, sign them out
          alert('Email is not verified. Please verify your email before logging in.');
          signOut(AUTH);   
        } else {
          // The user's email is verified, you can proceed with the login
          // Your logic for successful login here
        }
      })
      .catch((error) => {
        // Handle login error and display it in an alert
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(`Login Error: ${errorCode} - ${errorMessage}`);
        signOut(AUTH);
      });
  };

  const register = async (email, password, firstName, lastName) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(AUTH, email, password);
      const user = userCredential.user;
  
      // Send email verification
      await sendEmailVerification(user);
      
      // The user's email has been verified, you can proceed to set user data and access the dashboard.
      const userRef = doc(collection(DB, 'users'), user.uid);
      setDoc(userRef, {
        uid: user.uid,
        email,
        displayName: `${firstName} ${lastName}`,
      });

      alert('Please check your email to verify your account!')
      signOut(AUTH);
    } catch (error) {
      console.error('Registration error: ', error);
      // Handle the error
    }
  };


  const logout = () => signOut(AUTH);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        method: 'firebase',
        user: {
          id: state?.user?.uid,
          email: state?.user?.email,
          photoURL: state?.user?.photoURL || profile?.photoURL,
          displayName: state?.user?.displayName || profile?.displayName,
          role: ADMIN_EMAILS.includes(state?.user?.email) ? 'admin' : 'user',
          phoneNumber: state?.user?.phoneNumber || profile?.phoneNumber || '',
          country: profile?.country || '',
          address: profile?.address || '',
          state: profile?.state || '',
          city: profile?.city || '',
          zipCode: profile?.zipCode || '',
          about: profile?.about || '',
          isPublic: profile?.isPublic || false,
        },
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
