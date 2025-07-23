"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Users, PenTool, MessageCircle, ArrowRight, Zap, TrendingUp, Clock, Target } from "lucide-react"

const services = [
  {
    id: 1,
    icon: Database,
    headline: "Unlock Hidden Revenue in Your Existing Data",
    description:
      "Transform dormant customer databases into active revenue streams through AI-powered re-engagement campaigns and personalized outreach strategies.",
    details: [
      "AI-powered customer segmentation",
      "Automated re-engagement campaigns",
      "Personalized outreach sequences",
      "Revenue recovery optimization",
    ],
    color: "from-blue-500 to-blue-600",
    delay: 0,
  },
  {
    id: 2,
    icon: Users,
    headline: "AI-Powered Lead Generation That Never Sleeps",
    description:
      "Intelligent lead identification, qualification, and nurturing across LinkedIn, email, and social platforms with 24/7 automated follow-up sequences.",
    details: [
      "Multi-platform lead identification",
      "Automated qualification scoring",
      "24/7 follow-up sequences",
      "Cross-channel nurturing",
    ],
    color: "from-purple-500 to-purple-600",
    delay: 200,
  },
  {
    id: 3,
    icon: PenTool,
    headline: "Scale Your Content Without Scaling Your Team",
    description:
      "AI-generated blogs, social media posts, email sequences, and marketing materials that maintain your brand voice while driving engagement.",
    details: [
      "Brand voice consistency",
      "Multi-format content creation",
      "SEO-optimized blog posts",
      "Social media automation",
    ],
    color: "from-green-500 to-green-600",
    delay: 400,
  },
  {
    id: 4,
    icon: MessageCircle,
    headline: "Never Miss Another Lead with AI Agents",
    description:
      "Intelligent AI agents handle customer inquiries, qualify leads, and schedule appointments across your website, social media, and WhatsApp.",
    details: [
      "24/7 customer support",
      "Intelligent lead qualification",
      "Automated appointment scheduling",
      "Multi-platform integration",
    ],
    color: "from-orange-500 to-orange-600",
    delay: 600,
  },
]

export default function ServicesSection() {
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
            // Trigger staggered animation
            services.forEach((service, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, service.id])
              }, service.delay)
            })
          }
        })
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="services"
      ref={sectionRef}
      className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 border border-blue-200 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-purple-200 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4 mr-2" />
            Our Services
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 px-4 leading-tight">
            Complete AI Automation Solutions
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-8 px-4 leading-relaxed">
            We're currently automating growth for a select group of businesses ready to scale with AI. You could be
            next.
          </p>

          {/* CRM Integration Message */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 md:p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-3">
              <Target className="w-5 h-5 md:w-6 md:h-6 text-blue-600 mr-2" />
              <span className="text-base md:text-lg font-semibold text-blue-900">Unified CRM Integration</span>
            </div>
            <p className="text-sm md:text-base text-blue-700 leading-relaxed">
              All services integrate seamlessly with our Client Management/CRM system for complete visibility and
              control
            </p>

            {/* Connection Lines Visual */}
            <div className="flex items-center justify-center mt-4 space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <div className="w-6 md:w-8 h-0.5 bg-blue-300"></div>
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <div className="w-6 md:w-8 h-0.5 bg-blue-300"></div>
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <div className="w-6 md:w-8 h-0.5 bg-blue-300"></div>
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 text-blue-600 ml-2" />
              <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-600 rounded-lg flex items-center justify-center ml-2">
                <Database className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {services.map((service) => {
            const IconComponent = service.icon
            const isVisible = visibleCards.includes(service.id)
            const isHovered = hoveredCard === service.id

            return (
              <Card
                key={service.id}
                className={`group cursor-pointer transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                } ${isHovered ? "scale-105" : ""}`}
                onMouseEnter={() => setHoveredCard(service.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader className="text-center pb-4 px-4 md:px-6">
                  <div
                    className={`w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    <IconComponent className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  <CardTitle className="text-lg md:text-xl font-bold text-gray-900 leading-tight px-2">
                    {service.headline}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0 px-4 md:px-6">
                  <CardDescription className="text-gray-600 mb-6 leading-relaxed text-sm md:text-base">
                    {service.description}
                  </CardDescription>

                  {/* Expandable Details */}
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      isHovered ? "max-h-48 opacity-100 mb-6" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-2 text-blue-600" />
                        Key Features:
                      </h4>
                      <ul className="space-y-2">
                        {service.details.map((detail, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 flex-shrink-0"></div>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Button
                    onClick={() => scrollToSection("#contact")}
                    className={`w-full bg-gradient-to-r ${service.color} hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                  >
                    Learn More
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 mr-2" />
              <span className="text-lg font-semibold">Ready to Transform Your Business?</span>
            </div>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              See how our AI automation solutions can increase your conversions by 300% and boost customer retention.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => scrollToSection("#contact")}
                className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 font-semibold transition-all duration-300 hover:scale-105"
              >
                Schedule Free Consultation
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-3 font-semibold transition-all duration-300 hover:scale-105 bg-transparent"
              >
                View Case Studies
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
