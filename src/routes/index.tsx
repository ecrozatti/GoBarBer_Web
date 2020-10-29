import React from 'react';
import { Switch /*, Route*/ } from 'react-router-dom';
// Switch - garante que apenas 1 rota seja exibida
// Route - sao as rotas da aplicacao

import Route from './Route';

import SignIn from '../pages/Signin';
import SignUp from '../pages/Signup';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import Dashboard from '../pages/Dashboard';
import Profile from '../pages/Profile';

const Routes: React.FC = () => (
    <Switch>
        <Route path="/" exact component={SignIn} />
        <Route path="/signup" component={SignUp} />
        <Route path="/forgot-password" component={ForgotPassword} />
        <Route path="/reset-password" component={ResetPassword} />

        <Route path="/dashboard" component={Dashboard} isPrivate />
        <Route path="/profile" component={Profile} isPrivate />
    </Switch>
);

export default Routes;