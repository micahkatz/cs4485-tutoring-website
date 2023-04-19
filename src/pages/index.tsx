import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import NavBar from '../components/NavBar'
import ActionPanel from '../components/ActionPanel'
import TutorFeed from '../components/TutorFeed'
import TutorCard from '@/components/TutorCard'
import SearchBar from '@/components/SearchBar'
import { subject } from '@prisma/client'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [nameFilter, setNameFilter] = React.useState<string>("")
  const [subjectFilter, setSubjectFilter] = React.useState<string>("")
  const [dayFilter, setDayFilter] = React.useState<Date>()
  const [hoursFilter, setHoursFilter] = React.useState<Date>()

  return (
    <>
      <Head>
        <title>Tutor.io</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <NavBar />
        <ActionPanel />
        <div className='p-4 flex flex-col items-center'>
          <SearchBar setName={setNameFilter} setSubject={setSubjectFilter} setDay={setDayFilter} setHours={setHoursFilter}/>
          <TutorFeed filterName={nameFilter} filterSubject={subjectFilter} filterDay={dayFilter} filterHours={hoursFilter}/>
        </div>
      </main>
    </>
  )
}
