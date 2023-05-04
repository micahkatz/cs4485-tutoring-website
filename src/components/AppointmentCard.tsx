import { UserContext } from '@/context/userContext';
import { availability, tutor, user } from '@prisma/client';
import axios from 'axios';
import React from 'react';

type Props = {
    isNewAppointment?: boolean;
    className?: string;
    startDT: availability['startDT'];
    endDT: availability['endDT'];
    onClick?: () => void;
    tutorId?: number;
    apptId?: number;
    userId?: number;
};

const AppointmentCard = (props: Props) => {
    const userContext = React.useContext(UserContext);
    const [currTutor, setCurrTutor] = React.useState<tutor | null>(null);
    const [currTutorUserData, setCurrTutorUserData] = React.useState<user | null>(null);
    const getTutor = async (userId: number) => {
        try {
            const response = await axios.get(`/api/tutor/${userId}`)
            if (response) {

                const resTutor: tutor = response.data
                setCurrTutor(resTutor)
            } else {
                setCurrTutor(null)
            }
        } catch (err) {
            console.error(err)
        }
    }
    const getUserData = async (userId: number) => {
        try {
            const response = await axios.get(`/api/user/${userId}`)
            if (response) {

                const resUser: user = response.data
                setCurrTutorUserData(resUser)
            } else {
                setCurrTutorUserData(null)
            }
        } catch (err) {
            console.error(err)
            alert('There was an error getting appointments')
        }
    }
    React.useEffect(() => {
        if (!props.isNewAppointment) {
            if (userContext?.currUser?.userID === props.tutorId) { // the appointment is with the current user
                getUserData(props?.userId)
                getTutor(props?.userId)
            } else {
                getUserData(props?.tutorId)
                getTutor(props?.tutorId)
            }
        }
    }, [])
    return (
        <button
            className={
                `${props.isNewAppointment ? 'm-4' : 'mt-6 mb-4'} h-auto border-secondary border-2 rounded-md hover:scale-105 hover:cursor-pointer transition-all ` +
                (props.className || '')
            }
            onClick={() => {
                if (props?.isNewAppointment) {
                    props.onClick()
                }
            }}
        >
            <div className='flex m-2'>
                {!props?.isNewAppointment && (
                    <img
                        src={(currTutor?.profile_picture) ? currTutor?.profile_picture : ''}
                        alt='Image Not Found'
                        className='w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-cover aspect-square mr-2 border-primary border-2 rounded-md'
                        onError={({ currentTarget }) => {
                            // Replace with empty profile picture if src image dne
                            currentTarget.onerror = null
                            currentTarget.src = '/emptyprofile.svg'
                        }} />
                )}
                <div className='flex flex-col w-full'>
                    {!props?.isNewAppointment && (
                        <span className='text-sm sm:text-base md:text-xl font-bold truncate max-w-[90%]'>
                            Appointment with {currTutorUserData?.first_name} {currTutorUserData?.last_name}
                        </span>
                    )}
                    <span className='text-xs sm:text-sm md:text-base'>
                        {props.startDT.toLocaleDateString('en-US', {
                            weekday: 'long',
                            month: 'long',
                            day: 'numeric',
                            year: 'numeric',
                        })}
                    </span>
                    <span className='text-xs sm:text-sm md:text-base'>
                        {props.startDT.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                        })}{' '}
                        -{' '}
                        {props.endDT.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                        })}
                    </span>
                </div>
            </div>
        </button>
    );
};

export default AppointmentCard;
