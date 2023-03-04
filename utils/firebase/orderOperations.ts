import { upsertRecord, deleteRecord, getRecords } from './db'

export interface Order {
  uid: string
  expirationDate: Date
  goodUntilCanceled: false
  price: number
  quantity: number
  symbol: string
  tradeType: string
  type: string
}

export const getOrders = async (uid: string): Promise<boolean> => {
  try {
    await getRecords(uid)
    return true
  } catch {
    console.log('failed to get orders')
    return false
  }
}

export const newOrder = async (order: Order): Promise<boolean> => {
  console.log('uid')
  console.log(order.uid)
  if (order.uid === undefined) {
    return false
  }
  try {
    const location = 'orders/' + order.uid.toString() + '/' + new Date().getTime().toString()
    console.log('location')
    console.log(location)
    const result = await upsertRecord(location, order)
    return result
  } catch (err: any) {
    console.log('failed to create new order')
    return false
  }
}

export const deleteOrder = async (orderLocation: string): Promise<boolean> => {
  try {
    const location = 'orders/' + orderLocation
    return await deleteRecord(location)
  } catch (e) {
    console.log('failed to create order')
    return false
  }
}
