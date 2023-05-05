import TagList from '@/components/tag/TagList'
import { subject, tutor, tutors_subjects, user } from '@prisma/client'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import NavBar from '../../components/NavBar'

import AppointmentCalendar from '@/components/AppointmentCalendar'
import 'react-calendar/dist/Calendar.css'
import 'react-clock/dist/Clock.css'
import 'react-datetime-picker/dist/DateTimePicker.css'
// import Calendar from 'reactjs-availability-calendar'


type Props = {}

type TutorWithSubjects = tutor & {
    subjects: tutors_subjects[];
};

const TutorPage = (props) => {
    const [tutorData, setTutorData] = React.useState<tutor>()
    const [tutorUserData, setTutorUserData] = React.useState<user>()
    const [tutorSubjectData, setTutorSubjectData] = React.useState<subject[]>()
    const [isLoading, setLoading] = React.useState(true)
    const router = useRouter()
    const tutorId = Number(router.query?.tutorId) as number

    const fetchTutorData = async () => {
        await fetch('../../api/tutor/' + tutorId, { method: 'GET' })
            .then((resp) => resp.json())
            .then((json) => {
                let result = json as TutorWithSubjects

                // Fetch user data
                fetchTutorUserData(result)

                // Fetch subject data
                fetchTutorSubjectData(result)

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

    const fetchTutorSubjectData = async (tut: TutorWithSubjects) => {
        // Get subjects lists
        let subjects: subject[] = []
        await Promise.all(tut.subjects.map(async (tut_sub: tutors_subjects) => {
            await fetch('../../api/subject/' + tut_sub.fk_subjectID, { method: 'GET' })
                .then((resp) => resp.json())
                .then((json) => {
                    // read json as subject, return it
                    let result = json as subject
                    subjects.push(result)
                })
        }))

        // Update subject state
        setTutorSubjectData(subjects)

        // Stop loading
        setLoading(false)
    }
    useEffect(() => {
        fetchTutorData()
    }, [tutorId])

    if (isLoading) {
        return <><h1>Loading...</h1></>
    }

    if (tutorData == undefined || tutorUserData == undefined || tutorSubjectData == undefined) {
        return <><h1>"Error Loading Page.</h1></>
    }
    else {
        return (
            <>
                <Head>
                    <title>Tutor Page</title>
                    <meta name="description" content="Generated by create next app" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main>
                    <NavBar />
                    <div className='p-4 flex flex-col items-center'>
                        <div className='flex flex-col lg:flex-row gap-8 mb-8'>
                            <img src={tutorData.profile_picture ? tutorData.profile_picture : ''} alt='Image Not Found' className='bg-gray-400 w-40 h-40 rounded-full object-cover' onError={({ currentTarget }) => {
                                // Replace with empty profile picture if src image dne
                                currentTarget.onerror = null
                                currentTarget.src = '/emptyprofile.svg'
                            }} />
                            <div>
                                <span className='text-lg font-bold'>{tutorUserData.first_name + " " + tutorUserData.last_name}</span>
                                <p>{tutorData.about_me}</p>
                                <div className='text-sm mt-2'>
                                    <span>Tutor Hours: </span>
                                    <span className='font-bold'>{tutorData.totalTutorHours}</span>
                                </div>
                                <TagList tags={tutorSubjectData}
                                    className='mt-2'
                                />
                            </div>
                        </div>
                        <AppointmentCalendar tutorId={tutorId} />
                    </div>
                </main>
            </>
        )
    }
}

export default TutorPage