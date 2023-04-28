import { availability, subject, tutor, tutors_subjects, user } from '@prisma/client'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import NavBar from '../components/NavBar'

import { TutorContext } from '@/context/tutorContext'
import { UserContext } from '@/context/userContext'
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'
import 'react-datetime-picker/dist/DateTimePicker.css'
import { LooseValue } from 'react-datetime-picker/dist/cjs/shared/types'
// import Calendar from 'reactjs-availability-calendar'
import { DatePicker, LocalizationProvider, TimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { FiPlus } from 'react-icons/fi'
import { RiDeleteBin6Line } from 'react-icons/ri'
const { DateTime } = require("luxon");
import { NewAvailabilityType } from '@/types/globals'

type Props = {}

type TutorWithSubjects = tutor & {
    subjects: tutors_subjects[];
};

const AvailabilityPage = (props) => {
    const [tutorData, setTutorData] = React.useState<tutor>()
    const [tutorUserData, setTutorUserData] = React.useState<user>()
    const [tutorSubjectData, setTutorSubjectData] = React.useState<subject[]>()
    const [isLoading, setLoading] = React.useState(true)
    const router = useRouter()
    const tutorContext = React.useContext(TutorContext)
    const userContext = React.useContext(UserContext)
    const tutorId = userContext?.currUser?.userID
    const [chosenDateTime, setChosenDateTime] = React.useState<LooseValue | undefined>(new Date());
    const [availability, setAvailability] = React.useState<availability[] | null>([])
    const [newAvailability, setNewAvailability] = React.useState<NewAvailabilityType[] | null>([])
    const getFilteredAvailability = React.useCallback((dayVal: number) => {
        const alreadyStoredAvailability = availability.filter(item => new Date(item.startDT).getDay() === dayVal)
        const notStoredAvailability = newAvailability.filter(item => new Date(item.startDT).getDay() === dayVal)
        return [...alreadyStoredAvailability, ...notStoredAvailability]
    }, [availability, newAvailability])

    const fetchTutorData = async () => {
        await fetch('../../api/tutor/' + tutorId, { method: 'GET' })
            .then((resp) => resp.json())
            .then((json) => {
                let result = json as TutorWithSubjects

                // Fetch user data
                fetchTutorUserData(result)

                // Update data state
                setTutorData(result)
            })
    }

    const fetchTutorUserData = async (tut: tutor) => {
        // Get tutor's user data
        await fetch('../../api/user/' + tut.fk_userID, { method: 'GET' })
            .then((resp) => resp.json())
            .then((json) => {
                // read json as user, return it
                let result = json as user

                // Update user data state
                setTutorUserData(result)
            })
            .catch((error) => {
                return
            })
    }

    const getAvailability = async (tutorId: number) => {
        if (tutorId) {
            const response = await tutorContext.getAvailabilityForTutor(tutorId)
            setAvailability(response)
        }
    }

    const getDayOfWeek = (dayOfWeek: number) => {
        switch (dayOfWeek) {
            case 0:
                return 'MONDAY'
            case 1:
                return 'TUESDAY'
            case 2:
                return 'WEDNESDAY'
            case 3:
                return 'THURSDAY'
            case 4:
                return 'FRIDAY'
            case 5:
                return 'SATURDAY'
            case 6:
                return 'SUNDAY'
        }
    }

    const daysOfWeek = [
        {
            text: 'SUNDAY',
            val: 0,
        },
        {
            text: 'MONDAY',
            val: 1
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
    ]

    const addAvailabilityInput = (dayVal: number) => {
        setNewAvailability(prevAvailability => {

            DateTime.now().day(dayVal)
            const startDT = DateTime.now().day(dayVal)
            const endDT = DateTime.now().day(dayVal)
            const newAvailability: NewAvailabilityType[] = [...prevAvailability, {
                fk_tutorID: tutorId,
                startDT: startDT.toDate(),
                endDT: endDT.toDate(),
                repeatWeekly: true
            }]
            return newAvailability
        })
    }
    const removeAvailabilityInput = (item: NewAvailabilityType) => {
        setNewAvailability(prevAvailability => {
            return prevAvailability.filter(prev => prev.startDT !== item.startDT)
        })
        setAvailability(prevAvailability => {
            return prevAvailability.filter(prev => prev.startDT !== item.startDT)
        })
    }

    useEffect(() => {
        getAvailability(tutorId)
    }, [tutorId])
    useEffect(() => {
        if (tutorId)
            fetchTutorData()
    }, [tutorId])

    if (tutorData == undefined || tutorUserData == undefined) {
        return <><h1>"Error Loading Page.</h1></>
    }
    else {
        return (
            <>
                <Head>
                    <title>My Availability</title>
                    <meta name="description" content="Generated by create next app" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main>
                    <NavBar />
                    <div className='p-8 flex flex-col'>
                        <h1 className='text-lg font-bold mb-8'>My Weekly Availability</h1>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            {/* {
                                availability && availability.map((item, index) => (
                                    <div className='flex items-center gap-2'>
                                        <span className='font-semibold mr-2'>{getDayOfWeek(new Date(item?.startDT).getDay())}</span>
                                        <TimePicker label="Start" />
                                        <span>-</span>
                                        <TimePicker label="End" />
                                    </div>
                                ))
                            } */}
                            <div className='divide-y'>
                                {daysOfWeek.map(({ text: dayText, val: dayVal }) => (
                                    <div className='flex gap-2 py-4 items-center'>
                                        <span className='font-semibold mr-4 w-32'>{dayText}</span>
                                        <div>
                                            {
                                                getFilteredAvailability(dayVal).map((item, index) => (
                                                    <div className='flex items-center gap-2 mb-4'>
                                                        <TimePicker label="Start" value={item.startDT} />
                                                        <span>-</span>
                                                        <TimePicker label="End" value={item.endDT} />
                                                        <button
                                                            className='ml-4 flex items-center justify-center'
                                                            onClick={() => removeAvailabilityInput(item)}
                                                        >
                                                            <RiDeleteBin6Line />
                                                        </button>
                                                        {index === 0 &&
                                                            <button
                                                                className={`ml-4 flex items-center justify-center`}
                                                                onClick={() => addAvailabilityInput(dayVal)}
                                                            >
                                                                <FiPlus />
                                                            </button>
                                                        }
                                                    </div>
                                                ))
                                            }
                                            {getFilteredAvailability(dayVal).length <= 0 && (
                                                <div className='flex items-center gap-2'>
                                                    <span>No times set</span>
                                                    <button
                                                        className={`ml-4 flex items-center justify-center`}
                                                        onClick={() => addAvailabilityInput(dayVal)}
                                                    >
                                                        <FiPlus />
                                                    </button>
                                                </div>
                                            )}
                                        </div>

                                    </div>

                                ))}
                            </div>

                        </LocalizationProvider>
                    </div>
                </main>
            </>
        )
    }
}

export default AvailabilityPage