import { type AuthenticatedUser, newUser } from '@/utils/firebase/userOperations'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<NextApiResponse<any>> {
  const { method, body } = req

  switch (method) {
    case 'POST': {
      const user: AuthenticatedUser = JSON.parse(body)
      const firebaseRes = await newUser(user)
      res.status(200).json(firebaseRes)
      return res
    }
    default: {
      res.status(405).json({ message: 'Method Not Allowed' })
      return res
    }
  }
}
