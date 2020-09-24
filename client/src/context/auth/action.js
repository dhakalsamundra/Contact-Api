import React, { useReducer } from 'react';
import axios from 'axios';
// import { useParams } from 'react-router';


import AuthContext from './context';
import authReducer from './reducer';
import setAuthToken from '../../utils/setAuthToken';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  FORGET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_FAIL,
  NEW_PASSWORD_SUCCESS,
  NEW_PASSWORD_FAIL
} from '../types';


const AuthState = props => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    loading: true,
    user: null,
    error: null
  };

  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User
  const loadUser = async () => {
    setAuthToken(localStorage.token);

    try {
      const res = await axios.get('/api/auth');

      dispatch({
        type: USER_LOADED,
        payload: res.data
      });
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
    }
  };

  // Register User
  const register = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/users', formData, config);

      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data.msg
      });
    }
  };

  // Login User
  const login = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };

    try {
      const res = await axios.post('/api/auth', formData, config);

      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });


      loadUser();
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data.msg
      });
    }
  };
  // ForgetPassword
  const forgetPassword = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      const res = await axios.post('/api/resetPassword', formData, config);
      dispatch({
        type: FORGET_PASSWORD_SUCCESS,
        payload: res.data
      });
      loadUser();
    } catch (err){
      dispatch({
        type: FORGET_PASSWORD_FAIL,
        payload: err.response.data.msg
      })
    }
  }

  const newPassword = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    try {
      // // eslint-disable-next-line
      //    const {token} = useParams();
      // console.log('front end auth action', token)

      const res = await axios.post(`/api/resetPassword/${formData.token}`, formData, config);
      console.log('front end auth action', formData.token)
      dispatch({
        type: NEW_PASSWORD_SUCCESS,
        payload: res.data
      });
      loadUser();
    } catch (err){
      dispatch({
        type: NEW_PASSWORD_FAIL,
        payload: err.response.data.msg
      })
    }
  }
  // Logout
  const logout = () => dispatch({ type: LOGOUT });

  // Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        loadUser,
        login,
        forgetPassword,
        newPassword,
        logout,
        clearErrors
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
