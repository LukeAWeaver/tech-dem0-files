'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@mui/material'
import { auth } from '@/service/firebaseService'
import { signInAnonymously } from 'firebase/auth'
const PublicAuth = (): JSX.Element => {
  const router = useRouter()

  async function signIn (): Promise<void> {
    try {
      const userCredential = await signInAnonymously(auth)
      router.push('/OrderBook/dummyUid')
      console.log(userCredential)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <>
      <Button variant="outlined" size="large" className="login__btn login__google" onClick={() => { void signIn() }}>
            Use Public Acc
      </Button>
    </>
  )
}

export default PublicAuth
