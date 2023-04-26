import React, { useEffect } from 'react'
import Head from 'next/head'
import NavBar from '../components/NavBar'
import { useRouter } from 'next/router'
import CommonInput from '@/components/CommonInput'
import { IoCamera, IoSettingsOutline } from 'react-icons/io5'
import { UserContext } from '@/context/userContext'
import { TutorWithSubjects, UserWithoutPassword } from '@/types/globals'
import { tutor } from '@prisma/client'
import { Oval } from 'react-loader-spinner'
import axios, { AxiosError } from 'axios';

type Props = {}

const AccountPage = (props) => {
    const router = useRouter()
    const { tutorId } = router.query
    const userContext = React.useContext(UserContext)
    const [tutorContext, setTutorContext] = React.useState<TutorWithSubjects>(undefined)
    const [firstName, setFirstName] = React.useState<string>(userContext?.currUser?.first_name)
    const [lastName, setLastName] = React.useState<string>(userContext?.currUser?.last_name)
    const [email, setEmail] = React.useState<string>(userContext?.currUser?.email)
    const [aboutMe, setAboutMe] = React.useState<string>("")
    const [imageURL, setImageURL] = React.useState<string>("")
    const [isLoading, setLoading] = React.useState<boolean>(true)
    const [errorMessage, setErrorMessage] = React.useState("")
    const emailRegex = RegExp("^[A-Za-z0-9.]+@[A-Za-z.]+.[A-Za-z]+$")
    
    const loadProfile = async () => {
        // Check if user is a tutor
        const id = userContext.currUser.userID
        await fetch('api/tutor/' + id, {method: 'GET'})
        .then((resp) => resp.json())
        .then((json) => {
            const result = json as TutorWithSubjects
            setTutorContext(result)
            setAboutMe(result.about_me)
            setImageURL(result.profile_picture ? result.profile_picture : '')
            setLoading(false)
            console.log("user is a tutor")
        })
        .catch((error) => {
            setTutorContext(undefined)
            setLoading(false)
            console.log("user is not a tutor")
        }) 
    }

    const saveProfile = async (event: React.MouseEvent<HTMLButtonElement>) => {
        // Validate entries
        if (entriesValid()) {
            // Create user object
            let newUser: UserWithoutPassword = {
                userID: userContext.currUser.userID,
                first_name: firstName,
                last_name: lastName,
                email: email,
                totalLearnHours: userContext.currUser.totalLearnHours
            }

            // Update user
            await fetch('api/user', {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newUser)})
            .then((response) => response.json())
            .then((json) => {
                let result = json as UserWithoutPassword
                userContext.setCurrUser(result)
            })
            .catch((error) => {
                setErrorMessage("Failed to update user.")
                console.error(error)
                return
            })

            // Check if tutor data needs to be updated
            if( tutorContext ) {
                // Create tutor object
                let newTutor: tutor = {
                    fk_userID: tutorContext.fk_userID,
                    about_me: aboutMe,
                    profile_picture: imageURL != '' ? imageURL : null,
                    totalTutorHours: tutorContext.totalTutorHours
                }

                // Update tutor
                await fetch('api/tutor', {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newTutor)})
                .then((response) => response.json())
                .then((json) => {
                    let result = json as TutorWithSubjects
                    setTutorContext(result)
                })
                .catch((error) => {
                    setErrorMessage("Failed to update tutor.")
                    console.error(error)
                    return
                })
            }
        }
    }

    const entriesValid = () => {
        // Trim entries
        let first = firstName.trim(), last = lastName.trim(), em = email.trim(), about = aboutMe.trim()
    
        // Reset error message
        setErrorMessage("")
    
        // Entries filled out
        if (first == '' || last == '' || em == '') {
          setErrorMessage("Please fill out all required information first.")
          return false
        }
    
        // First/Last Name
        if (first.indexOf(' ') != -1 || last.indexOf(' ') != -1) {
          setErrorMessage("First/Last name must be a single word.")
          return false
        }
    
        // Email
        if (!emailRegex.test(em)) {
          setErrorMessage("Invalid email format. Please enter a real email.")
          return false
        }
        return true
      }

    const updateFirstName = (event: React.ChangeEvent) => {
        let target = event.target as HTMLInputElement
        setFirstName(target.value)
    }

    const updateLastName = (event: React.ChangeEvent) => {
        let target = event.target as HTMLInputElement
        setLastName(target.value)
    }

    const updateEmail = (event: React.ChangeEvent) => {
        let target = event.target as HTMLInputElement
        setEmail(target.value)
    }

    const updateAboutMe = (event: React.ChangeEvent) => {
        let target = event.target as HTMLInputElement
        setAboutMe(target.value)
    }

    useEffect(() => {
        loadProfile()
    }, [])

    if(isLoading) {
        return <div className='flex justify-center'><Oval width='75' color='#9748FF' secondaryColor='#BCE3FF'/></div>
    }
    else {
        return (
            <>
                <Head>
                    <title>My Profile</title>
                    <meta name="description" content="Generated by create next app" />
                    <meta name="viewport" content="width=device-width, initial-scale=1" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main>
                    <NavBar />
                    <div className='p-4 flex flex-col items-center'>
                        <div className='flex flex-col gap-8 mb-8'>
                            <div className='flex items-center gap-4'>
                                <button className='relative h-fit w-20'>
                                    {tutorContext &&
                                    <img src={imageURL} alt='Image Not Found' className='bg-gray-400 w-20 h-20 rounded-full' onError={({currentTarget}) => {
                                        // Replace with empty profile picture if src image dne
                                        currentTarget.onerror = null
                                        currentTarget.src='/emptyprofile.svg'
                                    }} />}
                                    {/* <div className='absolute bottom-1 right-1 bg-secondary rounded-full p-2'>
                                        <IoCamera className='' size='1.25rem' />
                                    </div> */}
                                </button>
                                <div className='flex flex-col'>
                                    <span className='text-primary text-lg'>{userContext?.currUser?.first_name} {userContext?.currUser?.last_name}</span>
                                    <button>
                                        <span className='text-link font-bold hover:text-primary text-sm'>Change profile photo</span>
                                    </button>
                                </div>
                                <div className='flex flex-1 justify-end'>
                                    <button>
                                        <IoSettingsOutline className='' size='1.5rem' />
                                    </button>
                                </div>
                            </div>
                            <div className='flex flex-col'>
                                <div className='flex gap-4 md:w-auto flex-col md:flex-row'>
                                    <CommonInput
                                        placeholder='First Name'
                                        defaultValue={firstName}
                                        onChange={updateFirstName}
                                    />
                                    <CommonInput
                                        placeholder='Last Name'
                                        defaultValue={lastName}
                                        onChange={updateLastName}
                                    />
                                </div>
                                <CommonInput
                                    placeholder='Email'
                                    defaultValue={email}
                                    onChange={updateEmail}
                                />
                                {tutorContext &&
                                <CommonInput
                                    innerClass='h-40'
                                    placeholder='About Me'
                                    inputType='TextArea'
                                    defaultValue={aboutMe}
                                    onChange={updateAboutMe}
                                />}
                                <button 
                                    className='bg-primary w-fit px-4 py-1 mt-2 rounded-lg text-inverted'
                                    onClick={saveProfile}
                                >
                                    Save Profile
                                </button>
                                <button
                                    className='bg-secondary w-fit px-4 py-1 mt-2 rounded-lg text-primary'
                                    onClick={userContext.logout}
                                >
                                    Log Out
                                </button>
                                <span className='text-red-500 text-lg flex mt-6 justify-center w-full'>{errorMessage}</span>
                            </div>
                        </div>
                    </div>
                </main>
            </>
        )
    }
}

export default AccountPage