import React, { useEffect, ChangeEvent, MouseEventHandler } from 'react'
import Link from 'next/link'
import { IoChevronBack, IoChevronDown, IoSearch, IoReload } from 'react-icons/io5'
import { subject } from '@prisma/client'

type Props = {
    setName: React.Dispatch<React.SetStateAction<string>>;
    setSubject: React.Dispatch<React.SetStateAction<string>>;
    setDay: React.Dispatch<React.SetStateAction<Date | undefined>>;
    setHour: React.Dispatch<React.SetStateAction<Date | undefined>>;
    subject: string
    day: Date | undefined
    hour: Date | undefined
}

const SearchBar = (props: Props) => {
    const [isLoading, setLoading] = React.useState<boolean>(true)
    const [subjectsOptions, setSubjectsOptions] = React.useState<subject[]>([])
    const [daysOptions, setDaysOptions] = React.useState<Date[]>([])
    const [hoursOptions, setHoursOptions] = React.useState<Date[]>([])
    const [subjectDisplay, setSubjectDisplay] = React.useState<boolean>(false)
    const [dayDisplay, setDayDisplay] = React.useState<boolean>(false)
    const [hourDisplay, setHourDisplay] = React.useState<boolean>(false)
    const [filtersApplied, setFiltersApplied] = React.useState<boolean>(false)
    const setName = props.setName, setSubject = props.setSubject, setDay = props.setDay, setHour = props.setHour
    const subject = props.subject, day = props.day, hour = props.hour
    let nameInput = React.createRef<HTMLInputElement>()

    const fetchSubjects = async () => {
        await fetch('api/subject', {method: 'GET'})
        .then((resp) => resp.json())
        .then((json) => {
            // read json as tutor array
            const result = json as subject[]
            
            // Check if tutor data is not undefined
            if(result) {
                // Update data state
                setSubjectsOptions(result)

                // No longer loading
                setLoading(false)
            }
        })
        .catch((error) => {
            setSubjectsOptions([])
            setLoading(false)
            console.error('error loading subject data')
            return
        })
    }

    const fetchDays = async () => {
        // Load current day and the 6 days following it
        let currentDate: Date = new Date()
        let currentDay: number = currentDate.getDay()
        let dates: Date[] = [currentDate]
        for( let i = 1; i < 7; i++ ) {
            let newDate = new Date(currentDate)
            newDate.setDate(newDate.getDate()+i)
            dates.push(newDate)
        }
        setDaysOptions(dates)
    }

    const fetchHours = async () => {
        // Load current hour and each hour following it.
        let currentDate: Date = new Date()
        let currentTime: number = currentDate.getHours()
        let dates: Date[] = []
        for( let i = 1; i < 23; i++ ) {
            let newDate = new Date(currentDate)
            newDate.setHours(newDate.getHours()+i)
            dates.push(newDate)
        }
        setHoursOptions(dates)
    }

    const updateName = (event: React.ChangeEvent<HTMLElement>) => {
        let target = event.target as HTMLInputElement
        setName(target.value)
    }

    const updateSubject = (event: React.MouseEvent<HTMLElement>) => {
        toggleSubjectDisplay()
        let target = event.target as HTMLButtonElement
        //console.log("Subject Key:", target.getAttribute('key-subjectid'))
        let id = target.getAttribute('key-subjectid')
        if(id) {
            // parse id string to int
            let id_num = parseInt(id)
            for(let i = 0; i < subjectsOptions.length; i++) {
                if(subjectsOptions[i].subjectID == id_num) {
                    setSubject(subjectsOptions[i].name)
                    return
                }
            }
        }
        else {
            console.error('error updating subject')
            return
        }
        console.error('Could not find subject ID', id)
    }

    const updateDay = (event: React.MouseEvent<HTMLElement>) => {
        toggleDayDisplay()
        let target = event.target as HTMLInputElement
        //console.log("Day Key:", target.getAttribute('key-dayid'))
        let id = target.getAttribute('key-dayid')
        if(id) {
            let id_num = parseInt(id)
            for(let i = 0; i < daysOptions.length; i++) {
                if(daysOptions[i].getTime() == id_num) {
                    setDay(daysOptions[i])
                    return
                }
            }
        }
        else {
            console.error('error updating day')
            return
        }
        console.error('Could not find day ID', id)
    }
    
    const updateHour = (event: React.MouseEvent<HTMLElement>) => {
        toggleHourDisplay()
        let target = event.target as HTMLInputElement
        //console.log("Hour Key:", target.getAttribute('key-hourid'))
        let id = target.getAttribute('key-hourid')
        if(id) {
            let id_num = parseInt(id)
            for(let i = 0; i < hoursOptions.length; i++) {
                if(hoursOptions[i].getHours() == id_num) {
                    setHour(hoursOptions[i])
                    return
                }
            }
        }
        else {
            console.error('error updating hour')
            return
        }
        console.error('Could not find hour ID', id)
    }

    const formatDay = (date: Date) => {
        return date.toDateString().substring(0, date.toDateString().lastIndexOf(" "));
    }
    
    const formatHour = (date: Date) => {
        // Build time string
        let time: number = date.getHours()
        let time_string = time >= 12 ? (time == 12 ? 12 : time-12) + " PM" : (time == 0 ? 12 : time) + " AM"

        // Build time zone abbreviation string
        let time_string_alt = date.toTimeString()
        let time_zone_full = time_string_alt.substring(time_string_alt.lastIndexOf("(")+1, time_string_alt.lastIndexOf(")"))
        let time_zone_abbreviated = ""
        time_zone_full.split(" ").forEach(word => {
            time_zone_abbreviated += word.charAt(0)
        })

        // Return concatenation of both
        return time_string + " " + time_zone_abbreviated
    }

    const resetSearch = () => {
        // Reset name, clear text input
        setName("")
        if(nameInput.current)
            nameInput.current.value = ""
        
        // Reset everything else
        setSubject("")
        setDay(undefined)
        setHour(undefined)
    }

    const toggleSubjectDisplay = () => {
        setSubjectDisplay(!subjectDisplay)
    }

    const toggleDayDisplay = () => {
        setDayDisplay(!dayDisplay)
    }

    const toggleHourDisplay = () => {
        setHourDisplay(!hourDisplay)
    }

    useEffect(() => {
        fetchSubjects()
        fetchDays()
        fetchHours()
    }, [])

    useEffect(() => {
        setFiltersApplied((nameInput.current && nameInput.current.value != '') || subject != '' || day != undefined || hour != undefined)
    }, [nameInput, subject, day, hour])

    if(isLoading) {
        return <></>
    }
    else {
        return (
            <div className='flex'>
                <div className='my-2 gap-2 grid grid-cols-3 sm:grid-cols-5 items-start'>
                    <div className='bg-gray-400 rounded-sm px-2 py-1 flex gap-2 items-center col-span-3 sm:col-span-2'>
                        <IoSearch className='min-w-[1rem]' />
                        <input
                            className='placeholder-black text-sm bg-transparent truncate w-full'
                            placeholder='Search Tutors'
                            onChange={updateName}
                            ref={nameInput}
                        >
                        </input>
                    </div>
                    <div className='rounded-sm gap-2'>
                        <button className='bg-gray-400 flex items-center justify-between w-full h-full px-2 py-1' onClick={toggleSubjectDisplay}>
                            <span className='text-sm truncate items-center'>{subject != "" && subject || ('Subject')}</span>
                            {!subjectDisplay && (
                                <IoChevronDown className='min-w-[1rem]' />
                            ) || (<IoChevronBack className='min-w-[1rem]' />)}
                        </button>
                        {subjectDisplay && (
                        <ul className='w-full'>
                            {subjectsOptions.map(subject => (
                                <li key={subject.subjectID} className='text-center mt-1 bg-secondary border-white border-2 hover:border-black transition-colors'><button key={subject.subjectID} key-subjectid={subject.subjectID} onClick={updateSubject} className='w-full h-full'>{subject.name}</button></li>
                            ))}
                        </ul>)}
                    </div>
                    <div className='rounded-sm gap-2'>
                        <button className='bg-gray-400 flex items-center justify-between w-full h-full px-2 py-1' onClick={toggleDayDisplay}>
                            <span className='text-sm truncate'>{day != undefined && formatDay(day) || ('Day')}</span>
                            {!dayDisplay && (
                                <IoChevronDown className='min-w-[1rem]' />
                            ) || (<IoChevronBack className='min-w-[1rem]' />)}
                        </button>
                        {dayDisplay && (
                        <ul className='w-full'>
                            {daysOptions.map(date => (
                                <li key={date.getTime()} className='text-center mt-1 bg-secondary border-white border-2 hover:border-black transition-colors'><button key={date.getTime()} key-dayid={date.getTime()} onClick={updateDay} className='w-full h-full'>{formatDay(date)}</button></li>
                            ))}
                        </ul>)}
                    </div>
                    <div className='rounded-sm gap-2'>
                        <button className='bg-gray-400 flex items-center justify-between w-full h-full px-2 py-1' onClick={toggleHourDisplay}>
                            <span className='text-sm truncate'>{hour != undefined && formatHour(hour) || ('Hour')}</span>
                            {!hourDisplay && (
                                <IoChevronDown className='min-w-[1rem]' />
                            ) || (<IoChevronBack className='min-w-[1rem]' />)}
                        </button>
                        {hourDisplay && (
                        <ul className='w-full'>
                            {hoursOptions.map(date => (
                                <li key={date.getHours()} className='text-center mt-1 bg-secondary border-white border-2 hover:border-black transition-colors'><button key={date.getHours()} key-hourid={date.getHours()} onClick={updateHour} className='w-full h-full'>{formatHour(date)}</button></li>
                            ))}
                        </ul>)}
                    </div>
                </div>
                {filtersApplied && <div className='mt-8 sm:mt-[0.8rem] md:mt-[0.85rem] ml-4 items-start'>
                    <IoReload onClick={resetSearch} className='text-base text-red-500 font-bold opacity-50 hover:opacity-100 hover:scale-125 transition-all' cursor={'pointer'}/>
                </div>}
            </div>
        )
    }
}

export default SearchBar