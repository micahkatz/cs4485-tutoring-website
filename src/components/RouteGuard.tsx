import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { UserContext } from '@/context/userContext';

export { RouteGuard };
const isBrowser = () => typeof window !== "undefined";

function RouteGuard({ children }) {
    const router = useRouter();
    const { currUser } = React.useContext(UserContext)

    const publicPaths = ['/login', '/signup'];

    let pathIsProtected = publicPaths.indexOf(router.pathname) === -1;

    if (isBrowser() && !currUser && pathIsProtected) {
        router.push({
            pathname: '/login',
            query: { returnUrl: router.asPath }
        });
    }

    return children
}