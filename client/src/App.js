import React, { Fragment } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import ResetLink from './components/pages/ResetLink';
import ResetPassword from './components/pages/NewPassword';
import Register from './components/auth/Register';
import Login from './components/auth/LogIn';
import Alerts from './components/layout/Alerts';
import PrivateRoute from './components/route/PrivateRoute';

import ContactState from './context/contact/action';
import AuthState from './context/auth/action';
import AlertState from './context/alert/action';
import './App.css';

const App = () => {
  return (
    <AuthState>
      <ContactState>
        <AlertState>
          <Router>
            <Fragment>
              <Navbar />
              <div className='container'>
                <Alerts />
                <Switch>
                  <PrivateRoute exact path='/dashboard' component={Home} />
                  <Route exact path='/register' component={Register} />
                  <Route exact path='/' component={Login} />
                  <Route exact path="/forgetPassword" component={ResetLink} />
                  <Route exact path="/updatePassword/:token" component={ResetPassword} />
                </Switch>
              </div>
            </Fragment>
          </Router>
        </AlertState>
      </ContactState>
    </AuthState>
  );
};

export default App;
