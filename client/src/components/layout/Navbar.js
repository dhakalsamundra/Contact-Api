import React, { Fragment, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import ExitToAppIcon from '@material-ui/icons/ExitToApp'
import { Link } from 'react-router-dom'
import AuthContext from '../../context/auth/context'
import ContactContext from '../../context/contact/context'

const Navbar = ({ title }) => {
  const authContext = useContext(AuthContext)
  const contactContext = useContext(ContactContext)

  const { isAuthenticated, logout, user, loadUser } = authContext
  const { clearContacts } = contactContext

  useEffect(() => {
    loadUser()
    // eslint-disable-next-line
  }, []);

  const onLogout = () => {
    logout()
    clearContacts()
  }

  const authLinks = (
    <Fragment>
      <li>Hello {user && user.name}</li>
      <li><br></br>
        <IconButton onClick={onLogout} href='/'>
          <ExitToAppIcon id='logout'/>
        </IconButton>
      </li>
    </Fragment>
  )

  const guestLinks = (
    <Fragment>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/'>Login</Link>
      </li>
    </Fragment>
  )

  return (
    <div className='navbar bg-primary'>
      <h1>
        {title}
      </h1>
      <ul>{isAuthenticated ? authLinks : guestLinks}</ul>
    </div>
  )
}

Navbar.propTypes = {
  title: PropTypes.string.isRequired,
}

Navbar.defaultProps = {
  title: 'Contact Keeper',
}

export default Navbar