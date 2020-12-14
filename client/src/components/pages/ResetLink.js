/* eslint-disable no-console */
import React, { useState, useContext, useEffect } from 'react'
import AuthContext from '../../context/auth/context'
import AlertContext from '../../context/alert/context'


export default function ResetPassword(props){
  const [email, setEmail] = useState('')
  const url = window.location.href
  console.log('this is the request url from the client side', url)

  const authContext = useContext(AuthContext)
  const alertContext = useContext(AlertContext)

  const { setAlert } = alertContext
  const { forgetPassword, error, isSuccess, clearErrors } = authContext


  useEffect(() => {
    if (isSuccess) {
      setAlert('Reset link has been sent to the provided email address.', 'success')
      props.history.push('/')
    }
    if (error === 'This email is not associated. Please check your email address.') {
      setAlert(error, 'danger')
      clearErrors()
    }

    // eslint-disable-next-line
      }, [error, isSuccess, props.history]);

  const handleEmailChange = e => {
    setEmail(e.target.value)
  }

  const handleEmailSubmit = e => {
    e.preventDefault()
    if(email === ''){
      setAlert('Please input your email address first', 'danger')
    } else {
      forgetPassword ({ email, url })
    }
  }
  return (
    <div className="form-container">
      <h3>
          Please enter the email address that is associate with  your account, and we will send you a link to reset your password.
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