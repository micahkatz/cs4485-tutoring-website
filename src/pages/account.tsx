import React, { useEffect } from 'react'
import Head from 'next/head'
import NavBar from '@/components/NavBar'
import TagList from '@/components/tag/TagList'
import CommonTag from '@/components/tag/CommonTag'
import { useRouter } from 'next/router'
import CommonInput from '@/components/CommonInput'
import { IoCamera, IoSettingsOutline, IoPencilSharp, IoCheckmark, IoClose, IoDownload } from 'react-icons/io5'
import { UserContext } from '@/context/userContext'
import { TutorWithSubjects, UserWithoutPassword } from '@/types/globals'
import { subject, tutor, tutors_subjects } from '@prisma/client'
import { Oval } from 'react-loader-spinner'
import axios, { AxiosError } from 'axios';
import { createPortal } from 'react-dom'

type Props = {}

const AccountPage = (props) => {
    const router = useRouter()
    const { tutorId } = router.query
    const userContext = React.useContext(UserContext)
    const [currTutor, setCurrTutor] = React.useState<TutorWithSubjects>(undefined)
    const [firstName, setFirstName] = React.useState<string>(userContext?.currUser?.first_name)
    const [lastName, setLastName] = React.useState<string>(userContext?.currUser?.last_name)
    const [email, setEmail] = React.useState<string>(userContext?.currUser?.email)
    const [aboutMe, setAboutMe] = React.useState<string>("")
    const [imageURL, setImageURL] = React.useState<string>("")
    const [subjectData, setTutorSubjectData] = React.useState<subject[]>(undefined)
    const [isLoading, setLoading] = React.useState<boolean>(true)
    const [isSaving, setSaving] = React.useState<boolean>(false)
    const [errorMessage, setErrorMessage] = React.useState<string>("")
    const [successMessage, setSuccessMessage] = React.useState<string>("")
    const [subjectsDisplay, setSubjectsDisplay] = React.useState<boolean>(false)
    const [optionsDisplay, setOptionsDisplay] = React.useState<boolean>(false)
    const [subjectsOptions, setSubjectsOptions] = React.useState<subject[]>([])
    const [subjectsSelections, setSubjectsSelections] = React.useState<boolean[]>([])
    const [uploadDisplay, setUploadDisplay] = React.useState<boolean>(false)
    const [isDragging, setDragging] = React.useState<boolean>(false)
    const [uploadFile, setUploadFile] = React.useState<File>(undefined)
    const [uploadPreview, setUploadPreview] = React.useState<string>(undefined)
    const emailRegex = RegExp("^[A-Za-z0-9.]+@[A-Za-z.]+.[A-Za-z]+$")
    const uploadForm = React.createRef<HTMLInputElement>()

    const loadProfile = async () => {
        // Check if user is a tutor
        const id = userContext.currUser.userID
        await fetch('api/tutor/' + id, { method: 'GET' })
            .then((resp) => resp.json())
            .then((json) => {
                const result = json as TutorWithSubjects
                setCurrTutor(result)
                setAboutMe(result.about_me)
                setImageURL(result.profile_picture ? result.profile_picture : '')
                fetchTutorSubjectData(result)
                console.log("user is a tutor")
            })
            .catch((error) => {
                setCurrTutor(undefined)
                setLoading(false)
                console.log("user is not a tutor")
            })
    }

    const fetchTutorSubjectData = async (tut: TutorWithSubjects) => {
        // Get subjects lists
        let subjects: subject[] = []
        await Promise.all(tut.subjects.map(async (tut_sub: tutors_subjects) => {
            await fetch('../../api/subject/' + tut_sub.fk_subjectID, { method: 'GET' })
                .then((resp) => resp.json())
                .then((json) => {
                    // read json as subject, return it
                    let result = json as subject
                    subjects.push(result)
                })
        }))

        // Update subject state
        setTutorSubjectData(subjects)

        // Fetch all subjects
        fetchSubjects(subjects)
    }

    const fetchSubjects = async (_subjectData: subject[]) => {
        await fetch('api/subject', { method: 'GET' })
            .then((resp) => resp.json())
            .then((json) => {
                // read json as tutor array
                const result = json as subject[]

                // Check if subject data is not undefined
                if (result) {
                    // Update data state
                    setSubjectsOptions(result)

                    // Set up array to keep track of what's selected
                    let selections: boolean[] = []
                    for (let i = 0; i < result.length; i++) {
                        let found = false
                        for (let j = 0; j < _subjectData.length; j++) {
                            if (result[i].subjectID == _subjectData[j].subjectID) {
                                selections.push(true)
                                found = true
                                break
                            }
                        }
                        if (!found)
                            selections.push(false)
                    }
                    setSubjectsSelections(selections)
                    console.log('initial', selections)

                    // No longer loading
                    setLoading(false)
                }
            })
            .catch((error) => {
                setSubjectsOptions([])
                setSubjectsSelections([])
                setLoading(false)
                console.error('error loading subject data')
                return
            })

        // Stop loading
        setLoading(false)
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
            await fetch('api/user', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newUser) })
                .then((response) => response.json())
                .then((json) => {
                    let result = json as UserWithoutPassword
                    userContext.setCurrUser(result)
                })
                .catch((error) => {
                    setErrorMessage("Failed to update user.")
                    console.error(error)
                    setSaving(false)
                    return
                })

            // Check if tutor data needs to be updated
            if (currTutor) {
                // Create tutor object
                let newTutor: tutor = {
                    fk_userID: currTutor.fk_userID,
                    about_me: aboutMe,
                    profile_picture: imageURL != '' ? imageURL : null,
                    totalTutorHours: currTutor.totalTutorHours
                }

                // Update tutor
                await fetch('api/tutor', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTutor) })
                    .then((response) => response.json())
                    .then((json) => {
                        let result = json as TutorWithSubjects
                        setCurrTutor(result)
                    })
                    .catch((error) => {
                        setErrorMessage("Failed to update tutor.")
                        console.error(error)
                        setSaving(false)
                        return
                    })

                // Update subjects
                for (let i = 0; i < subjectsSelections.length; i++) {
                    // Check if subject was ticked
                    let id = newTutor.fk_userID
                    let subjectID = subjectsOptions[i].subjectID
                    // Check to see if the subject relation exists.
                    let contains = false
                    for (let j = 0; j < subjectData.length; j++) {
                        if (subjectData[j].subjectID == subjectID) {
                            contains = true
                        }
                    }
                    if (subjectsSelections[i]) {
                        // If it doesn't, it was ticked so we need to create it.
                        if (!contains) {
                            // The tutor doesn't have this relation set, so let's set it.
                            let newRelation: tutors_subjects = {
                                fk_tutorID: id,
                                fk_subjectID: subjectID
                            }

                            await fetch('api/tutor/tut_subs', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newRelation) })
                                .then((response) => response.json())
                                .then((json) => {
                                    let result = json as tutors_subjects

                                    // Update UI to match changes
                                    currTutor?.subjects?.push(result)
                                    for (let j = 0; j < subjectsOptions.length; j++) {
                                        if (subjectsOptions[j].subjectID == subjectID) {
                                            subjectData.push(subjectsOptions[j])
                                            break
                                        }
                                    }
                                })
                                .catch((error) => {
                                    setErrorMessage("Failed to update subjects.")
                                    console.error(error)
                                    setSaving(false)
                                    return
                                })
                        }
                    }
                    else {
                        // If it does, it was unticked so we need to remove it.
                        if (contains) {
                            // The tutor has this relation set, so let's delete it
                            let deletedRelation: tutors_subjects = {
                                fk_tutorID: id,
                                fk_subjectID: subjectID
                            }

                            await fetch('api/tutor/tut_subs', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(deletedRelation) })
                                .then((response) => {
                                    // Update UI to match changes
                                    const index = currTutor?.subjects?.indexOf(deletedRelation)
                                    if (index != -1)
                                        currTutor?.subjects?.splice(index, 1)
                                    for (let j = 0; j < subjectData.length; j++) {
                                        if (subjectData[j].subjectID == subjectID) {
                                            subjectData.splice(j, 1)
                                            break
                                        }
                                    }
                                })
                                .catch((error) => {
                                    setErrorMessage("Failed to update subjects.")
                                    console.error(error)
                                    setSaving(false)
                                    return
                                })
                        }
                    }
                }
            }
            setSaving(false)
            setSuccessMessage("Successfully updated Account!")
        }
    }

    const entriesValid = () => {
        // Trim entries
        let first = firstName.trim(), last = lastName.trim(), em = email.trim(), about = aboutMe.trim()

        // Reset error message, success message, and display saving loading wheel
        setErrorMessage("")
        setSuccessMessage("")
        setSaving(true)

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

    const upgradeAccount = async () => {
        if(confirm('Are you sure you want to upgrade this account to a tutor account?\n' +
                    'This cannot be reverted.')) {
            // Display loading wheel
            setSaving(true)

            // Create tutor object
            const newTutor: tutor = {
                fk_userID: userContext.currUser.userID,
                about_me: '',
                totalTutorHours: 0,
                profile_picture: null
            }

            // Make post request to create tutor
            const createdTutor = await fetch('api/tutor', {method:'POST', headers:{'Content-Type': 'application/json'}, body: JSON.stringify(newTutor)})
            .then((response) => response.json())
            .then((json) => {
                // Reload page
                setSaving(false)
                window.location.reload()
            })
            .catch((error) => {
                setErrorMessage("Failed to upgrade the user account.")
                console.error(error)
                setSaving(false)
                return
            })
        }
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

    const initiallySelectedSubject = (sub: subject) => {
        for (let i = 0; i < subjectData.length; i++) {
            if (subjectData[i].subjectID == sub.subjectID) {
                return true
            }
        }
        return false
    }

    const selectSubject = (event: React.ChangeEvent<HTMLInputElement>) => {
        let id = event.currentTarget.getAttribute('key-subid')
        for (let i = 0; i < subjectsOptions.length; i++) {
            if (subjectsOptions[i].subjectID.toString() == id) {
                subjectsSelections[i] = event.currentTarget.checked
                console.log(subjectsSelections)
            }
        }
    }

    const handleDrag = (event: React.DragEvent<any>) => {
        // prevent default & stop propagation
        event.preventDefault()
        event.stopPropagation()

        if (event.type === 'dragenter' || event.type === 'dragover') {
            //console.log('detected drag')
            setDragging(true)
        }
        else {
            //console.log('detected exit')
            setDragging(false)
        }
    }

    const handleDrop = (event: React.DragEvent<any>) => {
        // prevent default & stop propagation
        event.preventDefault()
        event.stopPropagation()
        setDragging(false)

        console.log('detected drop')
        if (event.dataTransfer.files && event.dataTransfer.files[0]) {
            // Handle files
            const file = event.dataTransfer.files[0]
            if (file.type.match('image.*')) {
                setUploadFile(file)
                setUploadPreview(URL.createObjectURL(file))
                uploadForm.current.files = event.dataTransfer.files
            }
            else {
                console.log('Incorrect File Type.')
            }
        }
    }

    const handleUpload = (event: React.FormEvent<HTMLInputElement>) => {
        if (event.currentTarget.files && event.currentTarget.files[0]) {
            // Handle files
            const file = event.currentTarget.files[0]
            if (file.type.match('image.*')) {
                setUploadFile(file)
                setUploadPreview(URL.createObjectURL(file))
            }
            else {
                console.log('Incorrect File Type.')
            }
        }
    }

    const handleFile = async () => {
        if (!uploadFile) {
            return
        }

        // Attempt to upload the file
        const data = new FormData()
        data.append('file', uploadFile)
        await axios.post(`/api/media/${currTutor.fk_userID}`, data)
            .then((response) => {
                if (response.status == 200) {
                    // Update client to reflect changes
                    setUploadDisplay(false)
                    setImageURL(response.data)
                    currTutor.profile_picture = response.data
                }
            })
            .catch((error) => {
                console.error(error)
            })
    }

    useEffect(() => {
        loadProfile()
    }, [])

    useEffect(() => {
        setUploadFile(undefined)
        setUploadPreview(undefined)
    }, [uploadDisplay])

    if (isLoading) {
        return <div className='flex justify-center'><Oval width='75' color='#9748FF' secondaryColor='#BCE3FF' /></div>
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
                                <button className='relative h-fit w-20' onClick={() => { setUploadDisplay(!uploadDisplay) }}>
                                    {currTutor &&
                                        <img src={imageURL} alt='Image Not Found' className='bg-gray-400 w-20 h-20 rounded-full object-cover' onError={({ currentTarget }) => {
                                            // Replace with empty profile picture if src image dne
                                            currentTarget.onerror = null
                                            currentTarget.src = '/emptyprofile.svg'
                                        }} />}
                                    {/* <div className='absolute bottom-1 right-1 bg-secondary rounded-full p-2'>
                                        <IoCamera className='' size='1.25rem' />
                                    </div> */}
                                </button>
                                <div className='flex flex-col'>
                                    <span className='text-primary text-lg'>{userContext?.currUser?.first_name} {userContext?.currUser?.last_name}</span>
                                    <button onClick={() => { setUploadDisplay(!uploadDisplay) }}>
                                        <span className='text-link font-bold hover:text-primary text-sm'>Change profile photo</span>
                                    </button>
                                </div>
                                <div className='flex flex-1 justify-end'>
                                    {!currTutor &&
                                    <button
                                        onClick={() => {setOptionsDisplay(!optionsDisplay)}}
                                    >
                                        <IoSettingsOutline className='' size='1.5rem' />
                                    </button>}
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
                                {currTutor &&
                                    <CommonInput
                                        innerClass='h-40'
                                        placeholder='About Me'
                                        inputType='TextArea'
                                        defaultValue={aboutMe}
                                        onChange={updateAboutMe}
                                    />}
                                <div className='w-full flex justify-between mb-2'>
                                    <div className='text-sm'>
                                        <span>Learn Hours: </span>
                                        <span className='font-bold'>{userContext.currUser.totalLearnHours}</span>
                                    </div>
                                    {currTutor && 
                                    <div className='text-sm'>
                                        <span>Tutor Hours: </span>
                                        <span className='font-bold'>{currTutor.totalTutorHours}</span>
                                    </div>}
                                </div>
                                {currTutor &&
                                    <div className='flex flex-col mb-2'>
                                        <span className='text-sm'>Subjects</span>
                                        <div className='flex gap-2'>
                                            <TagList tags={subjectData}></TagList>
                                            <button
                                                className={`hover:scale-110 transition-all opacity-50 hover:opacity-100 ${(!subjectsDisplay ? 'hover:text-red-500' : 'hover:text-green-500')}`}
                                                onClick={() => { setSubjectsDisplay(!subjectsDisplay) }}
                                            >
                                                {!subjectsDisplay && <IoPencilSharp size='1rem' /> || <IoCheckmark size='1.5rem' />}
                                            </button>
                                        </div>
                                        {subjectsDisplay &&
                                            <div className='z-10 h-0'>
                                                <div className='h-40 flex flex-col justify-start border-2 rounded border-black bg-white gap-2 mt-2 p-2 overflow-y-auto'>
                                                    <span className='text-sm'>Edit Subjects:</span>
                                                    {subjectsOptions.map((sub) => {
                                                        return (
                                                            <div key={sub.subjectID} className='flex gap-2'>
                                                                <input
                                                                    key={sub.subjectID}
                                                                    key-subid={sub.subjectID}
                                                                    type='checkbox'
                                                                    defaultChecked={initiallySelectedSubject(sub)}
                                                                    onChange={selectSubject}
                                                                />
                                                                <CommonTag name={sub.name}></CommonTag>
                                                            </div>
                                                        )
                                                    })}
                                                </div>
                                            </div>}
                                    </div>}
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
                                {!currTutor &&
                                <button
                                    className={`bg-green-500 w-fit px-4 py-1 mt-2 rounded-lg text-primary transition-all ${!optionsDisplay ? 'opacity-0' : ''}`}
                                    disabled={optionsDisplay ? false : true}
                                    onClick={upgradeAccount}
                                >
                                    Become a Tutor
                                </button>}
                                {isSaving && <div className='flex justify-center'><Oval width='75' color='#9748FF' secondaryColor='#BCE3FF' /></div>}
                                {errorMessage != '' && <span className='text-red-500 text-lg flex mt-6 justify-center w-full'>{errorMessage}</span>}
                                {successMessage != '' && <span className='text-green-500 text-lg flex mt-6 justify-center w-full'>{successMessage}</span>}
                            </div>
                        </div>
                    </div>
                    {uploadDisplay &&
                        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 h-full w-full flex justify-center items-center'>
                            <div className='relative bg-white border-2 rounded-md border-secondary shadow-lg w-[32rem] h-[26rem] flex flex-col justify-between text-center'>
                                <div className='w-full p-1 pb-0 flex justify-end'>
                                    <button onClick={() => { setUploadDisplay(false) }}>
                                        <IoClose size='2rem' className='hover:text-red-500 hover:scale-110 transition-all' />
                                    </button>
                                </div>
                                <div className='w-full flex mb-1 justify-center'>
                                    <span className='w-full justify-end font-bold'>Upload Profile Picture</span>
                                </div>
                                <div className='w-auto h-full mx-6 flex flex-col justify-center items-center'>
                                    {!uploadFile &&
                                        <>
                                            <span>Drag & drop the image below, or upload manually</span>
                                            <div className='w-full h-full border-2 border-primary'
                                                onDragEnter={handleDrag}
                                                onDragOver={handleDrag}
                                            >
                                                {isDragging &&
                                                    <div className='w-full h-full bg-primary flex justify-center items-center'
                                                        draggable='true'
                                                        onDragLeave={handleDrag}
                                                        onDrop={handleDrop}
                                                    />}
                                            </div>
                                        </>
                                        ||
                                        <>
                                            <span>Drag & drop the image below, or upload manually</span>
                                            <img className='max-h-[13.875rem] border-2 border-primary' src={uploadPreview} />
                                        </>
                                    }
                                </div>
                                <div className='w-full my-1'>
                                    <input type='file' onChange={handleUpload} multiple={false} ref={uploadForm} />
                                </div>
                                <div className='w-full mt-1 mb-6'>
                                    <button className='border-2 border-secondary px-4 py-1 bg-primary' onClick={handleFile}>Upload</button>
                                </div>
                            </div>
                        </div>
                    }
                </main>
            </>
        )
    }
}

export default AccountPage