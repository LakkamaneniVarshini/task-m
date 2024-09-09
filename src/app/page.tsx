'use client'
import { signIn } from "next-auth/react"
export default function Home() {
  return (
    <button onClick={()=>signIn('google', { callbackUrl: '/user' })}className=" flex items-center shadow-xl">
      Sign in with Google
    </button>
  )
}
