"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  Quote, 
  Star, 
  TrendingUp, 
  Users, 
  DollarSign, 
  Clock, 
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Award,
  Target
} from "lucide-react"

const testimonials = [
  {
    id: 1,
    quote: "LayerSync AI transformed our business completely. We went from struggling to find leads to having a waiting list of qualified prospects. Our revenue increased by 340% in just 4 months, and we're still growing.",
    clientName: "Sarah Johnson",
    clientTitle: "CEO, TechFlow Solutions",
    clientPhoto: "/placeholder-user.jpg",
    rating: 5,
    metrics: {
      revenueIncrease: "340%",
      timeFrame: "4 months",
      leadGrowth: "500%"
    }
  },
  {
    id: 2,
    quote: "The AI content system alone saved us 25 hours per week. Our blog traffic increased by 280%, and we're ranking #1 for our target keywords. It's like having a full marketing team working 24/7.",
    clientName: "Michael Chen",
    clientTitle: "Founder, Digital Marketing Pro",
    clientPhoto: "/placeholder-user.jpg",
    rating: 5,
    metrics: {
      timeSaved: "25 hours/week",
      trafficGrowth: "280%",
      keywordRankings: "#1 position"
    }
  },
  {
    id: 3,
    quote: "Before LayerSync, we were losing potential clients because we couldn't respond fast enough. Now our AI handles inquiries instantly, books appointments, and our conversion rate jumped from 12% to 47%.",
    clientName: "Emily Rodriguez",
    clientTitle: "Managing Partner, LegalEdge Law",
    clientPhoto: "/placeholder-user.jpg",
    rating: 5,
    metrics: {
      conversionRate: "47%",
      responseTime: "Instant",
      clientSatisfaction: "98%"
    }
  }
]

const caseStudies = [
  {
    id: 1,
    company: "SolarMax Energy",
    industry: "Solar Installation",
    challenge: "Low lead conversion rates and manual follow-up processes",
    solution: "AI-powered lead qualification and automated nurturing sequences",
    results: [
      { metric: "Lead Conversion", value: "45%", improvement: "increase in 60 days" },
      { metric: "Revenue Growth", value: "280%", improvement: "in 6 months" },
      { metric: "Time Saved", value: "30 hours", improvement: "per week" }
    ],
    testimonial: "LayerSync's AI system turned our lead generation from a bottleneck into our biggest competitive advantage.",
    logo: "SolarMax",
    color: "from-orange-500 to-yellow-500"
  },
  {
    id: 2,
    company: "FinanceFlow Advisory",
    industry: "Financial Services",
    challenge: "Inconsistent content creation and low client engagement",
    solution: "AI content generation and automated client communication",
    results: [
      { metric: "Content Output", value: "50+", improvement: "pieces per week" },
      { metric: "Client Engagement", value: "320%", improvement: "increase" },
      { metric: "New Clients", value: "150%", improvement: "more qualified leads" }
    ],
    testimonial: "Our content strategy went from reactive to proactive, and our client base grew exponentially.",
    logo: "FinanceFlow",
    color: "from-blue-500 to-cyan-500"
  },
  {
    id: 3,
    company: "LegalEdge Partners",
    industry: "Legal Services",
    challenge: "High client acquisition costs and slow response times",
    solution: "AI chatbots and automated intake processes",
    results: [
      { metric: "Response Time", value: "Instant", improvement: "vs 24+ hours" },
      { metric: "Cost Reduction", value: "65%", improvement: "in acquisition costs" },
      { metric: "Client Satisfaction", value: "98%", improvement: "rating" }
    ],
    testimonial: "We can now handle 10x more inquiries without hiring additional staff, and our clients love the instant responses.",
    logo: "LegalEdge",
    color: "from-purple-500 to-pink-500"
  }
]

const clientLogos = [
  { name: "TechFlow Solutions", width: "140px" },
  { name: "Digital Marketing Pro", width: "160px" },
  { name: "LegalEdge Law", width: "130px" },
  { name: "SolarMax Energy", width: "150px" },
  { name: "FinanceFlow Advisory", width: "170px" },
  { name: "GrowthHub Inc", width: "120px" },
  { name: "AutoScale Systems", width: "140px" },
  { name: "InnovateLaw Group", width: "150px" }
]

export default function SuccessStoriesSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0)
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

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
            // Show case study cards with staggered animation
            caseStudies.forEach((study, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, study.id])
              }, index * 200)
            })
          }
        })
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section
      id="success-stories"
      ref={sectionRef}
      className="py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 border border-green-200 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-blue-200 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-green-100 rotate-45 rounded-lg"></div>
      </div>

      <div className="container-responsive relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium mb-4">
            <Award className="w-4 h-4 mr-2" />
            Success Stories
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Real Results From Real Businesses
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            See how businesses just like yours are doubling their revenue, saving time, and scaling faster with our AI automation solutions.
          </p>
        </div>

        {/* Featured Testimonial */}
        <div className="mb-16 sm:mb-20">
          <Card className="max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-purple-50 border-0 shadow-2xl">
            <CardContent className="p-8 sm:p-12">
              <div className="text-center mb-8">
                <Quote className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <blockquote className="text-xl sm:text-2xl text-gray-800 leading-relaxed mb-6 italic">
                  "{testimonials[currentTestimonial].quote}"
                </blockquote>
                
                {/* Client Info */}
                <div className="flex flex-col sm:flex-row items-center justify-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4 sm:mb-0 sm:mr-4">
                    <span className="text-white font-bold text-lg">
                      {testimonials[currentTestimonial].clientName.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="text-lg font-bold text-gray-900">{testimonials[currentTestimonial].clientName}</h3>
                    <p className="text-gray-700">{testimonials[currentTestimonial].clientTitle}</p>
                    <div className="flex items-center justify-center sm:justify-start mt-2">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  {Object.entries(testimonials[currentTestimonial].metrics).map(([key, value], index) => (
                    <div key={index} className="bg-white/60 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">{value}</div>
                      <div className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                    </div>
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-center space-x-4">
                  <button
                    onClick={prevTestimonial}
                    className="p-2 rounded-full bg-white/60 hover:bg-white/80 transition-colors duration-200"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  
                  <div className="flex space-x-2">
                    {testimonials.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                          index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>

                  <button
                    onClick={nextTestimonial}
                    className="p-2 rounded-full bg-white/60 hover:bg-white/80 transition-colors duration-200"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Case Study Cards */}
        <div className="mb-16 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-12">
            Detailed Case Studies
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {caseStudies.map((study) => {
              const isVisible = visibleCards.includes(study.id)
              const isHovered = hoveredCard === study.id

              return (
                <Card
                  key={study.id}
                  className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl bg-white border-0 shadow-lg ${
                    isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  } ${isHovered ? "scale-105 -translate-y-2" : ""}`}
                  onMouseEnter={() => setHoveredCard(study.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 bg-gradient-to-r ${study.color} rounded-xl flex items-center justify-center`}>
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">{study.industry}</div>
                        <div className="font-bold text-gray-900">{study.logo}</div>
                      </div>
                    </div>
                    <CardTitle className="text-lg font-bold text-gray-900 mb-2">
                      {study.company}
                    </CardTitle>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <strong>Challenge:</strong> {study.challenge}
                    </p>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Solution:</h4>
                      <p className="text-sm text-gray-700 leading-relaxed">{study.solution}</p>
                    </div>

                    {/* Results */}
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Results:</h4>
                      <div className="space-y-3">
                        {study.results.map((result, index) => (
                          <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                            <div>
                              <div className="text-sm text-gray-700">{result.metric}</div>
                              <div className="text-xs text-gray-600">{result.improvement}</div>
                            </div>
                            <div className={`text-xl font-bold bg-gradient-to-r ${study.color} bg-clip-text text-transparent`}>
                              {result.value}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Testimonial */}
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <Quote className="w-4 h-4 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-800 italic leading-relaxed">
                        "{study.testimonial}"
                      </p>
                    </div>

                    <Button
                      onClick={() => scrollToSection("#contact")}
                      className={`w-full bg-gradient-to-r ${study.color} hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                    >
                      Get Similar Results
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Client Logos Carousel */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 text-center mb-8">
            Trusted by Industry Leaders
          </h2>
          <div className="relative overflow-hidden">
            <div className="flex items-center space-x-8 animate-scroll">
              {[...clientLogos, ...clientLogos].map((logo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center h-16 opacity-60 hover:opacity-100 transition-opacity duration-300 flex-shrink-0"
                  style={{ minWidth: logo.width }}
                >
                  <div className="bg-gray-200 rounded-lg px-6 py-3 text-gray-600 font-semibold text-sm">
                    {logo.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 sm:p-12 text-white">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">
              Ready to Join Our Success Stories?
            </h2>
            <p className="text-green-100 mb-8 max-w-2xl mx-auto text-lg">
              Let us help you achieve similar results. Schedule your free strategy session and discover how AI can transform your business.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => scrollToSection("#contact")}
                className="bg-white text-green-600 hover:bg-green-50 px-8 py-4 font-semibold transition-all duration-300 hover:scale-105"
              >
                Get Your Free Strategy Session
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 font-semibold transition-all duration-300 hover:scale-105 bg-transparent"
              >
                View All Case Studies
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
