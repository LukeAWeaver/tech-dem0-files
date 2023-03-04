'use client'

import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, TablePagination } from '@mui/material'
import { useState, useEffect } from 'react'
import { ref, onValue } from 'firebase/database'
import { RTDB } from '../../../service/firebaseService'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface IOrderHistory {
  uid: string
}
interface OrderRequest {
  symbol: string
  tradeType: string
  type: string
  quantity: number
  price: number
  expirationDate: string
  goodUntilCanceled: boolean
}

/**
Displays order history table with the option to cancel orders
@param props - Component props
@param {string} props.uid - User ID for fetching orders
@returns {JSX.Element} - React component
*/
const OrderHistory: React.FC<any> = (props: IOrderHistory) => {
  const [quoteData, setQuoteData] = useState<Record<string, OrderRequest>>({})
  const [page, setPage] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(10)

  const { uid } = props
  useEffect(() => {
    console.log('fetching orders..')
    void getOrders(uid)
  }, [uid])

  const handleChangePage = (event: unknown, newPage: number): void => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  /**
  Fetches order history from Firebase for the current user
  @param {string} uid - User ID for fetching orders
  @returns {Promise<void>} - Resolves with the order data from Firebase
  */
  const getOrders = async (uid: string): Promise<void> => {
    console.log('GetOrder uid', uid)
    try {
      const orders = ref(RTDB, 'orders/' + uid)
      await new Promise((resolve, reject) => {
        onValue(orders, (snapshot) => {
          const data = snapshot.val()
          setQuoteData(data)
          toast('new order detected')
          resolve(data)
        }, (error) => {
          toast('READ ERR')
          console.log(error)
          reject(error)
        })
      }); return
    } catch (error) {
      toast('READ ERR')
      console.log(error)
      await Promise.reject(error)
    }
  }

  if (quoteData === undefined || quoteData === null || Object.keys(quoteData).length === 0) {
    return null
  }

  /**
  Cancels an order with the given key
  @param {string} key - The key of the order to cancel
  @returns {Promise<void>} - Resolves when the order has been canceled or rejects if the order could not be canceled
  */
  async function cancelOrder (key: string): Promise<void> {
    const data = { uid: uid + '/' + key }
    const response = await fetch('/api/order', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    if (response.status === 200) {
      toast('Order Canceled')
    } else {
      toast('Failed to cancel order')
    }
  }

  return (<>
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Symbol</TableCell>
            <TableCell>Trade Type</TableCell>
            <TableCell>Type</TableCell>
            <TableCell>Quantity</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Expiration Date</TableCell>
            <TableCell>Good Until Canceled</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(quoteData).map((key: string) => {
            const order = quoteData[key]
            return (
              <TableRow key={`${uid}/${key}`}>
                <TableCell>
                  <Button onClick={() => { void cancelOrder(key) }} color="primary">
                    Cancel
                </Button>
                </TableCell>
                <TableCell>{order.symbol}</TableCell>
                <TableCell>{order.tradeType}</TableCell>
                <TableCell>{order.type}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>{order.price}</TableCell>
                <TableCell>{order.expirationDate}</TableCell>
                <TableCell>{order.goodUntilCanceled ? 'Yes' : 'No'}</TableCell>
              </TableRow>
            )
          })}
        </TableBody>

      </Table>
      {/* TablePagination WIP */}
      <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={Object.keys(quoteData).length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
    </TableContainer>
    <ToastContainer />
    </>
  )
}

export default OrderHistory
