import { AppointmentWithStrings, NewUserType, UserWithoutPassword } from '@/types/globals';
import { appointment, user, user_favorites } from '@prisma/client';
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
    logout: () => void,
    currUser: UserWithoutPassword | null,
    setCurrUser: React.Dispatch<React.SetStateAction<UserWithoutPassword | null>>,
    isLoggedIn: boolean,
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>,
    isTutor: boolean,
    checkIsTutor: () => Promise<void>
    getAppointments: () => Promise<void>
    appointments: appointment[]
    favorites: user_favorites[]
    getUserFavorites: () => Promise<void>
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
    const [isLoggedIn, setIsLoggedIn] = useLocalStorage<boolean>('isLoggedIn', false)
    const [isTutor, setIsTutor] = useLocalStorage<boolean>('isTutor', false)
    const [appointments, setAppointments] = React.useState<appointment[]>([])
    const [favorites, setFavorites] = React.useState<user_favorites[]>([])

    const getUserFavorites = async () => {
        try {
            const response = await axios.get(`/api/user/favorites/${currUser.userID}`)
            if (response) {

                const userFavorites: user_favorites[] = response.data
                setFavorites(userFavorites)
            } else {
                setFavorites([])
            }
        } catch (err) {
            console.error(err)
            alert('There was an error getting favorites')
        }
    }

    const getAppointments = async () => {
        try {
            const response = await axios.get('/api/appointment', {
                params: {
                    userId: currUser?.userID
                }
            })
            if (response) {

                const newAppointments: AppointmentWithStrings[] = response.data
                const filtered = newAppointments.map((item) => {
                    return {
                        ...item,
                        startDT: new Date(item.startDT),
                        endDT: new Date(item.endDT),
                    };
                });
                setAppointments(filtered)
            } else {
                setAppointments([])
            }
        } catch (err) {
            console.error(err)
            alert('There was an error getting appointments')
        }
    }

    const encryptPassword = async (password: string) => {
        var hash = await bcrypt.hash(password, 10);
        console.log('hashed', password, 'to', hash)

        return hash
    }

    const checkIsTutor = async () => {
        if (currUser) {
            // Check if user is a tutor
            const id = currUser.userID
            try {
                const resp = await axios.get(`/api/tutor/${id}`)

                setIsTutor(true)
                console.log("user is a tutor")
            } catch (error) {
                setIsTutor(false)
                console.log("user is not a tutor", error)
            }
        }
    }

    const login = async (email: string, password: string) => {
        try {
            console.log('getting user from db')
            const response = await axios.post('/api/auth/login', {
                email,
                password
            })
            const resultingUser = response.data as user
            setCurrUser(resultingUser)
            setIsLoggedIn(true)

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
            const response = await axios.post('/api/user', {
                ...newUser,
                password: await encryptPassword(newUser.password)
            })

            const resultingUser = response.data as user
            setCurrUser(resultingUser)
            setIsLoggedIn(true)

            setCurrUser(resultingUser)
            setIsLoggedIn(true)

            return { user: resultingUser }
        } catch (err) {
            const axiosErr = err as AxiosError
            console.error(err)

            if (axiosErr.response.status === 409) {
                return {
                    error: {
                        msg: 'An account already exists with that email address'
                    }
                }
            }

            return {
                error: {
                    msg: 'There was an error signing up'
                }
            }
        }
    }

    const logout = () => {
        setCurrUser(null)
        setIsLoggedIn(false)

        router.push('/login')
    }

    const store = {
        login,
        signup,
        setCurrUser,
        currUser,
        logout,
        setIsLoggedIn,
        isLoggedIn,
        isTutor,
        checkIsTutor,
        appointments,
        getAppointments,
        getUserFavorites,
        favorites
    };

    return (
        <UserContext.Provider value={store}>{children}</UserContext.Provider>
    );
};
