import React, { useEffect } from 'react'
import { Oval } from 'react-loader-spinner'
import TutorCard from '../components/TutorCard'
import { tutor, user, subject, tutors_subjects, availability } from '@prisma/client'
import { TutorWithSubjects } from '@/types/globals'
import { truncate } from 'fs'


type Props = {
    filterName: string;
    filterSubject: string;
    filterDay: Date | undefined;
    filterHour: Date | undefined;
}

const TutorFeed = (props: Props) => {
    const [tutorData, setTutorData] = React.useState<TutorWithSubjects[]>()
    const [tutorUserData, setTutorUserData] = React.useState<user[]>()
    const [tutorSubjectData, setTutorSubjectData] = React.useState<subject[][]>()
    const [tutorAvailiabilityData, setTutorAvailabilityData] = React.useState<availability[][]>()
    const [tutorFavoriteRefs, setTutorFavoritesRefs] = React.useState<boolean[]>([])
    const [isLoading, setLoading] = React.useState<boolean>(true)
    const [loadError, setLoadError] = React.useState<boolean>(false)
    const [tutorDisplayIndexes, setTutorDisplayIndexes] = React.useState<number[]>([])
    const [sortedTutorDisplayIndexes, setSortedTutorDisplayIndexes] = React.useState<number[]>([])
    const nameFilter = props.filterName, subjectFilter = props.filterSubject, dayFilter = props.filterDay, hourFilter = props.filterHour;
    
    const fetchTutorData = async () => {
        await fetch('api/tutor', {method: 'GET'})
        .then((resp) => resp.json())
        .then(async (json) => {
            // read json as tutor array
            const result = json as TutorWithSubjects[]

            // Create refs
            let refs: boolean[] = []
            for(let i = 0; i < result.length; i++) {
                refs.push(false)
            }
            
            // Check if tutor data is not undefined
            if(result) {
                // Fetch user data
                await fetchTutorUserData(result)

                // Fetch subject data
                await fetchTutorSubjectData(result)

                // Fetch availability data
                await fetchTutorAvailability(result)

                // Update data state
                setTutorData(result)

                // Update portals state
                setTutorFavoritesRefs(refs)

                // Update tutor display indexes
                let indexes = []
                for(let i = 0; i < result.length; i++)
                    indexes.push(i)
                setTutorDisplayIndexes(indexes)

                // Set loading
                setLoading(false)
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
            map.set(tut.fk_userID, subjects)
        }))

        // Get mappings (likely out-of-order from time they were fetched)
        let subjectLists: subject[][] = []
        tutors.forEach( (tut: tutor) => {
            // use tutor foreign key to put subject data in array parallel to tutor data array
            const s = map.get(tut.fk_userID)
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
    }

    const fetchTutorAvailability = async (tutors: TutorWithSubjects[]) => {
        // Get availabilities
        // Get tutor's user data
        const map = new Map<number, availability[]>()
        await Promise.all(tutors.map(async (tut: tutor) => {
            await fetch(`api/availability?tutorId=${tut.fk_userID}`, {method: 'GET'})
            .then((resp) => resp.json())
            .then((json) => json as availability[])
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
        let availsList: availability[][] = []
        tutors.forEach( (tut: tutor) => {
            // use tutor foreign key to put user data in array parallel to tutor data array
            const a = map.get(tut.fk_userID)
            if (a) {
                availsList.push(a)
            }
            else {
                console.log('error loading availability')
                console.log(a)
            }
        } )

        // Update user data state
        setTutorAvailabilityData(availsList)
    }

    const filterTutors = () => {
        // Return if called when loading
        if(isLoading) return

        // Display no tutors if tutorData undefined
        if(!tutorData || !tutorUserData || !tutorSubjectData || loadError) {
            setTutorDisplayIndexes([])
            return
        }

        let indexes: number[] = []
        for(let i = 0; i < tutorData.length; i++) {
            indexes.push(i)
        }

        // Parse Filters
        /// Name
        for(let i = 0; i < tutorUserData.length; i++) {
            let name = (tutorUserData[i].first_name.toLowerCase() + " " + tutorUserData[i].last_name.toLowerCase())
            if( indexes.indexOf(i) != -1 ) {
                if( name.indexOf(nameFilter.toLowerCase()) == -1 ) {
                    indexes.splice(indexes.indexOf(i), 1)
                }
            }
        }

        /// Subject
        if(subjectFilter != '') {
            for( let i = 0; i < tutorSubjectData.length; i++ ) {
                let subjects = tutorSubjectData[i]

                // See if tutor tutors for the filtered subject
                let found = false
                for( let j = 0; j < subjects.length; j++ ) {
                    if( subjects[j].name == subjectFilter ) {
                        found = true
                        break
                    }
                }

                // Remove if not found
                if( !found ) {
                    if( indexes.indexOf(i) != -1 ) {
                        indexes.splice(indexes.indexOf(i), 1)
                    }
                }
            }
        }

        /// Day
        if( dayFilter ) {
            // Put data from dayFilter into ease-of-access vars
            const dayOfTheWeek = dayFilter.getDay()
            const dayOfTheMonth = dayFilter.getDate()
            const month = dayFilter.getMonth()
            const year = dayFilter.getFullYear()

            for( let i = 0; i < tutorAvailiabilityData.length; i++ ) {
                const availabilities = tutorAvailiabilityData[i]

                // See if tutor tutors on the selected day
                let found = false
                for( let j = 0; j < availabilities.length; j++ ) {
                    const startDT = new Date(availabilities[j].startDT)
                    const endDT = new Date(availabilities[j].endDT)
                    if( availabilities[j].repeatWeekly ) {
                        if( startDT.getDay() == dayOfTheWeek ) {
                            found = true
                            break
                        }
                    }
                    else {
                        if(startDT.getDate() == dayOfTheMonth && startDT.getMonth() == month && startDT.getFullYear() == year) {
                            found = true
                            break
                        }
                    }
                }

                if( !found ) {
                    if( indexes.indexOf(i) != -1 ) {
                        indexes.splice(indexes.indexOf(i), 1)
                    }
                }
            }
        }

        /// Hour
        if( hourFilter ) {
            // Put data from dayFilter into ease-of-access vars
            const hour = hourFilter.getHours()

            for( let i = 0; i < tutorAvailiabilityData.length; i++ ) {
                const availabilities = tutorAvailiabilityData[i]

                // See if tutor tutors on the selected day
                let found = false
                for( let j = 0; j < availabilities.length; j++ ) {
                    const startDT = new Date(availabilities[j].startDT)
                    const endDT = new Date(availabilities[j].endDT)
                    if( availabilities[j].repeatWeekly ) {
                        console.log(hour, 'vs', startDT.getHours(), '&', endDT.getHours())
                        if( startDT.getHours() <= hour && endDT.getHours() >= hour ) {
                            found = true
                            break
                        }
                    }
                }

                if( !found ) {
                    if( indexes.indexOf(i) != -1 ) {
                        indexes.splice(indexes.indexOf(i), 1)
                    }
                }
            }
        }

        setTutorDisplayIndexes(indexes)
    }

    const sortIndexes = () => {
        let sortedIndexes: number[] = []
        for( let i = 0; i < tutorDisplayIndexes.length; i++ ) {
            //console.log(tutorFavoriteRefs[tutorDisplayIndexes[i]])
            if( tutorFavoriteRefs[tutorDisplayIndexes[i]] ) {
                sortedIndexes.unshift(tutorDisplayIndexes[i])
            }
            else {
                sortedIndexes.push(tutorDisplayIndexes[i])
            }
        }
        setSortedTutorDisplayIndexes(sortedIndexes)
    }

    useEffect(() => {
        fetchTutorData()
    }, [])

    useEffect(() => {
        filterTutors()
    }, [nameFilter, subjectFilter, dayFilter, hourFilter])

    useEffect(() => {
        sortIndexes()
    }, [tutorDisplayIndexes])

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
                    {sortedTutorDisplayIndexes.map(index => (
                            <TutorCard key={tutorData[index].fk_userID} 
                            tutor={tutorData[index]} 
                            user={tutorUserData[index]} 
                            subjects={tutorSubjectData[index]}
                            favoriteRefs={tutorFavoriteRefs}
                            setFavoriteRefs={setTutorFavoritesRefs}
                            index={index}
                            sortFunction={sortIndexes}/>
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