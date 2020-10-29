import React from 'react';
import { RouteProps as ReactDOMRouteProps, Route as ReactDOMRoute, Redirect } from 'react-router-dom';

import { useAuth } from '../hooks/auth';

interface RouteProps extends ReactDOMRouteProps {
    isPrivate?: boolean;
    // para receber um componente no formato {Dashboard} e não <Dashboard />
    component: React.ComponentType;
}

// As rotas podem ser privadas e/ou o usuário estar autenticado. Segue condições:
// isPrivete/isSigned(!!user)
// true/true    -> ok (sem redirecionamento)
// true/false   -> redirecionar para login
// false/true   -> redirecionar para dashboard
// false/false  -> ok (sem redirecionamento)

const Route: React.FC<RouteProps> = ({ isPrivate = false, component: Component, ...rest }) => {
    const { user } = useAuth();

    return (
        <ReactDOMRoute 
            {...rest} 
            // location -> usado para nao perder o histórico de navegação
            render={({ location }) => {
                // se true/true ou false/fase, senão redireciona
                return isPrivate === !!user ? (
                    <Component />
                ) : (
                    <Redirect to={{ 
                        pathname: isPrivate ? '/' : '/dashboard',
                        // state -> para não perder o histórico
                        state: { from: location }
                    }} />
                )
            }} 
        />
    );
};

export default Route;