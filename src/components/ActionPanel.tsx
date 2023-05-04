import React from 'react';
import {
    IoCalendarClearOutline,
    IoCalendarClear,
    IoCalendarOutline,
    IoCalendar,
    IoBookmarksOutline,
    IoBookmarks,
    IoPersonOutline,
    IoPerson,
} from 'react-icons/io5';
import { UserContext } from '@/context/userContext';
import { user, user_favorites, appointment, tutor } from '@prisma/client';
import Link from 'next/link';
import axios from 'axios';

type Props = {};

const ActionPanel = (props: Props) => {
    const userContext = React.useContext(UserContext);
    const [firstName, setFirstName] = React.useState(null);
    const [lastName, setLastName] = React.useState(null);
    const latestAppointment = userContext.appointments?.[0];
    const [currTutor, setCurrTutor] = React.useState<tutor | null>(null);
    const [currTutorUserData, setCurrTutorUserData] =
        React.useState<user | null>(null);
    const getTutorUserData = async (tutorData: tutor) => {
        try {
            const response = await axios.get(
                `/api/user/${tutorData.fk_userID}`
            );
            if (response) {
                const resUser: user = response.data;
                setCurrTutorUserData(resUser);
            } else {
                setCurrTutorUserData(null);
            }
        } catch (err) {
            console.error(err);
            alert('There was an error getting appointments');
        }
    };
    React.useEffect(() => {
        setFirstName(userContext?.currUser?.first_name);
        setLastName(userContext?.currUser?.last_name);
        userContext.getAppointments();
        userContext.getUserFavorites();
    }, [userContext?.currUser]);
    React.useEffect(() => {
        latestAppointment && getTutor(latestAppointment?.fk_tutorID);
    }, [latestAppointment]);

    const getTutor = async (tutorId: number) => {
        try {
            const response = await axios.get(`/api/tutor/${tutorId}`);
            if (response) {
                const resTutor: tutor = response.data;
                setCurrTutor(resTutor);
                getTutorUserData(resTutor);
            } else {
                setCurrTutor(null);
            }
        } catch (err) {
            console.error(err);
            alert('There was an error getting appointments');
        }
    };

    return (
        <div className='bg-secondary w-full h-auto'>
            <div className='flex justify-center w-auto h-full'>
                <div className='grid sm:grid-flow-col grid-cols-2 align-middle'>
                    {latestAppointment && <Link
                        className='h-full m-auto mx-8 my-4 m align-top text-center font-bold space-y-1 max-w-1'
                        href='/appointments'
                    >
                        <span className='text-xs md:text-sm line-clamp-1'>
                            Next Appointment
                        </span>
                        <IoCalendarClearOutline
                            fontSize='7rem'
                            className='h-auto max-h-[75%] sm:max-h-[100%] max-w-[75%] sm:max-w-[100%] m-auto'
                        />
                        <p className='text-sm md:text-base line-clamp-1'>
                            {latestAppointment?.startDT.toLocaleDateString(
                                'en-US',
                                {
                                    weekday: 'long',
                                    month: 'long',
                                    day: 'numeric',
                                    year: 'numeric',
                                }
                            )}
                        </p>
                        <p className='text-xs md:text-sm line-clamp-1'>
                            {latestAppointment?.startDT.toLocaleTimeString(
                                'en-US',
                                {
                                    hour: 'numeric',
                                    minute: 'numeric',
                                    hour12: true,
                                }
                            )}{' '}
                            • {currTutorUserData?.first_name}{' '}
                            {currTutorUserData?.last_name}
                        </p>
                    </Link>}
                    <Link className='h-full m-auto mx-8 my-4 align-top text-center font-bold space-y-1 max-w-1'
                        href='/appointments'
                    >
                        <span className='text-xs md:text-sm line-clamp-1'>
                            My Appointments
                        </span>
                        <IoCalendarOutline
                            size='7rem'
                            className='h-auto max-h-[75%] sm:max-h-[100%] max-w-[75%] sm:max-w-[100%] m-auto'
                        />
                        <p className='text-sm md:text-base line-clamp-1'>
                            {userContext.appointments?.length || 0} Scheduled
                        </p>
                    </Link>
                    <div className='h-full m-auto mx-8 my-4 align-top text-center font-bold space-y-1 max-w-1'>
                        <span className='text-xs md:text-sm line-clamp-1'>
                            My Bookmarks
                        </span>
                        <IoBookmarksOutline
                            size='7rem'
                            className='h-auto max-h-[75%] sm:max-h-[100%] max-w-[75%] sm:max-w-[100%] m-auto'
                        />
                        <p className='text-sm md:text-base line-clamp-1'>
                            {userContext.favorites?.length || 0} Saved
                        </p>
                    </div>
                    {firstName && lastName && (
                        <div className='h-full m-auto mx-8 my-4 align-top text-center font-bold space-y-1 max-w-1'>
                            <Link href='/account'>
                                <span className='text-xs md:text-sm line-clamp-1'>
                                    My Profile
                                </span>
                                <IoPersonOutline
                                    size='7rem'
                                    className='h-auto max-h-[75%] sm:max-h-[100%] max-w-[75%] sm:max-w-[100%] m-auto'
                                />
                                <p className='text-sm md:text-base line-clamp-1'>
                                    {firstName} {lastName}
                                </p>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ActionPanel;
