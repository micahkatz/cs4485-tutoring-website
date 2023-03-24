import React from 'react'
import TutorCard from '../components/TutorCard'

type Props = {}

const TutorFeed = (props: Props) => {
    return (
        <div className='flex justify-center'>
            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4 w-full sm:max-w-[66%]'>
                <TutorCard />
                <TutorCard />
                <TutorCard />
                <TutorCard />
                <TutorCard />
                <TutorCard />
            </div>
        </div>
    )
}

export default TutorFeed