"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Users, PenTool, MessageCircle, ArrowRight, TrendingUp, Clock, Target, Sparkles } from "lucide-react"

const services = [
  {
    id: 1,
    icon: Database,
    headline: "Turn Your Existing Data Into Revenue",
    description:
      "Transform dormant customer databases into active revenue streams that generate 3x more sales from your current customer base.",
    benefits: [
      "• Recover 40% more revenue from existing customers",
      "• Automatically identify high-value prospects in your database", 
      "• Send personalized messages that convert 5x better",
      "• Track every interaction to optimize your approach"
    ],
    color: "from-blue-500 to-cyan-500",
    delay: 0,
  },
  {
    id: 2,
    icon: Users,
    headline: "Generate Qualified Leads 24/7",
    description:
      "Never miss another opportunity with AI that finds, qualifies, and nurtures leads while you sleep - delivering ready-to-buy prospects.",
    benefits: [
      "• Find 10x more qualified leads automatically",
      "• Qualify prospects with 95% accuracy",
      "• Follow up instantly - even at 2 AM",
      "• Convert 3x more leads into paying customers"
    ],
    color: "from-purple-500 to-pink-500",
    delay: 200,
  },
  {
    id: 3,
    icon: PenTool,
    headline: "Create Content That Sells",
    description:
      "Generate high-converting content that sounds like you wrote it - blogs, social posts, emails, and ads that drive real business results.",
    benefits: [
      "• Write 50+ pieces of content per week automatically",
      "• Maintain your unique brand voice in every piece",
      "• Create SEO-optimized content that ranks higher",
      "• Save 20+ hours per week on content creation"
    ],
    color: "from-emerald-500 to-green-500",
    delay: 400,
  },
  {
    id: 4,
    icon: MessageCircle,
    headline: "Never Miss a Customer Again",
    description:
      "AI agents that work around the clock to answer questions, qualify leads, and book appointments - so you never lose a potential sale.",
    benefits: [
      "• Answer customer questions instantly, 24/7",
      "• Qualify leads and book appointments automatically",
      "• Handle 10x more inquiries without hiring staff",
      "• Convert 40% more website visitors into customers"
    ],
    color: "from-orange-500 to-red-500",
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
      className="section-spacing bg-dark-gradient relative overflow-hidden"
    >
      {/* Enhanced Background Pattern - Mobile optimized */}
      <div className="absolute inset-0">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-32 sm:w-48 lg:w-72 h-32 sm:h-48 lg:h-72 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full blur-xl sm:blur-2xl lg:blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-28 sm:w-40 lg:w-64 h-28 sm:h-40 lg:h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl sm:blur-2xl lg:blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-xl sm:blur-2xl lg:blur-3xl"></div>
      </div>

      <div className="container-responsive relative z-10">
        {/* Section Header - Mobile optimized */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm">
            <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 mr-1.5 sm:mr-2" />
            Our Services
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            How We Help You Double Your Revenue
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed font-light">
            Our AI systems work 24/7 to find more customers, close more deals, and grow your business while you focus on what matters most.
          </p>

          {/* CRM Integration Message - Mobile responsive */}
          <div className="card-dark rounded-xl sm:rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-center mb-3 sm:mb-4">
              <div className="w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center mb-2 sm:mb-0 sm:mr-3 shadow-lg">
                <Target className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 text-white" />
              </div>
              <span className="text-sm sm:text-base lg:text-xl font-bold text-green-400 text-center sm:text-left">
                Unified CRM Integration
              </span>
            </div>
            <p className="text-xs sm:text-sm lg:text-lg text-gray-300 leading-relaxed text-center">
              Everything connects to your existing systems - no technical headaches, just results
            </p>

            {/* Connection Lines Visual - Mobile responsive */}
            <div className="flex items-center justify-center mt-4 sm:mt-6 space-x-1 sm:space-x-2 lg:space-x-3 overflow-x-auto pb-2">
              {services.map((service, index) => (
                <div key={index} className="flex items-center flex-shrink-0">
                  <div
                    className={`w-2 sm:w-3 lg:w-4 h-2 sm:h-3 lg:h-4 bg-gradient-to-r ${service.color} rounded-full shadow-lg`}
                  ></div>
                  {index < services.length - 1 && (
                    <div className="w-2 sm:w-4 lg:w-8 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 mx-0.5 sm:mx-1 lg:mx-2"></div>
                  )}
                </div>
              ))}
              <ArrowRight className="w-3 sm:w-4 lg:w-5 h-3 sm:h-4 lg:h-5 text-blue-600 ml-2 sm:ml-4 flex-shrink-0" />
              <div className="w-4 sm:w-6 lg:w-8 h-4 sm:h-6 lg:h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md sm:rounded-lg lg:rounded-xl flex items-center justify-center ml-1 sm:ml-2 shadow-lg flex-shrink-0">
                <Database className="w-2 sm:w-3 lg:w-4 h-2 sm:h-3 lg:h-4 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Services Grid - Mobile vertical stacking */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {services.map((service) => {
            const IconComponent = service.icon
            const isVisible = visibleCards.includes(service.id)
            const isHovered = hoveredCard === service.id

            return (
              <Card
                key={service.id}
                className={`group cursor-pointer transition-all duration-700 hover:shadow-2xl bg-white/90 backdrop-blur-xl border border-white/30 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl touch-manipulation ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"
                } ${isHovered ? "lg:scale-105 lg:-translate-y-4" : ""}`}
                onMouseEnter={() => setHoveredCard(service.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <CardHeader className="text-center pb-3 sm:pb-4 px-4 sm:px-6 pt-6 sm:pt-8">
                  <div
                    className={`w-12 sm:w-16 lg:w-20 h-12 sm:h-16 lg:h-20 mx-auto mb-4 sm:mb-6 rounded-xl sm:rounded-2xl lg:rounded-3xl bg-gradient-to-r ${service.color} flex items-center justify-center transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 shadow-2xl`}
                  >
                    <IconComponent className="w-6 sm:w-8 lg:w-10 h-6 sm:h-8 lg:h-10 text-white" />
                  </div>
                  <CardTitle className="text-base sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-800 leading-tight mb-3 sm:mb-4">
                    {service.headline}
                  </CardTitle>
                </CardHeader>

                <CardContent className="pt-0 px-4 sm:px-6 pb-6 sm:pb-8">
                  <CardDescription className="text-gray-700 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    {service.description}
                  </CardDescription>

                  {/* Benefits List - Always visible */}
                  <div className="mb-4 sm:mb-6">
                    <h4 className="font-bold text-gray-800 mb-3 sm:mb-4 flex items-center text-xs sm:text-sm">
                      <TrendingUp className="w-3 sm:w-4 h-3 sm:h-4 mr-2 text-green-600" />
                      What You Get:
                    </h4>
                    <ul className="space-y-2 sm:space-y-3">
                      {service.benefits.map((benefit, index) => (
                        <li key={index} className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Button
                    onClick={() => scrollToSection("#contact")}
                    className={`w-full bg-gradient-to-r ${service.color} hover:shadow-2xl transition-all duration-500 group-hover:scale-105 rounded-lg sm:rounded-xl lg:rounded-2xl py-2.5 sm:py-3 font-semibold text-white border-0 text-sm sm:text-base touch-manipulation min-h-[44px] sm:min-h-[48px]`}
                  >
                    Learn More
                    <ArrowRight className="w-3 sm:w-4 h-3 sm:h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA Section - Mobile optimized */}
        <div className="text-center mt-16 sm:mt-20">
          <div className="card-dark rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-24 sm:w-32 lg:w-64 h-24 sm:h-32 lg:h-64 bg-gradient-to-l from-blue-500/15 to-transparent rounded-full blur-xl sm:blur-2xl lg:blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 sm:w-32 lg:w-64 h-24 sm:h-32 lg:h-64 bg-gradient-to-r from-purple-500/15 to-transparent rounded-full blur-xl sm:blur-2xl lg:blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
                <div className="w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 bg-white/10 backdrop-blur-sm rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center mb-2 sm:mb-0 sm:mr-3 border border-white/20 shadow-lg">
                  <Clock className="w-4 sm:w-5 lg:w-6 h-4 sm:h-5 lg:h-6 text-blue-300" />
                </div>
                <span className="text-base sm:text-lg lg:text-2xl font-bold text-center sm:text-left">
                  Ready to Transform Your Business?
                </span>
              </div>
              <p className="text-blue-100 mb-6 sm:mb-8 max-w-3xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed">
                Join businesses that are already seeing 3x more leads, 40% higher conversion rates, and 20+ hours saved per week.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 lg:gap-6 justify-center">
                <Button
                  size="lg"
                  onClick={() => scrollToSection("#contact")}
                  className="w-full sm:w-auto btn-neon px-6 sm:px-8 py-3 sm:py-4 font-bold rounded-lg sm:rounded-xl lg:rounded-2xl min-w-[250px] touch-manipulation min-h-[48px]"
                >
                  Schedule Free Consultation
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto btn-ghost-neon px-6 sm:px-8 py-3 sm:py-4 font-bold rounded-lg sm:rounded-xl lg:rounded-2xl min-w-[200px] touch-manipulation min-h-[48px]"
                >
                  View Case Studies
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
