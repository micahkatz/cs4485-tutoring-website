import { NewUserType, UserWithoutPassword } from '@/types/globals';
import { availability, user } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import bcrypt from 'bcryptjs'
import { useRouter } from 'next/router';
import { useLocalStorage } from 'usehooks-ts'

type TutorContextType = {
    getAvailabilityForTutor: (tutorId: string) => Promise<availability[] | null>
}
export const TutorContext = React.createContext<TutorContextType | null>(null);
type Props = {
    children: any
}
export default (props: Props) => {
    const { children } = props

    const getAvailabilityForTutor = async (tutorId: string) => {
        try {
            const response = await axios.get('/api/appointment', {
                data: {
                    tutorId
                }
            })

            const availability = response.data as availability[]

            return availability
        } catch (err) {
            console.error(err)
            return null
        }

    }


    const store = {
        getAvailabilityForTutor
    };

    return (
        <TutorContext.Provider value={store}>{children}</TutorContext.Provider>
    );
};
