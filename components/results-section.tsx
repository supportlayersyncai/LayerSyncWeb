"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, Shield, Clock, Users, Calculator, ExternalLink, Award, CheckCircle } from "lucide-react"

const metrics = [
  {
    id: 1,
    icon: TrendingUp,
    number: 300,
    suffix: "%",
    label: "Average ROI",
    description: "Return on investment within 90 days of implementation",
    color: "from-green-500 to-green-600",
    glowColor: "shadow-green-500/25",
  },
  {
    id: 2,
    icon: Shield,
    number: 90,
    suffix: "-Day",
    label: "Payback Guarantee",
    description: "Full refund if you don't see measurable results",
    color: "from-blue-500 to-blue-600",
    glowColor: "shadow-blue-500/25",
  },
  {
    id: 3,
    icon: Clock,
    number: 24,
    suffix: "/7",
    label: "AI Support",
    description: "Round-the-clock automated customer service",
    color: "from-purple-500 to-purple-600",
    glowColor: "shadow-purple-500/25",
  },
  {
    id: 4,
    icon: Users,
    number: 2,
    suffix: "+",
    label: "Years Experience",
    description: "Deep expertise in AI automation and business growth",
    color: "from-orange-500 to-orange-600",
    glowColor: "shadow-orange-500/25",
  },
]

const clientLogos = [
  { name: "TechCorp", width: "120px" },
  { name: "InnovateLaw", width: "140px" },
  { name: "SolarMax", width: "110px" },
  { name: "FinanceFlow", width: "130px" },
  { name: "GrowthHub", width: "125px" },
  { name: "AutoScale", width: "115px" },
]

export default function ResultsSection() {
  const [visibleMetrics, setVisibleMetrics] = useState<number[]>([])
  const [animatedNumbers, setAnimatedNumbers] = useState<{ [key: number]: number }>({})
  const [hoveredMetric, setHoveredMetric] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Start animations for all metrics
            metrics.forEach((metric, index) => {
              setTimeout(() => {
                setVisibleMetrics((prev) => [...prev, metric.id])
                animateCounter(metric.id, metric.number)
              }, index * 200)
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

  const animateCounter = (id: number, targetNumber: number) => {
    let currentNumber = 0
    const increment = targetNumber / 50 // 50 steps for smooth animation
    const timer = setInterval(() => {
      currentNumber += increment
      if (currentNumber >= targetNumber) {
        currentNumber = targetNumber
        clearInterval(timer)
      }
      setAnimatedNumbers((prev) => ({ ...prev, [id]: Math.floor(currentNumber) }))
    }, 40)
  }

  return (
    <section
      id="results"
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-64 h-64 border border-blue-200 rounded-full"></div>
        <div className="absolute bottom-20 left-20 w-48 h-48 border border-green-200 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-blue-100 rotate-45 rounded-lg"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4 mr-2" />
            Proven Results
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 px-4 leading-tight">
            Numbers That Speak for Themselves
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
            Our track record with a select group of businesses speaks volumes. Here's what our current clients achieve
            with LayerSync AI automation solutions.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-16">
          {metrics.map((metric) => {
            const IconComponent = metric.icon
            const isVisible = visibleMetrics.includes(metric.id)
            const isHovered = hoveredMetric === metric.id
            const animatedValue = animatedNumbers[metric.id] || 0

            return (
              <Card
                key={metric.id}
                className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                } ${isHovered ? `shadow-xl ${metric.glowColor} scale-105` : ""}`}
                onMouseEnter={() => setHoveredMetric(metric.id)}
                onMouseLeave={() => setHoveredMetric(null)}
              >
                <CardContent className="p-6 md:p-8 text-center">
                  {/* Icon */}
                  <div
                    className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 md:mb-6 rounded-xl bg-gradient-to-r ${metric.color} flex items-center justify-center transform transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>

                  {/* Animated Number */}
                  <div className="mb-4">
                    <div
                      className={`text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r ${metric.color} bg-clip-text text-transparent transition-all duration-300 ${
                        isHovered ? "animate-pulse" : ""
                      }`}
                    >
                      {animatedValue}
                      <span className="text-2xl md:text-3xl lg:text-4xl">{metric.suffix}</span>
                    </div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mt-2">{metric.label}</h3>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">{metric.description}</p>

                  {/* Hover Effect - Additional Info */}
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isHovered ? "max-h-20 opacity-100 mt-4" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex items-center justify-center text-sm text-blue-600 font-medium">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Verified Results
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* ROI Calculation Explanation */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-8 mb-12">
          <div className="flex items-start">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-3">How We Calculate ROI</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                Our ROI calculations are based on measurable improvements in lead conversion rates, customer retention,
                and operational efficiency. We track revenue increases against implementation costs over a 90-day
                period.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  <span>Increased conversion rates</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  <span>Reduced operational costs</span>
                </div>
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  <span>Enhanced customer lifetime value</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Client Logos Carousel */}
        <div className="mb-12">
          <h3 className="text-center text-lg font-semibold text-gray-900 mb-8">
            Trusted by Leading Businesses Across Industries
          </h3>
          <div className="flex items-center justify-center space-x-8 overflow-hidden">
            <div className="flex items-center space-x-12 animate-scroll">
              {clientLogos.map((logo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center h-12 opacity-60 hover:opacity-100 transition-opacity duration-300"
                  style={{ minWidth: logo.width }}
                >
                  <div className="bg-gray-200 rounded-lg px-4 py-2 text-gray-600 font-semibold text-sm">
                    {logo.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-6 mb-12">
          
          <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow-sm border">
            <Shield className="w-5 h-5 text-green-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">SOC 2 Certified</span>
          </div>
          <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow-sm border">
            <CheckCircle className="w-5 h-5 text-blue-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">ISO 27001 Compliant</span>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Join Our Success Stories?</h3>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              See detailed case studies and learn how select businesses like yours achieved these remarkable results.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 font-semibold transition-all duration-300 hover:scale-105"
              >
                View Case Studies
                <ExternalLink className="w-4 h-4 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-3 font-semibold transition-all duration-300 hover:scale-105 bg-transparent"
              >
                Schedule Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
