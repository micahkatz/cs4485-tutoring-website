import React from 'react';
import { IoBookmarkOutline, IoBookmark } from 'react-icons/io5';
import CommonTag from './tag/CommonTag';
import Link from 'next/link';
import { appointment, availability, tutor, user } from '@prisma/client';
import axios from 'axios';

type Props = {
    isNewAppointment?: boolean;
    className?: string;
    startDT: availability['startDT'];
    endDT: availability['endDT'];
    onClick?: () => void;
    tutorId?: number;
};

const AppointmentCard = (props: Props) => {
    const [currTutor, setCurrTutor] = React.useState<tutor | null>(null);
    const [currTutorUserData, setCurrTutorUserData] = React.useState<user | null>(null);
    const getTutor = async () => {
        try {
            const response = await axios.get(`/api/tutor/${props.tutorId}`)
            if (response) {

                const resTutor: tutor = response.data
                setCurrTutor(resTutor)
                getTutorUserData(resTutor)
            } else {
                setCurrTutor(null)
            }
        } catch (err) {
            console.error(err)
            alert('There was an error getting appointments')
        }
    }
    const getTutorUserData = async (tutorData: tutor) => {
        try {
            const response = await axios.get(`/api/user/${tutorData.fk_userID}`)
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
        !props.isNewAppointment && getTutor()
    }, [])
    return (
        <button
            className={
                'h-auto border-secondary border-2 rounded-md mt-6 mb-4 hover:scale-105 hover:cursor-pointer transition-all ' +
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
                        src={currTutor?.profile_picture ? currTutor?.profile_picture : ''}
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
                {!props?.isNewAppointment && (
                    <div className='w-auto justify-items-end'>
                        <CommonTag name='Math' />
                    </div>
                )}
            </div>
        </button>
    );
};

export default AppointmentCard;
