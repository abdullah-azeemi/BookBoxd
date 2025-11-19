'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Bell, BookOpen, Send } from 'lucide-react'
import Link from "next/link"
import Image from "next/image"

export default function AdvancedSearchPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: "Hello! I'm here to help you find your next great read. What kind of book are you in the mood for today?"
    }
  ])
  const [userInput, setUserInput] = useState('')

  const handleQuickReply = (text) => {
    setMessages([...messages, { id: messages.length + 1, type: 'user', text }])
  }

  const handleSendMessage = () => {
    if (userInput.trim()) {
      setMessages([...messages, { id: messages.length + 1, type: 'user', text: userInput }])
      setUserInput('')
      // Simulate AI response
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          type: 'ai',
          text: "Excellent choice! Do you prefer a story with a supernatural twist, or one that's purely a detective procedural?"
        }])
      }, 500)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-900">

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl flex flex-col h-[calc(100vh-120px)] bg-white dark:bg-slate-800 rounded-2xl border-2 border-blue-200 dark:border-blue-900 shadow-lg p-6">
          {/* Chat Messages */}
          <div className="flex-grow overflow-y-auto mb-8 space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 h-8 w-8 rounded-full ${message.type === 'ai' ? 'bg-blue-100 dark:bg-blue-900 flex items-center justify-center' : 'bg-slate-300 dark:bg-slate-600'}`}>
                    {message.type === 'ai' && (
                      <BookOpen className="h-5 w-5 text-blue-500" />
                    )}
                  </div>
                  
                  {/* Message */}
                  <div className={`max-w-md ${message.type === 'ai' ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white rounded-3xl' : 'bg-blue-500 text-white rounded-3xl'} px-4 py-3`}>
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Quick Reply Options */}
            {messages.length === 1 && (
              <div className="mt-8 space-y-3 flex justify-start">
                <div className="space-y-2">
                  <Button
                    onClick={() => handleQuickReply("Supernatural Twist")}
                    variant="outline"
                    className="block w-full text-left justify-start text-blue-500 border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800"
                  >
                    Supernatural Twist
                  </Button>
                  <Button
                    onClick={() => handleQuickReply("Detective Procedural")}
                    variant="outline"
                    className="block w-full text-left justify-start text-blue-500 border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800"
                  >
                    Detective Procedural
                  </Button>
                  <Button
                    onClick={() => handleQuickReply("Surprise Me!")}
                    variant="outline"
                    className="block w-full text-left justify-start text-blue-500 border-blue-500 hover:bg-blue-50 dark:hover:bg-slate-800"
                  >
                    Surprise Me!
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="relative border-t border-slate-200 dark:border-slate-700 pt-4">
            <Input
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Describe your perfect book..."
              className="w-full pr-12 pl-4 py-3 rounded-full border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={handleSendMessage}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-slate-600 rounded-full transition-colors"
            >
              <Send className="h-5 w-5 position-align-middle" />
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
