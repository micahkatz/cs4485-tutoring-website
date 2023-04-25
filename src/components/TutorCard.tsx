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
    const [hoveringBookmark, setHoveringBookmark] = React.useState<boolean>(false)
    const [favorite, setFavorite] = React.useState<boolean>(false)

    const hoveringEventOn = (event: React.MouseEvent<HTMLElement>) => {
        setHoveringBookmark(true)
    }

    const hoveringEventOff = (event: React.MouseEvent<HTMLElement>) => {
        setHoveringBookmark(false)
    }

    const bookmarkToggleEvent = (event: React.MouseEvent<HTMLElement>) => {
        // Toggle favorite
        setFavorite(!favorite)

        // Update user favorites in database
        /// CODE GOES HERE
    }

    return (
        <Link
            className='border-secondary border-2 rounded-md p-2 m-2 w-auto h-auto hover:scale-105 transition-all'
            href={'/tutor/'+ tutorData.fk_userID}
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
                    <Link href='' onMouseEnter={hoveringEventOn} onMouseLeave={hoveringEventOff} onClick={bookmarkToggleEvent} >
                        {(hoveringBookmark || favorite) && <IoBookmark size='2rem' className='' /> || <IoBookmarkOutline size='2rem' className='' />}
                    </Link>
                </div>
            </div>
        </Link>
    )
}

export default TutorCard