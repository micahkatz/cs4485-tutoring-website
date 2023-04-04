import React, { useEffect } from 'react'
import TutorCard from '../components/TutorCard'
import { tutor, user, subject, tutors_subjects } from '@prisma/client'

type Props = {
}

const TutorFeed = (props: Props) => {
    const [tutorData, setTutorData] = React.useState<tutor[]>()
    const [tutorUserData, setTutorUserData] = React.useState<user[]>()
    const [tutorSubjectData, setTutorSubjectData] = React.useState<subject[][]>()
    const [isLoading, setLoading] = React.useState(true)
    
    const fetchTutorData = async () => {
        await fetch('api/tutor', {method: 'GET'})
        .then((resp) => resp.json())
        .then((json) => {
            // read json as tutor array
            const result = json as tutor[]
            
            // Check if tutor data is not undefined
            if(result) {
                // Fetch user data
                fetchTutorUserData(result)

                // Fetch subject data
                fetchTutorSubjectData(result)

                // Update data state
                setTutorData(result)
            }
        })
    }

    const fetchTutorUserData = async (tutors: tutor[]) => {
        // Get tutor's user data
        let usersList: user[] = []
        await Promise.all(tutors.map(async (tut: tutor) => {
            await fetch('api/user/' + tut.fk_userID, {method: 'GET'})
            .then((resp) => resp.json())
            .then((json) => {
                // read json as user, return it
                let result = json as user
                usersList.push(result)
            })
            .catch((error) => {
                return
            })
        }))

        // Update user data state
        setTutorUserData(usersList)
    }

    const fetchTutorSubjectData = async (tutors: tutor[]) => {
        // Get tutors subjects lists
        let tutorsSubjects: tutors_subjects[][] = []
        await Promise.all(tutors.map(async (tut: tutor) => {
            await fetch('api/tutor/subjects/' + tut.tutorID, {method: 'GET'})
            .then((resp) => resp.json())
            .then((json) => {
                // read json as tutor's subjects, return it
                let result = json as tutors_subjects[]
                tutorsSubjects.push(result)
            })
        }))
        
        // Get subjects lists
        let subjectLists: subject[][] = []
        await Promise.all(tutorsSubjects.map(async (tut_subs:tutors_subjects[]) => {
            let subjects: subject[] = []

            await Promise.all(tut_subs.map(async (tut_sub:tutors_subjects) => {
                await fetch('api/subject/' + tut_sub.fk_subjectID, {method: 'GET'})
                .then((resp) => resp.json())
                .then((json) => {
                    // read json as subject, return it
                    let result = json as subject
                    subjects.push(result)
                })
            }))
            subjectLists.push(subjects)
        }))

        // Update subject state
        setTutorSubjectData(subjectLists)

        // Stop loading
        setLoading(false)
    }

    useEffect(() => {
        fetchTutorData()
    }, [])

    if( isLoading ) {
        return <><h1>Loading Tutors...</h1></>
    }
    else if( tutorData == undefined || tutorUserData == undefined || tutorSubjectData == undefined ) {
        return <><h1>Error Loading Tutor Feed.</h1></>
    }
    else {
        return (
            <div className='flex justify-center'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 w-full sm:max-w-[75%] 2xl:max-w-[66%]'>
                    {tutorData.map(tut => (
                            <TutorCard key={tut.tutorID} 
                            tutor={tut} 
                            user={tutorUserData[tutorData.indexOf(tut)]} 
                            subjects={tutorSubjectData[tutorData.indexOf(tut)]}/>
                    ))}
                </div>
            </div>
        )
    }
}

export default TutorFeed