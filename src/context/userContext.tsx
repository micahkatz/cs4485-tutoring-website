import { NewUserType, UserWithoutPassword } from '@/types/globals';
import { user } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import bcrypt from 'bcryptjs'
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

    const [currUser, setCurrUser] = React.useState<UserWithoutPassword | null>(null)
    const [isLoggedIn, setIsLoggedIn] = React.useState(false)

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

    React.useEffect(() => {
        setIsLoggedIn(currUser !== null)
    }, [currUser])

    const store = {
        login,
        signup,
        currUser
    };

    return (
        <UserContext.Provider value={store}>{children}</UserContext.Provider>
    );
};
