import { availability } from '@prisma/client';
import Head from 'next/head';
import React, { useEffect } from 'react';
import NavBar from '../components/NavBar';

import { TutorContext } from '@/context/tutorContext';
import { UserContext } from '@/context/userContext';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import 'react-datetime-picker/dist/DateTimePicker.css';
// import Calendar from 'reactjs-availability-calendar'
import { LocalizationProvider, TimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import dayjs, { type Dayjs } from 'dayjs';
import { FiPlus } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';
import {
    AvailabilityWithStrings,
    NewAvailabilityType,
    NewAvailabilityWithStrings,
} from '@/types/globals';
const { DateTime } = require('luxon');

type Props = {};

interface DayjsAvailabilityOptionalId
    extends Omit<availability, 'startDT' | 'endDT' | 'availID'> {
    startDT: Dayjs;
    endDT: Dayjs;
    availID?: number;
}
interface DayjsAvailability extends Omit<availability, 'startDT' | 'endDT'> {
    startDT: Dayjs;
    endDT: Dayjs;
}
interface NewDayjsAvailability
    extends Omit<availability, 'startDT' | 'endDT' | 'availID'> {
    startDT: Dayjs;
    endDT: Dayjs;
}

const AvailabilityPage = (props) => {
    const tutorContext = React.useContext(TutorContext);
    const userContext = React.useContext(UserContext);
    const tutorId = userContext?.currUser?.userID;
    const [availability, setAvailability] = React.useState<
        DayjsAvailability[] | null
    >([]);
    const [availabilityToBeRemoved, setAvailabilityToBeRemoved] =
        React.useState<number[] | null>([]);
    const [newAvailIndex, setNewAvailIndex] = React.useState(-1)
    const getFilteredAvailability = React.useCallback(
        (dayVal: number) => {
            const alreadyStoredAvailability =
                availability?.filter(
                    (item) => item.startDT.toDate().getDay() === dayVal
                ) || [];
            return [...alreadyStoredAvailability];
        },
        [availability]
    );

    const getAvailability = async (tutorId: number) => {
        if (tutorId) {
            const response = await tutorContext.getAvailabilityForTutor(
                tutorId
            );
            if (response) {
                const filtered = response.map((item) => {
                    return {
                        ...item,
                        startDT: dayjs(new Date(item.startDT)),
                        endDT: dayjs(new Date(item.endDT)),
                    };
                });
                setAvailability(filtered);
            } else {
                setAvailability(null);
            }
        }
    };

    const daysOfWeek = [
        {
            text: 'SUNDAY',
            val: 0,
        },
        {
            text: 'MONDAY',
            val: 1,
        },
        {
            text: 'TUESDAY',
            val: 2,
        },
        {
            text: 'WEDNESDAY',
            val: 3,
        },
        {
            text: 'THURSDAY',
            val: 4,
        },
        {
            text: 'FRIDAY',
            val: 5,
        },
        {
            text: 'SATURDAY',
            val: 6,
        },
    ];

    const addAvailabilityInput = (dayVal: number) => {
        setAvailability((prevAvailability) => {
            const currTime: luxon.DateTime = DateTime.now();
            const startDT: luxon.DateTime = currTime.set({ weekday: dayVal });
            const endDT: luxon.DateTime = currTime.set({ weekday: dayVal });
            const newAvailability: DayjsAvailability[] = [
                ...prevAvailability,
                {
                    availID: newAvailIndex,
                    fk_tutorID: tutorId,
                    startDT: dayjs(startDT.toJSDate()),
                    endDT: dayjs(endDT.toJSDate()),
                    repeatWeekly: true,
                },
            ];
            return newAvailability;
        });
        setNewAvailIndex(prev => prev - 1)
    };
    const removeAvailabilityInput = (id: number) => {
        setAvailability((prevAvailability) => {
            return prevAvailability?.filter(
                (prev) => prev.availID !== id
            );
        });
        id !== undefined &&
            setAvailabilityToBeRemoved((prev: number[]) => [
                ...prev,
                id,
            ]);
    };

    const createAvailability = (newData: NewAvailabilityWithStrings) =>
        axios.post('/api/availability', newData);
    const updateAvailability = (newData: AvailabilityWithStrings) =>
        axios.put('/api/availability', newData);
    const deleteAvailability = (id: string | number) =>
        axios.delete(`/api/availability/${id}`);

    const onSubmit = async () => {
        // add all new availability
        try {
            // delete all availability
            for (let id of availabilityToBeRemoved) {
                if (id > 0) {
                    await deleteAvailability(id);
                    console.log(`deleted availability with id=${id}`);
                }
            }
            setAvailabilityToBeRemoved([]);
            for (let item of availability) {
                if (item.availID < 0) {
                    const { availID, ...withoutId } = item
                    await createAvailability({
                        ...withoutId,
                        startDT: item.startDT.toDate().toISOString(),
                        endDT: item.endDT.toDate().toISOString(),
                    });
                    console.log('created availability', item);
                } else {
                    await updateAvailability({
                        ...item,
                        startDT: item.startDT.toDate().toISOString(),
                        endDT: item.endDT.toDate().toISOString(),
                    });
                    console.log('updated availability', item);
                }
            }
            alert('Updated Availability')
            getAvailability(tutorId)
        } catch (error) {
            console.error('there was an error updating availability', error);
        }
    };

    useEffect(() => {
        if(userContext?.currUser)
            getAvailability(tutorId);
        else
            location.href = '/login'
    }, [tutorId]);

    return (
        <>
            <Head>
                <title>My Availability</title>
                <meta
                    name='description'
                    content='Generated by create next app'
                />
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1'
                />
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <main>
                <NavBar />
                <div className='p-8 flex flex-col'>
                    <h1 className='text-lg font-bold mb-8'>
                        My Weekly Availability
                    </h1>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <div className='divide-y'>
                            {daysOfWeek.map(
                                ({ text: dayText, val: dayVal }) => (
                                    <div className='flex gap-2 py-4 items-center'>
                                        <span className='font-semibold mr-4 w-32'>
                                            {dayText}
                                        </span>
                                        <div>
                                            {getFilteredAvailability(
                                                dayVal
                                            ).map((item, index) => (
                                                <div className='flex items-center gap-2 mb-4'>
                                                    <TimePicker
                                                        label='Start'
                                                        value={item.startDT}
                                                        onChange={(val) =>
                                                            setAvailability(
                                                                (prev) => {
                                                                    var newAvail =
                                                                        [
                                                                            ...prev,
                                                                        ];
                                                                    const idx =
                                                                        newAvail.findIndex(
                                                                            (
                                                                                innerAvail
                                                                            ) =>
                                                                                innerAvail.availID ===
                                                                                item.availID
                                                                        );
                                                                    newAvail[
                                                                        idx
                                                                    ].startDT =
                                                                        val;
                                                                    return newAvail;
                                                                }
                                                            )
                                                        }
                                                    />
                                                    <span>-</span>
                                                    <TimePicker
                                                        label='End'
                                                        value={item.endDT}
                                                        onChange={(val) =>
                                                            setAvailability(
                                                                (prev) => {
                                                                    var newAvail =
                                                                        [
                                                                            ...prev,
                                                                        ];
                                                                    const idx =
                                                                        newAvail.findIndex(
                                                                            (
                                                                                innerAvail
                                                                            ) =>
                                                                                innerAvail.availID ===
                                                                                item.availID
                                                                        );
                                                                    newAvail[
                                                                        idx
                                                                    ].endDT =
                                                                        val;
                                                                    return newAvail;
                                                                }
                                                            )
                                                        }
                                                    />
                                                    <button
                                                        className='ml-4 flex items-center justify-center'
                                                        onClick={() =>
                                                            removeAvailabilityInput(
                                                                item.availID
                                                            )
                                                        }
                                                    >
                                                        <RiDeleteBin6Line />
                                                    </button>
                                                    {index === 0 && (
                                                        <button
                                                            className={`ml-4 flex items-center justify-center`}
                                                            onClick={() =>
                                                                addAvailabilityInput(
                                                                    dayVal
                                                                )
                                                            }
                                                        >
                                                            <FiPlus />
                                                        </button>
                                                    )}
                                                </div>
                                            ))}
                                            {getFilteredAvailability(dayVal)
                                                .length <= 0 && (
                                                    <div className='flex items-center gap-2'>
                                                        <span>No times set</span>
                                                        <button
                                                            className={`ml-4 flex items-center justify-center`}
                                                            onClick={() =>
                                                                addAvailabilityInput(
                                                                    dayVal
                                                                )
                                                            }
                                                        >
                                                            <FiPlus />
                                                        </button>
                                                    </div>
                                                )}
                                        </div>
                                    </div>
                                )
                            )}

                            <button
                                className='bg-primary w-fit px-4 py-1 mt-4 rounded-lg text-inverted'
                                onClick={onSubmit}
                            >
                                Submit
                            </button>
                        </div>
                    </LocalizationProvider>
                </div>
            </main>
        </>
    );
};

export default AvailabilityPage;
