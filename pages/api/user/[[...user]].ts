import { getUser } from '@/utils/firebase/userOperations'
import type { NextApiRequest, NextApiResponse } from 'next'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export default async function handler (req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req
  switch (method) {
    case 'GET': {
      const { user } = query
      const firebaseRes = await getUser(user?.[0] ?? '')
      res.status(200).json(firebaseRes)
      break
    }

    default:
      res.status(405).end(`method ${method ?? 'undefined'} not allowed`)
      break
  }
}
