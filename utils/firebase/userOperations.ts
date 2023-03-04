import { upsertRecord, getRecord } from './db'
import { type User } from 'firebase/auth'
export interface AuthenticatedUser {
  uid?: string
  name: string
  authProvider: string
  email: string
}

export const newUser = async (newUser: User): Promise<boolean> => {
  const location = 'users/' + (newUser.uid?.toString() ?? 'dummyUid')
  const result = await upsertRecord(location, newUser)
  return result
}
export const getUser = async (uid: string): Promise<User> => {
  const result = await getRecord('users/' + uid) as unknown as User
  return result
}
