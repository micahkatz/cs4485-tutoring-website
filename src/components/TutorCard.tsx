import React from 'react'
import { IoBookmarkOutline, IoBookmark } from 'react-icons/io5'
import TagList from './tag/TagList'
import Link from 'next/link'
import { subject } from '@prisma/client'
import { tutorWithUserInfo } from '../pages/api/tutor'


type Props = {
    tutor: tutorWithUserInfo
}

const TutorCard = (props: Props) => {
    const [tutorData, setTutorData] = React.useState<tutorWithUserInfo>(props.tutor)
    // Load properties
    const name = tutorData.first_name + " " + tutorData.last_name
    const about_me = tutorData.about_me != '' ? tutorData.about_me : 'This tutor has not filled out their about me descrpition!' 
    const image_src = ''
    const subjects: string[] = []

    // Pull names out of subjects list
    for(let i = 0; i < tutorData.subjects.length; i++) {
        subjects.push(tutorData.subjects[i].name)
    }


    return (
        <Link
            className='border-secondary border-2 rounded-md p-2 m-2 w-auto h-auto hover:scale-105 transition-all'
            href={'/tutor/'+ tutorData.tutorID}
        >
            {/*<div className='bg-layer01 w-40 h-40' />*/}
            <img src='' alt='Image Not Found' className='w-full object-cover aspect-square' onError={({currentTarget}) => {
                // Replace with empty profile picture if src image dne
                currentTarget.onerror = null
                currentTarget.src='emptyprofile.svg'
            }} />
            <p className='text-lg w-full text-primary'>{name}</p>
            <p className='text-sm w-full text-primary text-left line-clamp-2 md:line-clamp-3'>{about_me}</p>
            <div className='w-full flex mt-2 gap-2 justify-between'>
                <TagList tags={subjects} />
                <button>
                    <IoBookmarkOutline size='2rem' className='' />
                </button>
            </div>
        </Link>
    )
}

export default TutorCard