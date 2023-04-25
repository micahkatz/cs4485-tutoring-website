import { NewUserType, UserWithoutPassword } from '@/types/globals';
import { user } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import bcrypt from 'bcryptjs'
import { useRouter } from 'next/router';
import { useLocalStorage } from 'usehooks-ts'

type LoginReturnType = {
    user?: user;
    error?: CustomErrorMsg
}
type UserContextType = {
    login: (email: string, password: string) => Promise<LoginReturnType>,
    signup: (newUser: NewUserType) => Promise<LoginReturnType>,
}
export const UserContext = React.createContext<UserContextType | null>(null);
type Props = {
    children: any
}
type CustomErrorMsg = {
    msg: string
}

export default (props: Props) => {
    const { children } = props

    const router = useRouter();

    const [currUser, setCurrUser] = useLocalStorage<UserWithoutPassword | null>('currUser', null)
    const [isLoggedIn, setIsLoggedIn] = useLocalStorage('isLoggedIn', false)

    const encryptPassword = async (password: string) => {
        var hash = await bcrypt.hash(password, 10);
        console.log('hashed', password, 'to', hash)

        return hash
    }

    const login = async (email: string, password: string) => {
        try {
            console.log('getting user from db')
            const resultingUser = await axios.post('/api/auth/login', {
                email,
                password
            }) as user
            setCurrUser(resultingUser)

            // window.location.replace('/')

            return { user: resultingUser }
        } catch (err) {
            const axiosErr = err as AxiosError
            console.error(err)
            if (axiosErr.response.status === 401) {
                return {
                    error: {
                        msg: 'Invalid Email or Password'
                    }
                }
            } else if (axiosErr.response.status === 404) {
                return {
                    error: {
                        msg: 'Could not find an account with that email'
                    }
                }
            } else {
                return {
                    error: {
                        msg: 'There was an error logging in'
                    }
                }
            }
        }
    }
    const signup = async (newUser: NewUserType) => {
        try {
            console.log('getting user from db')
            const resultingUser = await axios.post('/api/user', {
                ...newUser,
                password: await encryptPassword(newUser.password)
            }) as user
            setCurrUser(resultingUser)

            // window.location.replace('/')

            return { user: resultingUser }
        } catch (err) {
            const axiosErr = err as AxiosError
            console.error(err)

            return {
                error: {
                    msg: 'There was an error signing up'
                }
            }
        }
    }

    const authCheck = (url: string) => {
        // redirect to login page if accessing a private page and not logged in 
        const publicPaths = ['/login'];
        const path = url.split('?')[0];
        if (!currUser && !publicPaths.includes(path)) {
            setIsLoggedIn(false);
            router.push({
                pathname: '/login',
                query: { returnUrl: router.asPath }
            });
        } else {
            setIsLoggedIn(true);
        }
    }


    React.useEffect(() => {
        setIsLoggedIn(currUser !== null)
    }, [currUser])

    React.useEffect(() => {
        // on initial load - run auth check 
        authCheck(router.asPath);

        // on route change start - hide page content by setting authorized to false  
        const hideContent = () => setIsLoggedIn(false);
        router.events.on('routeChangeStart', hideContent);

        // on route change complete - run auth check 
        router.events.on('routeChangeComplete', authCheck)

        // unsubscribe from events in useEffect return function
        return () => {
            router.events.off('routeChangeStart', hideContent);
            router.events.off('routeChangeComplete', authCheck);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);


    const store = {
        login,
        signup,
        currUser
    };

    return (
        <UserContext.Provider value={store}>{children}</UserContext.Provider>
    );
};
