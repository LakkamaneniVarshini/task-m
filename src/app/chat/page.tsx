'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface Message {
  id: number
  text: string
  sender: string
  profilePic: string
  timestamp: string
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [editId, setEditId] = useState<number | null>(null)
  const [editedText, setEditedText] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (!session) router.push('/')
  }, [status, session, router])

  useEffect(() => {
    try {
      const savedMessages = localStorage.getItem('chatMessages')
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages))
      }
    } catch (error) {
      console.error('Failed to load messages from localStorage:', error)
    }
  }, [])


  useEffect(() => {
    if (messages.length > 0) {
      try {
        localStorage.setItem('chatMessages', JSON.stringify(messages))
      } catch (error) {
        console.error('Failed to save messages to localStorage:', error)
      }
    }
  }, [messages])

 
  const handleSend = () => {
    if (input.trim() && session) {
      const newMessage: Message = {
        id: Date.now(), 
        text: input,
        sender: session.user?.name || 'User', 
        profilePic: session.user?.image || 'https://ui-avatars.com/api/?name=User',
        timestamp: new Date().toLocaleTimeString(),
      }
      const updatedMessages = [...messages, newMessage]
      setMessages(updatedMessages)
      setInput('')
    }
  }

  const handleEdit = (id: number) => {
    const messageToEdit = messages.find((msg) => msg.id === id)
    if (messageToEdit) {
      setEditId(id)
      setEditedText(messageToEdit.text)
    }
  }


  const handleSaveEdit = () => {
    const updatedMessages = messages.map((msg) =>
      msg.id === editId ? { ...msg, text: editedText } : msg
    )
    setMessages(updatedMessages)
    setEditId(null)
    setEditedText('')
  }

  
  const handleDelete = (id: number) => {
    const updatedMessages = messages.filter((msg) => msg.id !== id)
    setMessages(updatedMessages)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Chat Interface</h1>
      <div className="border border-gray-300 rounded mt-4 p-2 h-96 overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg.id} className="relative mb-2 p-2 bg-gray-100 rounded hover:bg-gray-200 group">
            <div className="flex items-center">
              <img 
                src={msg.profilePic} 
                alt="Profile Picture" 
                className="w-8 h-8 rounded-full"
              />
              <div className="ml-3 flex-grow">
                <p className="text-sm font-semibold">{msg.sender}</p>
                {editId === msg.id ? (
                  <textarea
                    value={editedText}
                    onChange={(e) => setEditedText(e.target.value)}
                    className="border border-gray-300 p-2 rounded w-full"
                  />
                ) : (
                  <p className="text-sm">{msg.text}</p>
                )}
                <p className="text-xs text-gray-500">{msg.timestamp}</p>
              </div>
              {editId === msg.id ? (
                <div className="absolute right-2 top-2 flex space-x-2">
                  <button onClick={handleSaveEdit} className="text-blue-500">Save</button>
                  <button onClick={() => setEditId(null)} className="text-gray-500">Cancel</button>
                </div>
              ) : (
                <div className="absolute right-2 top-2 flex space-x-2 opacity-0 group-hover:opacity-100">
                  <button onClick={() => handleEdit(msg.id)} className="text-blue-500">Edit</button>
                  <button onClick={() => handleDelete(msg.id)} className="text-red-500">Delete</button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex mt-4">
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-grow border border-gray-300 p-2 rounded-l"
        />
        <button 
          onClick={handleSend}
          className="bg-blue-500 text-white px-4 rounded-r"
        >
          Send
        </button>
      </div>
    </div>
  )
}
