import React from 'react'
import { IoBookmarkOutline, IoBookmark } from 'react-icons/io5'
import TagList from './tag/TagList'
import Link from 'next/link'
import { tutor, user, subject, user_favorites } from '@prisma/client'
import { UserContext } from '@/context/userContext'
import { Oval } from 'react-loader-spinner'


type Props = {
    tutor: tutor
    user: user
    subjects: subject[]
    favoriteRefs: boolean[]
    setFavoriteRefs: React.Dispatch<React.SetStateAction<boolean[]>>
    index: number
    sortFunction: () => void
}

const TutorCard = (props: Props) => {
    const [tutorData, setTutorData] = React.useState<tutor>(props.tutor)
    const [userData, setUserData] = React.useState<user>(props.user)
    const [subjectData, setSubjectData] = React.useState<subject[]>(props.subjects)
    const [hoveringBookmark, setHoveringBookmark] = React.useState<boolean>(false)
    const [isFavorite, setFavorite] = React.useState<boolean>(false)
    const [isLoading, setLoading] = React.useState<boolean>(true)
    const userContext = React.useContext(UserContext)
    const favoriteRefs = props.favoriteRefs
    const setFavoriteRefs = props.setFavoriteRefs
    const favoriteRefsIndex = props.index
    const sort = props.sortFunction

    const fetchFavorite = async () => {
        await fetch(`api/user/favorites/${userContext.currUser.userID}`, { method: 'GET' })
            .then((response) => response.json())
            .then((json) => {
                let result = json as user_favorites[]

                // Check if user favorited this tutor
                for (let i = 0; i < result.length; i++) {
                    if (result[i].fk_tutorID == tutorData.fk_userID) {
                        setFavorite(true)
                        setLoading(false)
                        return
                    }
                }

                setFavorite(false)
                setLoading(false)
            })
    }

    const hoveringEventOn = (event: React.MouseEvent<HTMLElement>) => {
        setHoveringBookmark(true)
    }

    const hoveringEventOff = (event: React.MouseEvent<HTMLElement>) => {
        setHoveringBookmark(false)
    }

    const bookmarkToggleEvent = async (event: React.MouseEvent<HTMLElement>) => {
        // Toggle favorite
        const newSetting = !isFavorite
        setFavorite(newSetting)

        // Update user favorites in database
        if (newSetting) {
            // Create new user favorite
            const newFavorite: user_favorites = {
                fk_userID: userContext.currUser.userID,
                fk_tutorID: tutorData.fk_userID
            }

            // Make API Request
            await fetch('api/user/favorites', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newFavorite) })
                .then((response) => response.json())
                .then((json) => {
                    userContext.getUserFavorites()
                })
                .catch((error) => {
                    // Error, so unset the favorite.
                    setFavorite(false)
                })
        }
        else {
            // Delete existing user favorite
            const favoriteToDelete: user_favorites = {
                fk_userID: userContext.currUser.userID,
                fk_tutorID: tutorData.fk_userID
            }

            // Make API Request
            await fetch('api/user/favorites', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(favoriteToDelete) })
                .then((response) => userContext.getUserFavorites())
                .catch((error) => {
                    // Error, so reset the favorite
                    setFavorite(true)
                })
        }
    }

    React.useEffect(() => {
        fetchFavorite()
    }, [])

    React.useEffect(() => {
        if (favoriteRefs) {
            let newRefs = favoriteRefs
            newRefs[favoriteRefsIndex] = isFavorite
            setFavoriteRefs(newRefs)
            sort()
        }
    }, [isFavorite])

    if (isLoading) {
        return (
            <div className='flex justify-center'><Oval width='75' color='#9748FF' secondaryColor='#BCE3FF' /></div>
        )
    }
    else {
        return (
            <div
                className='border-secondary border-2 rounded-md p-2 m-2 w-auto h-auto hover:scale-105 transition-all'

            >
                <div className='flex flex-col h-full justify-between'>
                    <Link href={'/tutor/' + tutorData.fk_userID} >
                        <img src={tutorData.profile_picture ? tutorData.profile_picture : ''} alt='Image Not Found' className='w-full object-cover aspect-square' onError={({ currentTarget }) => {
                            // Replace with empty profile picture if src image dne
                            currentTarget.onerror = null
                            currentTarget.src = '/emptyprofile.svg'
                        }} />
                        <p className='text-lg w-full text-primary'>{userData.first_name} {userData.last_name}</p>
                        <p className='text-sm w-full h-auto text-primary text-left line-clamp-3'>
                            {tutorData.about_me && tutorData.about_me != '' ? tutorData.about_me : 'This tutor has not yet filled out their about me description. For more information, view their profile.'}
                        </p>
                    </Link>
                    <div className='w-full flex mt-2 gap-2 justify-between'>
                        <TagList tags={subjectData} />
                        <div onMouseOver={hoveringEventOn} onMouseLeave={hoveringEventOff} onClick={bookmarkToggleEvent} className='flex flex-col justify-end hover:cursor-pointer' >
                            {(isFavorite) && <IoBookmark size='2rem' className='' /> || <IoBookmarkOutline size='2rem' className='' />}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default TutorCard