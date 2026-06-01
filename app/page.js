'use client'
import { useState } from 'react'
import { 
  Book, 
  Code, 
  PenTool, 
  Target, 
  FileText, 
  Globe, 
  Award, 
  Brain,
  ArrowRight,
  Bot,
  Loader2,
  MessageCircle,
  X
} from 'lucide-react'
import Link from 'next/link'
import HeroSection from './dashboard/_components/HeroSection'
import { toast } from 'sonner'

const ResourceCard = ({ icon, title, description, links }) => (
  <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 p-6 flex flex-col h-full">
    <div className="flex items-center mb-4">
      {icon}
      <h3 className="ml-4 text-xl font-semibold text-gray-900">{title}</h3>
    </div>
    <p className="text-gray-600 mb-4 flex-grow">{description}</p>
    <div className="space-y-2">
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          {link.name}
          <ArrowRight 
            className="ml-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" 
          />
        </a>
      ))}
    </div>
  </div>
)

export default function ResourcesPage() {
  const [activeCategory, setActiveCategory] = useState('tech')
  const [chatOpen, setChatOpen] = useState(false)
  const [chatInput, setChatInput] = useState('')
  const [chatLoading, setChatLoading] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi, I can help with interview prep, coding topics, resumes, and study plans.',
    },
  ])

  const resourceCategories = {
    tech: {
      icon: <Code className="w-10 h-10 text-indigo-600" />,
      resources: [
        {
          title: "Coding Platforms",
          description: "Practice coding and algorithmic problem-solving",
          icon: <Code className="w-8 h-8 text-indigo-600" />,
          links: [
            { name: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/" },
            { name: "LeetCode", url: "https://leetcode.com/" },
            { name: "HackerRank", url: "https://www.hackerrank.com/" },
            { name: "CodeChef", url: "https://www.codechef.com/" }
          ]
        },
        {
          title: "Technical Interview Preparation",
          description: "Resources for system design and technical interviews",
          icon: <Target className="w-8 h-8 text-indigo-600" />,
          links: [
            { name: "InterviewBit", url: "https://www.interviewbit.com/" },
            { name: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer" },
            { name: "Pramp", url: "https://www.pramp.com/" }
          ]
        }
      ]
    },
    aptitude: {
      icon: <Brain className="w-10 h-10 text-indigo-600" />,
      resources: [
        {
          title: "Aptitude & Reasoning",
          description: "Practice quantitative and logical reasoning skills",
          icon: <PenTool className="w-8 h-8 text-indigo-600" />,
          links: [
            { name: "IndiaBix", url: "https://www.indiabix.com/" },
            { name: "Freshersworld Aptitude", url: "https://www.freshersworld.com/aptitude-questions" },
            { name: "MathsGuru Reasoning", url: "https://www.mathsguru.com/reasoning-questions/" }
          ]
        },
        {
          title: "Competitive Exam Prep",
          description: "Resources for competitive and placement exams",
          icon: <Award className="w-8 h-8 text-indigo-600" />,
          links: [
            { name: "GATE Overflow", url: "https://gateoverflow.in/" },
            { name: "Career Power", url: "https://careerpower.in/" },
            { name: "Brilliant.org", url: "https://brilliant.org/" }
          ]
        }
      ]
    },
    interview: {
      icon: <FileText className="w-10 h-10 text-indigo-600" />,
      resources: [
        {
          title: "Interview Guides",
          description: "Comprehensive interview preparation resources",
          icon: <Book className="w-8 h-8 text-indigo-600" />,
          links: [
            { name: "Insider Tips", url: "https://www.ambitionbox.com/" },
            { name: "InterviewStreet", url: "https://www.interviewstreet.com/" },
            { name: "Career Guidance", url: "https://www.shiksha.com/" }
          ]
        },
        {
          title: "Global Learning Platforms",
          description: "Online courses and learning resources",
          icon: <Globe className="w-8 h-8 text-indigo-600" />,
          links: [
            { name: "Coursera", url: "https://www.coursera.org/" },
            { name: "edX", url: "https://www.edx.org/" },
            { name: "Udacity", url: "https://www.udacity.com/" }
          ]
        }
      ]
    }
  }

  const handleChatSubmit = async (event) => {
    event.preventDefault()

    const message = chatInput.trim()
    if (!message || chatLoading) {
      return
    }

    setChatMessages((prev) => [...prev, { role: 'user', content: message }])
    setChatInput('')
    setChatLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data?.message || 'Chatbot failed')
      }

      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply || 'Please ask again with a little more detail.' },
      ])
    } catch (error) {
      toast.error(error.message || 'Unable to reach AI chatbot')
      setChatMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'I am having trouble replying right now. Please try again in a moment.' },
      ])
    } finally {
      setChatLoading(false)
    }
  }

  return (
    <>
    <HeroSection />
    <div className="bg-gradient-to-br from-gray-50 to-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            B.Tech Interview & Preparation Resources
          </h1>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive collection of resources to support your professional growth and interview preparation
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center mb-12 gap-4">
          {Object.keys(resourceCategories).map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all 
              ${activeCategory === category 
                ? 'bg-indigo-600 text-white shadow-md' 
                : 'bg-gray-100 text-gray-900 hover:bg-gray-200 hover:shadow-sm'}`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)} Resources
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-8">
          {resourceCategories[activeCategory].resources.map((resource, index) => (
            <ResourceCard key={index} {...resource} />
          ))}
        </div>

        {/* Additional Resources Section */}
        <div className="mt-16 bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Additional Preparation Tips
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto mb-8">
              Explore supplementary resources to enhance your interview and career preparation journey
            </p>
          </div>
          <div className="grid sm:grid-cols-1 md:grid-cols-3 gap-6 p-8 pt-0">
            {[
              {
                title: "Resume Building",
                description: "Create a standout professional resume",
                icon: <Book className="w-12 h-12 text-indigo-600 mx-auto mb-4" />,
                url: "https://www.canva.com/resumes/templates/"
              },
              {
                title: "Mock Interviews",
                description: "Practice with AI-powered interview simulations",
                icon: <Target className="w-12 h-12 text-green-600 mx-auto mb-4" />,
                url: "/dashboard"
              },
              {
                title: "Skill Assessment",
                description: "Identify and improve your key skills",
                icon: <Brain className="w-12 h-12 text-purple-600 mx-auto mb-4" />,
                url: "/skill-assessment"
              }
            ].map((tip, index) => (
              <div 
                key={index} 
                className="bg-gray-50 p-6 rounded-lg text-center hover:shadow-md transition-all group"
              >
                {tip.icon}
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {tip.title}
                </h3>
                <p className="text-gray-600 mb-4">{tip.description}</p>
                <a
                  href={tip.url}
                  className="group-hover:text-indigo-800 text-indigo-600 flex items-center justify-center"
                >
                  Explore
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {chatOpen && (
        <div className="w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-lg border border-gray-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-100 bg-gray-900 px-4 py-3 text-white">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <h2 className="text-sm font-semibold">AI Chatbot</h2>
                <p className="text-xs text-gray-300">Gemini powered interview help</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setChatOpen(false)}
              className="rounded-md p-1 text-gray-300 transition hover:bg-white/10 hover:text-white"
              aria-label="Close AI chatbot"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-80 space-y-3 overflow-y-auto bg-gray-50 p-3">
            {chatMessages.map((item, index) => (
              <div
                key={`${item.role}-${index}`}
                className={`flex ${item.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-md px-3 py-2 text-sm leading-5 ${
                    item.role === 'user'
                      ? 'bg-indigo-600 text-white'
                      : 'border border-gray-200 bg-white text-gray-700'
                  }`}
                >
                  {item.content}
                </div>
              </div>
            ))}
            {chatLoading && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Thinking
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleChatSubmit} className="space-y-3 border-t border-gray-100 p-3">
            <textarea
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              placeholder="Ask about interview prep..."
              rows={3}
              className="w-full resize-none rounded-md border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
            <button
              type="submit"
              disabled={chatLoading || !chatInput.trim()}
              className="inline-flex w-full items-center justify-center rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Send Message
            </button>
          </form>
        </div>
      )}

      <button
        type="button"
        onClick={() => setChatOpen((open) => !open)}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
        aria-label={chatOpen ? 'Close AI chatbot' : 'Open AI chatbot'}
      >
        {chatOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
      </button>
    </div>
    </>
  )
}
