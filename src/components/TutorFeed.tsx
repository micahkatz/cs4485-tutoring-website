import React from 'react'
import TutorCard from '../components/TutorCard'

type Props = {}

const TutorFeed = (props: Props) => {
    return (
        <div className='flex justify-center'>
            <div className='grid grid-cols-4 p-4'>
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