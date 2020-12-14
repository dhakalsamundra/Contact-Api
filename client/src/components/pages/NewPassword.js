import React, { useState, useContext, useEffect } from 'react'
import { useParams } from 'react-router'

import AuthContext from '../../context/auth/context'
import AlertContext from '../../context/alert/context'

export default function NewPassword(props) {
  const alertContext = useContext(AlertContext)
  const authContext = useContext(AuthContext)

  const { setAlert } = alertContext
  const { newPassword, error,isSuccess, clearErrors } = authContext
  const { token } = useParams()


  useEffect(() => {
    if (error === 'Internal Server Error') {
      setAlert(error, 'danger')
      clearErrors()
    }
    if (isSuccess) {
      setAlert('LogIn with new password', 'success')
      props.history.push('/')
    }
    // eslint-disable-next-line
      }, [error,isSuccess, props.history]);

  const [user, setUser] = useState({
    password: '',
    password2: ''
  })

  const { password, password2 } = user

  const onChange = e => setUser({ ...user, [e.target.name]: e.target.value })


  const onSubmit = e => {
    e.preventDefault()
    if (password === '') {
      setAlert('Field is mandatory', 'danger')
    } else if (password !== password2) {
      setAlert('Passwords do not match', 'danger')
    } else {
      newPassword({
        password, token
      })
    }
  }
  return (
    <div className='form-container'>
      <h1>
      Account <span className='text-primary'>Enter New Password</span>
      </h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor='password'>Password</label>
          <input
            id='password'
            type='password'
            name='password'
            value={password}
            onChange={onChange}
            required
            minLength='6'
          />
        </div>
        <div className='form-group'>
          <label htmlFor='password2'>Confirm Password</label>
          <input
            id='password2'
            type='password'
            name='password2'
            value={password2}
            onChange={onChange}
            required
            minLength='6'
          />
        </div>
        <input
          type='submit'
          value='submit'
          className='btn btn-primary btn-block'
        />
      </form>
    </div>

  )
}
