"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, Zap, TrendingUp, Bot, Sparkles, Play, BarChart3, Users, DollarSign } from "lucide-react"
import Image from "next/image"

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
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
      className="hero-section relative min-h-screen bg-dark-gradient flex items-center justify-center overflow-hidden pt-20 sm:pt-24 lg:pt-20 safe-area-top"
    >
      {/* Enhanced AI-Tech Background with Abstract Lines */}
      <div className="absolute inset-0 top-20 sm:top-24 lg:top-20">
        {/* Main gradient background */}
        <div className="absolute inset-0 bg-dark-gradient"></div>
        
        {/* AI-tech gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyan-600/10 via-purple-600/5 to-green-600/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent"></div>
        
        {/* Abstract lines and geometric patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"></div>
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent"></div>
          
          {/* Diagonal lines */}
          <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-400/20 to-transparent transform rotate-12"></div>
          <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-400/20 to-transparent transform -rotate-12"></div>
        </div>
        
        {/* Floating geometric shapes */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-2xl animate-pulse"></div>
        
        {/* Additional AI-themed geometric elements */}
        <div className="absolute top-1/6 right-1/6 w-16 h-16 border border-blue-400/20 rotate-45 animate-spin-slow"></div>
        <div className="absolute bottom-1/6 left-1/6 w-12 h-12 border border-purple-400/20 rounded-full animate-pulse"></div>
        <div className="absolute top-2/3 right-1/3 w-8 h-8 bg-gradient-to-r from-cyan-400/30 to-blue-400/30 rounded-sm rotate-45 animate-float"></div>
      </div>

      {/* Animated Floating Icons - Desktop and Tablet */}
      <div className="absolute inset-0 top-20 sm:top-24 lg:top-20 pointer-events-none hidden sm:block">
        <div className="absolute top-1/4 left-1/6 animate-float">
          <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Bot className="w-6 h-6 text-blue-300" />
          </div>
        </div>
        <div className="absolute top-1/3 right-1/6 animate-float-delayed">
          <div className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Zap className="w-5 h-5 text-purple-300" />
          </div>
        </div>
        <div className="absolute bottom-1/3 left-1/4 animate-float">
          <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <TrendingUp className="w-4 h-4 text-cyan-300" />
          </div>
        </div>
        <div className="absolute bottom-1/4 right-1/3 animate-float-delayed">
          <div className="w-6 h-6 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <Sparkles className="w-3 h-3 text-pink-300" />
          </div>
        </div>
        {/* Additional floating elements for desktop */}
        <div className="absolute top-2/3 left-1/6 animate-float hidden lg:block">
          <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-60"></div>
        </div>
        <div className="absolute top-1/6 right-1/4 animate-float-delayed hidden lg:block">
          <div className="w-3 h-3 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full opacity-50"></div>
        </div>
      </div>

      <div className="relative z-10 container-responsive py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            {/* Animated Badge */}
            <div
              className={`inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-green-500/10 backdrop-blur-sm border border-green-500/20 rounded-full text-green-400 text-sm font-medium mb-6 sm:mb-8 transition-all duration-700 hover:bg-green-500/20 hover:scale-105 cursor-pointer ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
            >
              <Zap className="w-4 h-4 mr-2 text-green-400 animate-pulse" />
              AI-Powered Growth Systems
            </div>

            {/* Animated Main Headline */}
            <h1
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 sm:mb-8 leading-tight transition-all duration-1000 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              We Build{" "}
              <span className="bg-gradient-to-r from-green-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Scalable AI Systems
              </span>{" "}
              That Drive Business Growth
            </h1>

            {/* Animated Subheadline */}
            <div
              className={`transition-all duration-1000 delay-300 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-lg sm:text-xl lg:text-2xl text-white mb-8 sm:mb-12 leading-relaxed font-light">
                From sales automation to data intelligence — LayerSync helps you deploy AI that solves real business challenges.
              </p>
            </div>

            {/* Client Logos */}
            <div
              className={`mb-8 sm:mb-12 transition-all duration-1000 delay-500 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <p className="text-sm text-white mb-4 font-medium">Trusted by industry leaders</p>
              <div className="flex flex-wrap justify-center lg:justify-start items-center gap-6 sm:gap-8">
                {["Client A", "Client B", "Client C"].map((client, index) => (
                  <div
                    key={index}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg px-4 py-2 text-white text-sm font-medium hover:bg-white/10 transition-all duration-300 hover:scale-105"
                  >
                    {client}
                  </div>
                ))}
              </div>
            </div>

            {/* Animated CTA Buttons */}
            <div
              className={`flex flex-col gap-4 sm:flex-row sm:gap-6 justify-center lg:justify-start items-center transition-all duration-1000 delay-1000 ${
                isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
            >
              <Button
                size="lg"
                onClick={() => scrollToSection("#contact")}
                className="w-full sm:w-auto btn-neon px-8 py-4 text-lg font-semibold rounded-2xl min-h-[56px] touch-manipulation"
              >
                Book Your Free Consultation
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto btn-ghost-neon px-8 py-4 text-lg font-semibold rounded-2xl min-h-[56px] touch-manipulation group"
              >
                <BarChart3 className="mr-2 w-5 h-5 group-hover:scale-125 transition-transform duration-300" />
                See Case Studies
              </Button>
            </div>
          </div>

          {/* Right Column - AI Dashboard Mockup */}
          <div
            className={`relative transition-all duration-1000 delay-700 ${
              isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-6 shadow-2xl">
              {/* Mockup Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                </div>
                <div className="text-white text-sm font-medium">AI Dashboard</div>
              </div>

              {/* Mockup Content */}
              <div className="space-y-4">
                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="w-4 h-4 text-blue-300" />
                      <span className="text-xs text-white">Leads</span>
                    </div>
                    <div className="text-2xl font-bold text-white">2,847</div>
                    <div className="text-xs text-green-300">+127%</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-green-300" />
                      <span className="text-xs text-white">Revenue</span>
                    </div>
                    <div className="text-2xl font-bold text-white">$184K</div>
                    <div className="text-xs text-green-300">+89%</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-xl p-4 border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-purple-300" />
                      <span className="text-xs text-white">Growth</span>
                    </div>
                    <div className="text-2xl font-bold text-white">312%</div>
                    <div className="text-xs text-green-300">+45%</div>
                  </div>
                </div>

                {/* Chart Area */}
                <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-white">AI Performance</span>
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    </div>
                  </div>
                  <div className="h-20 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 rounded-lg flex items-end justify-between p-2">
                    {[40, 65, 45, 80, 70, 90, 85].map((height, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-t from-blue-400 to-purple-400 rounded-sm"
                        style={{ height: `${height}%`, width: '12%' }}
                      ></div>
                    ))}
                  </div>
                </div>

                {/* AI Status */}
                <div className="flex items-center justify-between bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-xl p-4 border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-white font-medium">AI System Active</span>
                  </div>
                  <span className="text-xs text-green-300">24/7 Monitoring</span>
                </div>
              </div>
            </div>

            {/* Floating elements around mockup */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-float opacity-60"></div>
            <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full animate-float-delayed opacity-60"></div>
          </div>
        </div>

        {/* Animated Trust Indicators */}
        <div
          className={`mt-12 sm:mt-16 transition-all duration-1000 delay-1200 ${
            isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="flex flex-col sm:flex-row flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 text-blue-200/80 max-w-3xl mx-auto">
            {[
              { text: "Industry AI Specialists", color: "bg-green-400" },
              { text: "300% Average ROI", color: "bg-blue-400" },
              { text: "24/7 AI Support", color: "bg-purple-400" },
            ].map((item, index) => (
              <div
                key={index}
                className={`flex items-center gap-2 bg-white/5 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer ${
                  isLoaded ? "animate-scale-in" : ""
                }`}
                style={{ animationDelay: `${1400 + index * 200}ms` }}
              >
                <div className={`w-2 h-2 ${item.color} rounded-full animate-pulse`}></div>
                <span className="text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animated Scroll Indicator */}
      <div
        className={`absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 transition-all duration-1000 delay-1500 ${
          isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <button
          onClick={scrollToNextSection}
          className="flex flex-col items-center text-white/70 hover:text-white transition-colors duration-300 group touch-manipulation animate-float"
        >
          <span className="text-sm mb-2 font-medium group-hover:text-blue-300 transition-colors duration-300">
            Discover Our Solutions
          </span>
          <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110 animate-bounce">
            <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform duration-300" />
          </div>
        </button>
      </div>
    </section>
  )
}
