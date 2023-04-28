import { NewUserType, UserWithoutPassword } from '@/types/globals';
import { availability, user } from '@prisma/client';
import axios, { AxiosError } from 'axios';
import React, { useState } from 'react';
import bcrypt from 'bcryptjs'
import { useRouter } from 'next/router';
import { useLocalStorage } from 'usehooks-ts'

type TutorContextType = {
    getAvailabilityForTutor: (tutorId: number) => Promise<availability[] | null>
}
export const TutorContext = React.createContext<TutorContextType | null>(null);
type Props = {
    children: any
}
export default (props: Props) => {
    const { children } = props

    const getAvailabilityForTutor = async (tutorId: number) => {
        try {
            const response = await axios.get(`/api/availability/${tutorId}`)

            const availability = response.data as availability[]
            // const availability: availability[] = [
            //     {
            //         availID: 1,
            //         startDT: new Date('2023-04-25T00:00:00.000Z'),
            //         endDT: new Date('2023-04-25T01:00:00.000Z'),
            //         repeatWeekly: true,
            //         fk_tutorID: tutorId
            //     }
            // ]

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
