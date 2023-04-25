import React from 'react'
import Head from 'next/head'
import Image from 'next/image'
import { Inter } from '@next/font/google'
import NavBar from '../components/NavBar'
import { useRouter } from 'next/router'
import CommonTag from '@/components/tag/CommonTag'
import TagList from '@/components/tag/TagList'
import CommonInput from '@/components/CommonInput'
import { IoCamera } from 'react-icons/io5'
import { UserContext } from '@/context/userContext'

type Props = {}

const LoginPage = (props) => {
  const router = useRouter()
  const userContext = React.useContext(UserContext)
  const { tutorId } = router.query
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [errorText, setErrorText] = React.useState('')

  const onLogin = async () => {
    console.log('logging in')
    const res = await userContext?.login(email, password)

    if (res?.error) {
      setErrorText(res.error.msg)
    } else if (res.user) {
      setErrorText('')
      console.log(res.user)
    }
  }

  return (
    <>
      <Head>
        <title>Log In</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <NavBar />
        <div className='p-4'>
          <div className='max-w-[40rem] m-auto'>
            <h1 className='font-bold text-2xl mb-2'>Login</h1>
            <CommonInput
              placeholder='Email'
              type='email'
              value={email}
              onChange={(evt) => setEmail(evt.target.value)}
            />
            <CommonInput
              placeholder='Password'
              type='password'
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
            />
            {/* <CommonInput
              innerClass='h-40'
              placeholder='About Me'
              inputType='TextArea'
            /> */}
            <button
              className='bg-primary w-fit px-4 py-1 mt-2 text-inverted rounded-lg'
              onClick={onLogin}
            >
              Login
            </button>
            {errorText && <div className='mt-4'><span className='text-red-500'>{errorText}</span></div>}
          </div>
        </div>
      </main>
    </>
  )
}

export default LoginPage