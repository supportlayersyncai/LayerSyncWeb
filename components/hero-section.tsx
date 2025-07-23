"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, Zap, TrendingUp, Bot, Sparkles } from "lucide-react"

export default function HeroSection() {
  const [displayedText, setDisplayedText] = useState("")
  const [isTypingComplete, setIsTypingComplete] = useState(false)
  const fullText = "Transform Your Business with AI Automation That Actually Works"

  useEffect(() => {
    let currentIndex = 0
    const typingInterval = setInterval(() => {
      if (currentIndex <= fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex))
        currentIndex++
      } else {
        clearInterval(typingInterval)
        setIsTypingComplete(true)
      }
    }, 50)

    return () => clearInterval(typingInterval)
  }, [])

  const scrollToNextSection = () => {
    const servicesSection = document.getElementById("services")
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.substring(1))
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section
      id="home"
      className="relative min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-center justify-center overflow-hidden pt-24 md:pt-20"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white/20 rounded-full"></div>
        <div className="absolute top-40 right-32 w-24 h-24 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-32 left-32 w-40 h-40 border border-white/20 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-28 h-28 border border-white/20 rounded-full"></div>

        {/* Geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-white/5 rotate-45 rounded-lg"></div>
        <div className="absolute top-3/4 right-1/4 w-20 h-20 bg-white/5 rotate-12 rounded-lg"></div>
        <div className="absolute top-1/2 left-1/6 w-12 h-12 bg-white/5 rotate-45 rounded-lg"></div>
      </div>

      {/* Floating Icons */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/6 animate-float">
          <Bot className="w-8 h-8 text-white/20" />
        </div>
        <div className="absolute top-1/3 right-1/6 animate-float-delayed">
          <Zap className="w-6 h-6 text-white/20" />
        </div>
        <div className="absolute bottom-1/3 left-1/4 animate-float">
          <TrendingUp className="w-7 h-7 text-white/20" />
        </div>
        <div className="absolute bottom-1/4 right-1/3 animate-float-delayed">
          <Sparkles className="w-6 h-6 text-white/20" />
        </div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Headline with Typewriter Effect */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-7xl font-bold text-white mb-6 md:mb-8 leading-tight px-4">
          {displayedText}
          <span className="animate-pulse">|</span>
        </h1>

        {/* Subheadline with Fade-in Animation */}
        <div
          className={`transition-all duration-1000 delay-500 ${
            isTypingComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-blue-100 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            We help businesses increase conversions by <span className="text-yellow-300 font-semibold">300%</span> and
            boost customer retention through intelligent AI solutions that automate lead generation, content creation,
            and customer engagement across all platforms.
          </p>
        </div>

        {/* CTA Buttons with Fade-in Animation */}
        <div
          className={`flex flex-col gap-4 justify-center items-center px-4 transition-all duration-1000 delay-1000 ${
            isTypingComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <Button
            size="lg"
            onClick={() => scrollToSection("#contact")}
            className="bg-white text-blue-700 hover:bg-blue-50 w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
          >
            Get Your Free AI Strategy Session
            <Sparkles className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:rotate-12 transition-transform duration-300" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="border-2 border-white text-white hover:bg-white hover:text-blue-700 w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-base md:text-lg font-semibold rounded-xl transition-all duration-300 hover:scale-105 group bg-transparent"
          >
            See How It Works
            <TrendingUp className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Button>
        </div>

        {/* Trust Indicators */}
        <div
          className={`mt-16 transition-all duration-1000 delay-1500 ${
            isTypingComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-blue-200">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <span className="text-sm font-medium">AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span className="text-sm font-medium">300% ROI Average</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              <span className="text-sm font-medium">24/7 Automation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        className={`absolute bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-2000 ${
          isTypingComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <button
          onClick={scrollToNextSection}
          className="flex flex-col items-center text-white/70 hover:text-white transition-colors duration-300 group"
        >
          <span className="text-sm mb-2 font-medium">Discover Our Solutions</span>
          <ChevronDown className="w-6 h-6 animate-bounce group-hover:translate-y-1 transition-transform duration-300" />
        </button>
      </div>
    </section>
  )
}
