"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Settings, Handshake, TrendingUp, CheckCircle, Clock, Users, Zap } from "lucide-react"

const processSteps = [
  {
    id: 1,
    number: "01",
    icon: Search,
    headline: "Free Revenue Analysis",
    description:
      "We analyze your business to find exactly where AI can make you the most money - no technical jargon, just clear opportunities.",
    benefits: [
      "• Find 3-5 ways to double your revenue with AI",
      "• Get exact ROI projections for each opportunity",
      "• See which areas will give you the biggest impact",
      "• Get a custom roadmap tailored to your business"
    ],
    duration: "1-2 weeks",
    deliverable: "Your Revenue Growth Plan",
  },
  {
    id: 2,
    number: "02",
    icon: Settings,
    headline: "Build Your AI Systems",
    description:
      "We build AI that actually works for your business - no generic solutions, just custom systems designed to make you more money.",
    benefits: [
      "• AI that sounds exactly like your brand",
      "• Systems that work with your existing tools",
      "• Everything tested and ready to generate revenue",
      "• No technical setup required on your end"
    ],
    duration: "2-4 weeks",
    deliverable: "Revenue-Generating AI Systems",
  },
  {
    id: 3,
    number: "03",
    icon: Handshake,
    headline: "Launch & Train Your Team",
    description:
      "We launch everything and train your team so you can start making money immediately - no learning curve, just results.",
    benefits: [
      "• Everything goes live and starts working immediately",
      "• Your team learns how to use it in 30 minutes",
      "• We handle all the technical stuff for you",
      "• You start seeing results in the first week"
    ],
    duration: "1-2 weeks",
    deliverable: "Live Systems Making You Money",
  },
  {
    id: 4,
    number: "04",
    icon: TrendingUp,
    headline: "Scale & Optimize",
    description: "We keep optimizing your AI to make you even more money - monthly reports show exactly how much you're earning.",
    benefits: [
      "• Monthly reports showing your exact revenue growth",
      "• We optimize everything to maximize your profits",
      "• Add new features as your business grows",
      "• Scale to 10x revenue without hiring more staff"
    ],
    duration: "Ongoing",
    deliverable: "Continuous Revenue Growth",
  },
]

export default function ProcessSection() {
  const [visibleSteps, setVisibleSteps] = useState<number[]>([])
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [hoveredStep, setHoveredStep] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  // Add scrollToSection function
  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.substring(1))
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Trigger step-by-step reveal animation
            processSteps.forEach((step, index) => {
              setTimeout(() => {
                setVisibleSteps((prev) => [...prev, step.id])
              }, index * 300)
            })
          }
        })
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const toggleExpanded = (stepId: number) => {
    setExpandedStep(expandedStep === stepId ? null : stepId)
  }

  return (
    <section id="process" ref={sectionRef} className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-blue-200 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-purple-200 rounded-full"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-blue-100 rotate-45 rounded-lg"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4 mr-2" />
            Our Process
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 px-4 leading-tight">
            How We Help You Double Revenue in 4 Simple Steps
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-3xl mx-auto px-4 leading-relaxed">
            Our proven process has helped 50+ businesses double their revenue - here's exactly how we'll do it for you.
          </p>
        </div>

        {/* Desktop Timeline Layout */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-24 left-0 right-0 h-0.5 bg-gray-200">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-2000 ease-out"
                style={{
                  width: `${(visibleSteps.length / processSteps.length) * 100}%`,
                }}
              />
            </div>

            <div className="grid grid-cols-4 gap-8">
              {processSteps.map((step, index) => {
                const IconComponent = step.icon
                const isVisible = visibleSteps.includes(step.id)
                const isHovered = hoveredStep === step.id
                const isExpanded = expandedStep === step.id

                return (
                  <div
                    key={step.id}
                    className={`relative transition-all duration-500 ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                  >
                    {/* Step Number and Icon */}
                    <div className="flex flex-col items-center mb-6">
                      <div
                        className={`relative w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg mb-4 transition-all duration-300 ${
                          isVisible ? "scale-100" : "scale-0"
                        } ${isHovered ? "scale-110 shadow-lg" : ""}`}
                      >
                        {visibleSteps.includes(step.id) && (
                          <CheckCircle className="w-6 h-6 absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1" />
                        )}
                        <span className="relative z-10">{step.number}</span>
                      </div>

                      <div
                        className={`w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center transition-all duration-300 ${
                          isHovered ? "bg-blue-200 scale-110" : ""
                        }`}
                      >
                        <IconComponent className="w-6 h-6 text-blue-700" />
                      </div>
                    </div>

                    {/* Step Content */}
                    <Card
                      className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                        isHovered ? "shadow-lg -translate-y-2" : ""
                      } ${isExpanded ? "ring-2 ring-blue-500" : ""}`}
                      onMouseEnter={() => setHoveredStep(step.id)}
                      onMouseLeave={() => setHoveredStep(null)}
                      onClick={() => toggleExpanded(step.id)}
                    >
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{step.headline}</h3>
                        <p className="text-gray-700 mb-4 leading-relaxed">{step.description}</p>

                        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {step.duration}
                          </div>
                          <div className="text-blue-700 font-medium">{step.deliverable}</div>
                        </div>

                        {/* Benefits List - Always visible */}
                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-semibold text-gray-900 mb-3">What You Get:</h4>
                          <ul className="space-y-2">
                            {step.benefits.map((benefit, benefitIndex) => (
                              <li key={benefitIndex} className="text-sm text-gray-700 leading-relaxed">
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Mobile Vertical Layout */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Vertical Connecting Line */}
            <div className="absolute left-6 md:left-8 top-0 bottom-0 w-0.5 bg-gray-200">
              <div
                className="w-full bg-gradient-to-b from-blue-500 to-blue-600 transition-all duration-2000 ease-out"
                style={{
                  height: `${(visibleSteps.length / processSteps.length) * 100}%`,
                }}
              />
            </div>

            <div className="space-y-6 md:space-y-8">
              {processSteps.map((step, index) => {
                const IconComponent = step.icon
                const isVisible = visibleSteps.includes(step.id)
                const isExpanded = expandedStep === step.id

                return (
                  <div
                    key={step.id}
                    className={`relative flex items-start transition-all duration-500 ${
                      isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
                    }`}
                  >
                    {/* Step Number and Icon */}
                    <div className="flex flex-col items-center mr-4 md:mr-6 flex-shrink-0">
                      <div
                        className={`relative w-12 h-12 md:w-16 md:h-16 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-base md:text-lg transition-all duration-300 ${
                          isVisible ? "scale-100" : "scale-0"
                        }`}
                      >
                        {visibleSteps.includes(step.id) && (
                          <CheckCircle className="w-5 h-5 md:w-6 md:h-6 absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1" />
                        )}
                        <span className="relative z-10 text-sm md:text-base">{step.number}</span>
                      </div>
                    </div>

                    {/* Step Content */}
                    <Card
                      className="flex-1 cursor-pointer transition-all duration-300 hover:shadow-lg"
                      onClick={() => toggleExpanded(step.id)}
                    >
                      <CardContent className="p-4 md:p-6">
                        <div className="flex items-start mb-3">
                          <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                            <IconComponent className="w-4 h-4 md:w-5 md:h-5 text-blue-700" />
                          </div>
                          <h3 className="text-lg md:text-xl font-bold text-gray-900 leading-tight">{step.headline}</h3>
                        </div>

                        <p className="text-gray-700 mb-4 leading-relaxed text-sm md:text-base">{step.description}</p>

                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm text-gray-500 mb-4 gap-2">
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {step.duration}
                          </div>
                          <div className="text-blue-700 font-medium">{step.deliverable}</div>
                        </div>

                        {/* Benefits List - Always visible */}
                        <div className="border-t border-gray-200 pt-4">
                          <h4 className="font-semibold text-gray-900 mb-3">What You Get:</h4>
                          <ul className="space-y-2">
                            {step.benefits.map((benefit, benefitIndex) => (
                              <li key={benefitIndex} className="text-sm text-gray-700 leading-relaxed">
                                {benefit}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8 border border-blue-100">
            <div className="flex items-center justify-center mb-4">
              <Users className="w-6 h-6 mr-2 text-blue-700" />
              <span className="text-lg font-semibold text-gray-900">Ready to Get Started?</span>
            </div>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Schedule your free AI audit today and discover how our proven process can transform your business
              operations.
            </p>
            <Button
              size="lg"
              onClick={() => scrollToSection("#contact")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-3 font-semibold transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Start Your Free AI Audit
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
