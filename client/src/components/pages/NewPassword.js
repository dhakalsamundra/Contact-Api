import React, { useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router-dom'

import AuthContext from '../../context/auth/context';
import AlertContext from '../../context/alert/context';

export default function NewPassword(props) {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword ] = useState('')
    const { token } = useParams()

    const authContext = useContext(AuthContext)
    const alertContext = useContext(AlertContext)
    const {newPassword, error, clearErrors, isAuthenticated} = authContext
    const { setAlert } = alertContext
  
    useEffect(() => {
        if (isAuthenticated) {
          props.history.push('/');
        }
        if (error === 'Invalid Credentials') {
            setAlert(error, 'danger');
            clearErrors();
          }
    // eslint-disable-next-line
      }, [error, isAuthenticated, props.history]);

    const handleChangePassword = (e) => {
      setPassword(e.target.value)
    }
    const handleChangeConfirmPassword = (e) => {
      setConfirmPassword(e.target.value)
    }
  
    const handleSubmit = async(e) => {
    e.preventDefault()
    if (password !== confirmPassword){
      setAlert('password is not matching', 'danger')
    } else {
      newPassword({password, token})
    }
    }
  return (
        <div className="form-container">
          <form onSubmit={handleSubmit}>
            <label>Password:</label>
            <input className="cPassword" type="password" value={password} onChange={handleChangePassword} />
            <br></br>
  
            <label>Confirm Password:</label>
            <input type="password" value={confirmPassword} onChange={handleChangeConfirmPassword} />
            <br></br>
            <input
            className="btn btn-primary btn-block"
            value="submit"
            type="submit"
            />
          </form>
        </div>
  
      )
  }
  