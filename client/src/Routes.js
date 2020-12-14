import React from 'react'
import Home from './components/pages/Home'
import ResetLink from './components/pages/ResetLink'
import ResetPassword from './components/pages/NewPassword'
import Register from './components/auth/Register'
import Login from './components/auth/LogIn'
import PrivateRoute from './components/route/PrivateRoute'
import { Route, Switch } from 'react-router-dom'

const Routes = () => (
  <Switch>
    <PrivateRoute exact path="/dashboard" component={Home} />
    <Route exact path="/register" component={Register} />
    <Route exact path="/" component={Login} />
    <Route exact path="/forgetPassword" component={ResetLink} />
    <Route exact path="/forgetPassword/:token" component={ResetPassword} />
  </Switch>
)


export default Routes
