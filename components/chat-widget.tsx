"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  ChevronDown,
  ChevronUp,
  Phone,
  FileText,
  Package,
  BarChart3
} from "lucide-react"

interface ChatMessage {
  id: string
  type: 'user' | 'bot'
  message: string
  timestamp: Date
  isQuickSelect?: boolean
}

interface QuickSelectOption {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  action: () => void
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [hasShownGreeting, setHasShownGreeting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Analytics logging function
  const logChatEvent = (event: string, data?: any) => {
    // In production, integrate with your analytics service (Google Analytics, Mixpanel, etc.)
    console.log('Chat Event:', event, data)
    
    // Example: Google Analytics 4 event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, {
        event_category: 'chat',
        event_label: data?.label || '',
        value: data?.value || 0
      })
    }
  }

  // Quick select options
  const quickSelectOptions: QuickSelectOption[] = [
    {
      id: 'package',
      label: 'Which package is right for me?',
      icon: Package,
      action: () => handleQuickSelect('package')
    },
    {
      id: 'case-studies',
      label: 'Show me case studies',
      icon: BarChart3,
      action: () => handleQuickSelect('case-studies')
    },
    {
      id: 'strategy-call',
      label: 'Book a strategy call',
      icon: Phone,
      action: () => handleQuickSelect('strategy-call')
    }
  ]

  // Handle quick select option clicks
  const handleQuickSelect = (optionId: string) => {
    const option = quickSelectOptions.find(opt => opt.id === optionId)
    if (!option) return

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: option.label,
      timestamp: new Date(),
      isQuickSelect: true
    }

    setMessages(prev => [...prev, userMessage])
    logChatEvent('quick_select_clicked', { option: optionId, label: option.label })

    // Simulate bot response
    setIsTyping(true)
    setTimeout(() => {
      const botResponse = getBotResponse(optionId)
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: botResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
      logChatEvent('bot_response_sent', { option: optionId })
    }, 1500)
  }

  // Get bot response based on quick select option
  const getBotResponse = (optionId: string): string => {
    switch (optionId) {
      case 'package':
        return "Great question! I'd recommend starting with our Entry Plan at $1,500/month if you're a small business, or the Growth AI System at $3,500/month if you're ready to scale fast. Would you like me to show you a detailed comparison?"
      case 'case-studies':
        return "I'd love to show you our success stories! We've helped businesses achieve 340% revenue growth, 45% conversion increases, and save 25+ hours per week. Let me take you to our case studies section."
      case 'strategy-call':
        return "Perfect! I can help you book a free strategy session with our AI experts. This 30-minute call will show you exactly how AI can grow your business. Let me get that scheduled for you."
      default:
        return "I'm here to help! What would you like to know about our AI automation solutions?"
    }
  }

  // Show proactive greeting after a delay
  useEffect(() => {
    if (!hasShownGreeting && !isOpen) {
      const timer = setTimeout(() => {
        setHasShownGreeting(true)
        logChatEvent('proactive_greeting_shown')
      }, 3000) // Show after 3 seconds

      return () => clearTimeout(timer)
    }
  }, [hasShownGreeting, isOpen])

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  // Handle sending messages
  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      message: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    logChatEvent('message_sent', { message_length: inputValue.length })
    setInputValue("")

    // Simulate bot response
    setIsTyping(true)
    setTimeout(() => {
      const botResponse = getGeneralBotResponse(inputValue)
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'bot',
        message: botResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botMessage])
      setIsTyping(false)
      logChatEvent('bot_response_sent', { user_message: inputValue })
    }, 1000)
  }

  // Get general bot response for user messages
  const getGeneralBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase()
    
    if (message.includes('pricing') || message.includes('price') || message.includes('cost')) {
      return "Our packages start at $1,500/month for the Entry Plan, $3,500/month for Growth AI System, and $5,000+/month for Elite AI System. All include our 90-day ROI guarantee. Would you like to see detailed pricing?"
    }
    
    if (message.includes('case study') || message.includes('success') || message.includes('results')) {
      return "We've helped businesses achieve amazing results! One client increased revenue by 340% in 4 months, another saved 25 hours per week, and many see 45%+ conversion increases. Would you like to see specific case studies?"
    }
    
    if (message.includes('book') || message.includes('call') || message.includes('meeting') || message.includes('consultation')) {
      return "I'd love to help you book a free strategy session! Our AI experts will show you exactly how to grow your business. Let me get that scheduled for you right away."
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
      return "Hi there! 👋 I'm here to help you discover how AI can grow your business. What would you like to know about our automation solutions?"
    }
    
    return "That's a great question! I'm here to help you understand how our AI automation solutions can grow your business. Could you tell me more about what you're looking for?"
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  // Toggle chat
  const toggleChat = () => {
    setIsOpen(!isOpen)
    logChatEvent('chat_toggled', { is_open: !isOpen })
  }

  // Scroll to section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      logChatEvent('section_navigation', { section: sectionId })
    }
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
        <Button
          onClick={toggleChat}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-white shadow-2xl hover:shadow-green-500/25 transition-all duration-300 hover:scale-110"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
        
        {/* Proactive Greeting Bubble - Desktop */}
        {!isOpen && hasShownGreeting && (
          <div className="absolute bottom-16 right-0 mb-2 animate-fade-in hidden sm:block">
            <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white p-4 rounded-2xl shadow-2xl max-w-xs border border-gray-200 dark:border-gray-700">
              <p className="text-sm font-medium mb-2">Hi 👋 Want to see how AI can grow your business? Ask me anything!</p>
              <div className="flex justify-end">
                <Button
                  size="sm"
                  onClick={toggleChat}
                  className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-white text-xs px-3 py-1"
                >
                  Let's chat!
                </Button>
              </div>
              {/* Arrow pointing to chat button */}
              <div className="absolute -bottom-1 right-4 w-2 h-2 bg-white dark:bg-gray-800 border-r border-b border-gray-200 dark:border-gray-700 transform rotate-45"></div>
            </div>
          </div>
        )}

        {/* Mobile Greeting Notification */}
        {!isOpen && hasShownGreeting && (
          <div className="absolute -top-16 right-0 animate-fade-in sm:hidden">
            <div className="bg-gradient-to-r from-green-500 to-cyan-500 text-white p-3 rounded-xl shadow-lg max-w-xs">
              <p className="text-xs font-medium">Hi 👋 Ask me anything!</p>
            </div>
            {/* Arrow pointing down */}
            <div className="absolute -bottom-1 right-4 w-2 h-2 bg-gradient-to-r from-green-500 to-cyan-500 transform rotate-45"></div>
          </div>
        )}
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-80 sm:w-96 h-80 sm:h-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col">
          {/* Chat Header */}
          <CardHeader className="bg-gradient-to-r from-green-500 to-cyan-500 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <CardTitle className="text-lg font-semibold">AI Assistant</CardTitle>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={toggleChat}
                className="text-white hover:bg-white/20 p-1 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>

          {/* Messages Area */}
          <CardContent className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 dark:text-gray-300">
                <Bot className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm">Hi! I'm here to help you discover how AI can grow your business. What would you like to know?</p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-4 py-2 rounded-2xl ${
                    message.type === 'user'
                      ? 'bg-gradient-to-r from-green-500 to-cyan-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                  }`}
                >
                  <p className="text-sm">{message.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-2xl">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </CardContent>

          {/* Quick Select Options */}
          {messages.length === 0 && (
            <div className="p-4 border-t border-gray-200 dark:border-gray-700">
              <p className="text-xs text-gray-400 dark:text-gray-300 mb-3">Quick options:</p>
              <div className="space-y-2">
                {quickSelectOptions.map((option) => {
                  const IconComponent = option.icon
                  return (
                    <Button
                      key={option.id}
                      variant="outline"
                      size="sm"
                      onClick={option.action}
                      className="w-full justify-start text-xs h-8 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-600"
                    >
                      <IconComponent className="w-3 h-3 mr-2" />
                      {option.label}
                    </Button>
                  )
                })}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 text-sm"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                size="sm"
                className="bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-400 hover:to-cyan-400 text-white px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
