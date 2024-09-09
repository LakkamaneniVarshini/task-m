'use client'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function UserPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return <p>Loading...</p>
  }

  if (!session) {
    return <p>Please sign in to access this page.</p>
  }

  const { user } = session
  const avatar = user?.image ? user.image : `https://ui-avatars.com/api/?name=${user?.name || ''}`

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push('/') 
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">User Information</h1>
      <div className="flex items-center mt-4">
        <img 
          src={avatar} 
          alt="Profile Picture" 
          className="w-16 h-16 rounded-full"
        />
        <div className="ml-4">
          <p className="text-lg font-semibold">{user?.name}</p>
          <p className="text-gray-600">{user?.email}</p>
        </div>
      </div>
      <button 
        onClick={() => router.push('/chat')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded shadow-lg"
      >
        Chat Now
      </button>
      <button 
        onClick={handleSignOut}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded shadow-lg"
      >
        Sign Out
      </button>
    </div>
  )
}
