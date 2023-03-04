import type { NextApiRequest, NextApiResponse } from 'next'
import { newOrder, deleteOrder, getOrders, type Order } from '@/utils/firebase/orderOperations'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { method, query, body } = req
  switch (method) {
    case 'GET': {
      const { uid } = query
      const uidString = typeof uid === 'string' ? uid : ''
      const firebaseRes = await getOrders(uidString)
      res.setHeader('Cache-Control', 'no-store')
      res.status(200).json(firebaseRes)
      break
    }
    case 'POST':{
      const order: Order = JSON.parse(body)
      const firebaseRes = await newOrder(order)
      res.status(200).json(firebaseRes)
      break
    }
    case 'DELETE': {
      const { uid } = body
      console.log(uid)
      const dataString = typeof uid === 'string' ? uid : ''
      const deleteRes = await deleteOrder(dataString)
      res.status(200).json(deleteRes)
      break
    }
    default:
      res.status(405).end(`method ${method ?? 'undefined'} not allowed`)
      break
  }
}
