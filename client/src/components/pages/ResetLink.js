import React, { useState, useContext, useEffect } from 'react'
import AuthContext from '../../context/auth/context';
import AlertContext from '../../context/alert/context';


export default function ResetPassword(props){
    const [email, setEmail] = useState('')

    const authContext = useContext(AuthContext)
    const alertContext = useContext(AlertContext);

    const { setAlert } = alertContext;
    const {forgetPassword, error, clearErrors,isAuthenticated} = authContext


    useEffect(() => {
      if (error === 'User already exists') {
        setAlert(error, 'danger');
        clearErrors();
      }
      // eslint-disable-next-line
      },  [error, isAuthenticated, props.history])

    const handleEmailChange = e => {
        setEmail(e.target.value)
    }

    const handleEmailSubmit = e => {
        e.preventDefault()
        if(email === ''){
            setAlert('Please input your email address first', 'danger')
            clearErrors();
        }
        forgetPassword ({email})
        props.history.push('/login')
    }
    return (
      <div className="form-container">
        <h3>
          Please enter the email address that is associate with  your account, and
          we'll send you a link to reset your password.
        </h3>
        <form onSubmit={handleEmailSubmit}>
          <input
            name="email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
          /><br></br>
          <input
            className="btn btn-primary btn-block"
            value="submit"
            type="submit"
          />
        </form>
      </div>
    )
}