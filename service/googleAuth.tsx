'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithPopup, type User } from 'firebase/auth'
import 'firebase/auth'
import { Button } from '@mui/material'
import { auth, googleProvider } from '@/service/firebaseService'

const GoogleAuth = (): JSX.Element => {
  const router = useRouter()

  const signInWithGoogle = async (): Promise<User> => {
    const res = await signInWithPopup(auth, googleProvider)
    const user: User = res.user

    try {
      const response = await fetch('/api/googleAuth', {
        method: 'POST',
        body: JSON.stringify(user)
      })
      const data = await response.json()
      console.log(data)
      return user
    } catch (err: any) {
      console.error(err?.message)
      return { displayName: 'LUKE_NOT_AUTH' } as unknown as User
    }
  }

  const wrapper = async (): Promise<void> => {
    const User: User = (await signInWithGoogle())
    console.log('User', User)
    router.push(`/OrderBook/${User.uid ?? 'dummyUid'}`)
  }

  return (
    <Suspense>
      <Button variant="contained" size="large" onClick={() => { void wrapper() }}>
        Login with Google
      </Button>
    </Suspense>
  )
}

export default GoogleAuth
