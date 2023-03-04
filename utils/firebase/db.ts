import { RTDB, auth } from '../../service/firebaseService'
import { onValue, ref, push, child, set, get } from 'firebase/database'

/**
 * Retrieve a list of records from Firebase real-time database.
 * @param location - The database location to retrieve records from.
 * @returns A Promise that resolves with the retrieved records.
 */
export const getRecords = async (location: string): Promise<void> => {
  try {
    const itemList = ref(RTDB, location)
    await new Promise((resolve, reject) => {
      onValue(itemList, (snapshot) => {
        const data = snapshot.val()
        resolve(data)
      }, (error) => {
        console.log('READ ERR')
        console.log(error)
        reject(error)
      })
    }); return
  } catch (error) {
    console.log('failed getting records')
    console.log(error)
    await Promise.reject(error)
  }
}

/**
 * Retrieve a single record from Firebase real-time database.
 * @param location - The database location to retrieve the record from.
 * @returns A Promise that resolves with the retrieved record, or null if no record is found.
 */
export const getRecord = async (location: string): Promise<any> => {
  const dbRef = ref(RTDB, location)
  const snapshot = await get(dbRef)
  if (snapshot.exists()) {
    return snapshot.val()
  } else {
    return null
  }
}

/**
 * Update or insert a record into Firebase real-time database.
 * @param location - The database location to update or insert the record into.
 * @param data - The data of the record to update or insert.
 * @returns A Promise that resolves with a boolean indicating whether the operation was successful.
 */
export const upsertRecord = async (location: string, data: any): Promise<boolean> => {
  try {
    console.log(data)
    await set(ref(RTDB, location), data)
    const newEntryKey = push(child(ref(RTDB), location)).key as string
    const updateList: Record<string, any> = {}
    updateList['/' + location + '/' + newEntryKey] = data
    return true
  } catch (e) {
    console.log('failed updating record')
    return false
  }
}

/**
 * Delete a record from Firebase real-time database.
 * @param location - The database location to delete the record from.
 * @returns A Promise that resolves with a boolean indicating whether the operation was successful.
 */
export const deleteRecord = async (location: string): Promise<boolean> => {
  try {
    await set(ref(RTDB, String(location)), null)
    return true
  } catch (e) {
    console.log('failed deleting record')
    return false
  }
}
