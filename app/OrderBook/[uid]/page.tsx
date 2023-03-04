'use client'
/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState, useEffect } from 'react'
import OrderForm, { type OrderFormData } from '@/app/OrderBook/[uid]/OrderForm'
import OrderHistory from '@/app/OrderBook/[uid]/OrderHistory'
import { Paper, Button, Typography } from '@mui/material'
import { useRouter } from 'next/navigation'
import { type AuthenticatedUser } from '@/utils/firebase/userOperations'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import { auth } from '@/service/firebaseService'

const OrderBookWrapper: any = (params: any) => {
  const [showModal, setShowModal] = useState(false)
  const [currentUser, setCurrentUser] = useState({} as unknown as AuthenticatedUser)
  const router = useRouter()
  const { uid } = params.params
  const user = auth.currentUser
  console.log('CURRENT USER', user)
  useEffect(() => {
    void fetch('/api/user/' + String(uid), {
      method: 'GET'
    })
      .then(async response => await response.json())
      .then(data => {
        console.log(data)
        setCurrentUser(data)
        handleCloseModal()
      })
  }, [uid])

  if (typeof uid === 'undefined') {
    console.log('loading..')
    return (<div>loading..</div>)
  }

  const handleCloseModal = (): any => {
    setShowModal(false)
  }

  const toggleModal = (): void => {
    setShowModal(!showModal)
  }

  const logoutModal = async (): Promise<void> => {
    const msg = 'Are you sure you want to logout?'
    confirmAlert({
      title: 'Confirm action',
      message: msg,
      buttons: [
        {
          label: 'Confirm',
          onClick: () => {
            router.back()
          }
        },
        {
          label: 'Cancel'
        }
      ]
    })
  }

  async function formSubmit (data: OrderFormData): Promise<void> {
    data.uid = uid
    await fetch('/api/order', {
      method: 'POST',
      body: JSON.stringify(data)
    })
      .then(async response => await response.json())
      .then(data => {
        console.log(data)
        handleCloseModal()
      })
  }

  async function onSubmit (data: OrderFormData): Promise<void> {
    console.log(data.tradeType === 'Dollars')
    const msgFrag1 = ('Are you sure you want to ' + data.type + ' ')
    const msgFrag2 = data.tradeType === 'Dollars'
      ? ('$' + String(data.price) + ' of ' + data.symbol + '?')
      : (String(data.quantity) + ' of ' + data.symbol + '?')

    console.log(msgFrag1, msgFrag2)
    const msg = msgFrag1 + msgFrag2
    confirmAlert({
      title: 'Confirm action',
      message: msg,
      buttons: [
        {
          label: 'Confirm',
          onClick: () => {
            void formSubmit(data)
          }
        },
        {
          label: 'Cancel'
        }
      ]
    })
  }

  return (
  <>
      <Typography>
        Welcome {currentUser?.name},
      </Typography>
      {showModal && <OrderForm isShowing={showModal} onClose={handleCloseModal} onSubmit={onSubmit}/>}
      <Paper elevation={3} style={{ padding: '16px' }}>
          <Button variant="contained" color="primary" onClick={toggleModal}>
            New Order
          </Button>
          <Button variant="contained" color="primary" onClick={logoutModal}>
            Logout
          </Button>
      </Paper>
      <OrderHistory uid={uid}/>
  </>
  )
}

export default OrderBookWrapper
