import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,FORGET_PASSWORD_SUCCESS, FORGET_PASSWORD_FAIL,
  NEW_PASSWORD_SUCCESS, NEW_PASSWORD_FAIL
} from '../types'

export default (state, action) => {
  switch (action.type) {
  case USER_LOADED:
    return {
      ...state,
      isAuthenticated: true,
      loading: false,
      user: action.payload
    }
  case REGISTER_SUCCESS:
  case LOGIN_SUCCESS:
    localStorage.setItem('token', action.payload.token)
    return {
      ...state,
      ...action.payload,
      isAuthenticated: true,
      loading: false,
    }
  case FORGET_PASSWORD_SUCCESS:
    return{
      ...state,
      ...action.payload,
      isSuccess: true
    }
  case NEW_PASSWORD_SUCCESS:
    return{
      ...state,
      ...action.payload,
      isSuccess: true
    }
  case FORGET_PASSWORD_FAIL:
    return{
      ...state,
      error: action.payload
    }
  case NEW_PASSWORD_FAIL:
    return{
      ...state,
      error: action.payload
    }
  case REGISTER_FAIL:
  case AUTH_ERROR:
  case LOGIN_FAIL:
  case LOGOUT:
    localStorage.removeItem('token')
    return {
      ...state,
      token: null,
      isAuthenticated: false,
      loading: false,
      user: null,
      error: action.payload
    }
  case CLEAR_ERRORS:
    return {
      ...state,
      error: null
    }
  default:
    return state
  }
}
