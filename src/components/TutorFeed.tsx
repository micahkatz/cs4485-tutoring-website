import React, { useEffect } from 'react'
import TutorCard from '../components/TutorCard'
import { tutorWithUserInfo } from '../pages/api/tutor'

type Props = {
}

const TutorFeed = (props: Props) => {
    const [tutorData, setTutorData] = React.useState<tutorWithUserInfo[]>()
    const [isLoading, setLoading] = React.useState(true)
    
    useEffect(() => {
        const fetchTutors = async () => {
        await fetch('api/tutor', {method: 'GET'})
        .then((resp) => resp.json())
        .then((json) => {
            // read json as tutor array, log result
            let result = json as []
            // Update data state
            setTutorData(result)
            // Stop loading
            setLoading(false)
        })
        }

        fetchTutors()
        console.log(tutorData)
    }, [])

    if( isLoading ) {
        return <><h1>Loading...</h1></>
    }
    else if( tutorData == undefined ) {
        return <><h1>Error Loading Tutor Feed.</h1></>
    }

    return (
        <div className='flex justify-center'>
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 p-4 w-full sm:max-w-[75%] 2xl:max-w-[66%]'>
                {tutorData.map(tut => (
                    <TutorCard key={tut.tutorID} tutor={tut} />
                ))}
            </div>
        </div>
    )
}

export default TutorFeed