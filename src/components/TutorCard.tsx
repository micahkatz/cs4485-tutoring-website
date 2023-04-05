import React from 'react'
import { IoBookmarkOutline, IoBookmark } from 'react-icons/io5'
import TagList from './tag/TagList'
import Link from 'next/link'
import { tutor, user, subject } from '@prisma/client'


type Props = {
    tutor: tutor
    user: user
    subjects: subject[]
}

const TutorCard = (props: Props) => {
    const [tutorData, setTutorData] = React.useState<tutor>(props.tutor)
    const [userData, setUserData] = React.useState<user>(props.user)
    const [subjectData, setSubjectData] = React.useState<subject[]>(props.subjects)

    return (
        <Link
            className='border-secondary border-2 rounded-md p-2 m-2 w-auto h-auto hover:scale-105 transition-all'
            href={'/tutor/'+ tutorData.tutorID}
        >
            <div className='flex flex-col h-full justify-end'>
                <img src='' alt='Image Not Found' className='w-full object-cover aspect-square' onError={({currentTarget}) => {
                    // Replace with empty profile picture if src image dne
                    currentTarget.onerror = null
                    currentTarget.src='/emptyprofile.svg'
                }} />
                <p className='text-lg w-full text-primary'>{userData.first_name} {userData.last_name}</p>
                <p className='text-sm w-full h-full text-primary text-left line-clamp-3'>
                    {tutorData.about_me && tutorData.about_me != '' ? tutorData.about_me : 'This tutor has not yet filled out their about me description. For more information, view their profile.'}
                </p>
                <div className='w-full flex mt-2 gap-2 justify-between'>
                    <TagList tags={subjectData} />
                    <button>
                        <IoBookmarkOutline size='2rem' className='' />
                    </button>
                </div>
            </div>
        </Link>
    )
}

export default TutorCard