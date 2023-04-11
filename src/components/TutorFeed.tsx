import React, { useEffect } from 'react'
import { Oval } from 'react-loader-spinner'
import TutorCard from '../components/TutorCard'
import { tutor, user, subject, tutors_subjects } from '@prisma/client'

type TutorWithSubjects = tutor & {
    subjects: tutors_subjects[];
};

type Props = {
}

const TutorFeed = (props: Props) => {
    const [tutorData, setTutorData] = React.useState<TutorWithSubjects[]>()
    const [tutorUserData, setTutorUserData] = React.useState<user[]>()
    const [tutorSubjectData, setTutorSubjectData] = React.useState<subject[][]>()
    const [isLoading, setLoading] = React.useState(true)
    const [loadError, setLoadError] = React.useState(false)
    
    const fetchTutorData = async () => {
        await fetch('api/tutor', {method: 'GET'})
        .then((resp) => resp.json())
        .then((json) => {
            // read json as tutor array
            const result = json as TutorWithSubjects[]
            
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
        .catch((error) => {
            setLoadError(true)
            setLoading(false)
            console.log('error loading tutor data')
            return
        })
    }

    const fetchTutorUserData = async (tutors: tutor[]) => {
        // Get tutor's user data
        const map = new Map<number, user>()
        await Promise.all(tutors.map(async (tut: tutor) => {
            await fetch('api/user/' + tut.fk_userID, {method: 'GET'})
            .then((resp) => resp.json())
            .then((json) => json as user)
            .then((result) => {
                // Map userId to user
                map.set(tut.fk_userID, result)
            })
            .catch((error) => {
                setLoadError(true)
                setLoading(false)
                console.log('error loading tutor\'s user data')
                return
            })
        }))

        // Get mappings (likely out-of-order from time they were fetched)
        let usersList: user[] = []
        tutors.forEach( (tut: tutor) => {
            // use tutor foreign key to put user data in array parallel to tutor data array
            const u = map.get(tut.fk_userID)
            if (u) {
                usersList.push(u)
            }
            else {
                console.log('error loading user')
                console.log(u)
            }
        } )

        // Update user data state
        setTutorUserData(usersList)
    }

    const fetchTutorSubjectData = async (tutors: TutorWithSubjects[]) => {
        // Get subjects lists
        const map = new Map<number, subject[]>()
        await Promise.all(tutors.map(async (tut:TutorWithSubjects) => {
            let subjects: subject[] = []
            await Promise.all(tut.subjects.map(async (tut_sub:tutors_subjects) => {
                await fetch('api/subject/' + tut_sub.fk_subjectID, {method: 'GET'})
                .then((resp) => resp.json())
                .then((json) => json as subject)
                .then((result) => {
                    // read json as subject, return it
                    subjects.push(result)
                })
                .catch((error) => {
                    setLoadError(true)
                    setLoading(false)
                    console.log('error loading tutor\'s subject data')
                    return
                }) 
            }))
            map.set(tut.tutorID, subjects)
        }))

        // Get mappings (likely out-of-order from time they were fetched)
        let subjectLists: subject[][] = []
        tutors.forEach( (tut: tutor) => {
            // use tutor foreign key to put subject data in array parallel to tutor data array
            const s = map.get(tut.tutorID)
            if (s) {
                subjectLists.push(s)
            }
            else {
                console.log('error loading subjects')
                console.log(s)
            }
        } )

        // Update subject state
        setTutorSubjectData(subjectLists)

        // Stop loading
        setLoading(false)
    }

    useEffect(() => {
        fetchTutorData()
    }, [])

    if( isLoading ) {
        return <div className='mt-6'><Oval width='75' color='#9748FF' secondaryColor='#BCE3FF'/></div>
    }
    else if( loadError ) {
        return <><span className='text-primary text-lg'>Error Loading Tutor Feed.</span></>
    }
    else if( tutorData && tutorUserData && tutorSubjectData ) {
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
    else {
        return <></>
    }
}

export default TutorFeed