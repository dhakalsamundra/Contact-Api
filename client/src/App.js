import React, { Fragment } from 'react'
import Navbar from './components/layout/Navbar'
import Alerts from './components/layout/Alerts'
import ContactState from './context/contact/action'
import AuthState from './context/auth/action'
import AlertState from './context/alert/action'
import Routes from './Routes'
import './App.css'

const App = () => {
  return (
    <AuthState>
      <ContactState>
        <AlertState>
          <Fragment>
            <Navbar />
            <div className='container'>
              <Alerts />
              <Routes />
            </div>
          </Fragment>
        </AlertState>
      </ContactState>
    </AuthState>
  )
}

export default App
