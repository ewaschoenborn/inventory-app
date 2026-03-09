import { Outlet, useLocation, type To, Navigate } from 'react-router';
import React, { useEffect, useRef } from 'react';
import { useIsLoggedIn, useHasScope } from './utils';
import type { Scope } from '../../app/api';

const PrivateOutlet = (props: { requiredScopes?: Scope[] }) => {
    /* TODO: add proper login */
    const loggedIn = useIsLoggedIn();
    const hasRequiredScopes = useHasScope(...(props.requiredScopes ?? []));

    if (!loggedIn) {
        return <NotLoggedIn />;
    }

    if (!hasRequiredScopes) {
        return (
            <NavigateWithErrorMessage
                to="/"
                error="Sie haben nicht die erforderlichen Berechtigungen, um diese Seite zu sehen."
            />
        );
    }
    return <Outlet />;
};

const NotLoggedIn = () => {
    const location = useLocation();
    return (
        <NavigateWithErrorMessage
            to="/login"
            state={{ from: location }}
            error="Sie müssen sich einloggen, um diese Seite zu sehen."
        />
    );
};

const NavigateWithErrorMessage = (props: { to: To; state?: any; error: React.ReactNode }) => {
    const { to, state, error } = props;
    const triggeredRef = useRef(false);
    useEffect(() => {
        if (triggeredRef.current) return;
        triggeredRef.current = true;

        // we need to display the alert with a slight delay, since it's being
        // cleared by the navigation otherwise
        setTimeout(() => console.error(error), 100);
    }, [error]);
    return <Navigate to={to} state={state} />;
};

export default PrivateOutlet;
