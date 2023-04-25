import { UserWithoutPassword } from '@/types/globals';
import { user } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
type LoginReturnType = {
    user?: user;
    error?: CustomErrorMsg
}
type UserContextType = {
    login: (email: string, password: string) => Promise<LoginReturnType>
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

    const [currUser, setCurrUser] = React.useState<UserWithoutPassword | null>(null)
    const [isLoggedIn, setIsLoggedIn] = React.useState(false)

    const login = async (email: string, password: string) => {
        try {
            console.log('getting user from db')
            const resultingUser = await axios.post('/api/auth/login', {
                data: {
                    email,
                    password
                }
            }) as user
            setCurrUser(resultingUser)

            window.location.replace('/')

            return { user: resultingUser }
        } catch (err) {
            const axiosErr = err as AxiosError
            console.error(err)
            if (axiosErr.status === 404) {
                return {
                    error: {
                        msg: 'Invalid Username or Password'
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

    React.useEffect(() => {
        setIsLoggedIn(currUser !== null)
    }, [currUser])

    const store = {
        login,
        currUser
    };

    return (
        <UserContext.Provider value={store}>{children}</UserContext.Provider>
    );
};
