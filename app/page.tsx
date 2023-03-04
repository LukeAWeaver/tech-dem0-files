import PublicAuth from '@/service/anonAuth'
import GoogleAuth from '@/service/googleAuth'

export default function AppEntryPoint (): any {
  return (
    <div>
    <GoogleAuth/>
    <PublicAuth/>
  </div>
  )
}
