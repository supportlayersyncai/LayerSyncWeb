"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Target, 
  PenTool, 
  Workflow, 
  BarChart3, 
  ArrowRight, 
  Sparkles, 
  Search,
  Users,
  Mail,
  TrendingUp,
  Award,
  FileText,
  Globe,
  Zap,
  UserCheck,
  FileCheck,
  HeadphonesIcon,
  Shield,
  Calendar,
  Database,
  Brain,
  Activity,
  Eye,
  PieChart
} from "lucide-react"

const systems = [
  {
    id: 1,
    icon: Target,
    title: "Sales & Lead Generation Systems",
    description:
      "Comprehensive AI-driven sales infrastructures that identify, research, engage, and convert high-value prospects automatically.",
    components: [
      { icon: Search, text: "Intelligent Prospect Identification" },
      { icon: Database, text: "Automated Research & Enrichment" },
      { icon: Mail, text: "Multi-Channel Outreach" },
      { icon: TrendingUp, text: "Dynamic Nurturing Sequences" },
      { icon: Award, text: "Intelligent Lead Scoring" },
    ],
    cta: "See How It Works",
    color: "from-blue-500 to-cyan-500",
    delay: 0,
  },
  {
    id: 2,
    icon: PenTool,
    title: "Content Creation Systems",
    description:
      "AI content engines that research, generate, optimize, and distribute high-performing content across platforms.",
    components: [
      { icon: Eye, text: "Automated Market & Competitor Research" },
      { icon: FileText, text: "Multi-Format Content Generation" },
      { icon: TrendingUp, text: "SEO Optimization" },
      { icon: Sparkles, text: "Brand Voice Consistency" },
      { icon: Activity, text: "Performance Tracking & Optimization" },
    ],
    cta: "Build My Content Engine",
    color: "from-emerald-500 to-green-500",
    delay: 200,
  },
  {
    id: 3,
    icon: Workflow,
    title: "Operational Workflow Systems",
    description:
      "End-to-end AI solutions that streamline onboarding, support, and project management for scalable operations.",
    components: [
      { icon: UserCheck, text: "Client Onboarding Automation" },
      { icon: FileCheck, text: "Document Processing & Management" },
      { icon: HeadphonesIcon, text: "Customer Support Automation" },
      { icon: Shield, text: "Quality Control & Compliance Monitoring" },
      { icon: Calendar, text: "Project Management & Resource Allocation" },
    ],
    cta: "Automate My Operations",
    color: "from-purple-500 to-pink-500",
    delay: 400,
  },
  {
    id: 4,
    icon: BarChart3,
    title: "Data Processing & Analytics Systems",
    description:
      "Data intelligence platforms that unify, analyze, and visualize business insights for better decision-making.",
    components: [
      { icon: PieChart, text: "Advanced Analytics Platforms" },
      { icon: Brain, text: "Predictive Modeling" },
      { icon: Zap, text: "Real-Time Optimization" },
      { icon: Eye, text: "Competitive Intelligence Gathering" },
      { icon: BarChart3, text: "Executive Dashboards & Reporting" },
    ],
    cta: "Unlock My Data Insights",
    color: "from-orange-500 to-red-500",
    delay: 600,
  },
]

const scrollToSection = (sectionId: string) => {
  const element = document.querySelector(sectionId)
  if (element) {
    const headerOffset = 80
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    })
  }
}

export default function ServicesSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            systems.forEach((system, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, system.id])
              }, system.delay)
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
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-32 sm:w-48 lg:w-72 h-32 sm:h-48 lg:h-72 bg-gradient-to-r from-green-500/20 to-cyan-500/20 rounded-full blur-xl sm:blur-2xl lg:blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-28 sm:w-40 lg:w-64 h-28 sm:h-40 lg:h-64 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-xl sm:blur-2xl lg:blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-64 lg:w-96 h-48 sm:h-64 lg:h-96 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 rounded-full blur-xl sm:blur-2xl lg:blur-3xl"></div>
      </div>

      <div className="container-responsive relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm">
            <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 mr-1.5 sm:mr-2" />
            AI Systems That Scale Your Business
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Intelligent Automation for Every Business Function
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-white max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed font-light">
            From lead generation to data analytics, our AI systems work 24/7 to automate operations, optimize performance, and drive measurable growth.
          </p>
        </div>

        {/* Systems Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-16 sm:mb-20">
          {systems.map((system) => {
            const Icon = system.icon
            const isVisible = visibleCards.includes(system.id)
            const isHovered = hoveredCard === system.id

            return (
              <Card
                key={system.id}
                className={`card-modern group relative overflow-hidden transition-all duration-700 cursor-pointer ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                } ${isHovered ? "scale-[1.02] shadow-2xl" : ""}`}
                onMouseEnter={() => setHoveredCard(system.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Gradient overlay on hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${system.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}
                ></div>

                <CardHeader className="pb-4">
                  <div className="flex items-start space-x-4">
                    <div
                      className={`w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-r ${system.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform duration-500`}
                    >
                      <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-gray-900 group-hover:to-gray-700 transition-all duration-500">
                        {system.title}
                      </CardTitle>
                    </div>
                  </div>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mt-3">
                    {system.description}
                  </p>
                </CardHeader>

                <CardContent>
                  {/* Key Components */}
                  <div className="mb-6">
                    <h4 className="what-you-get-label mb-3 sm:mb-4 flex items-center text-xs sm:text-sm">
                      <Zap className="w-3 sm:w-4 h-3 sm:h-4 mr-2 text-cyan-500" />
                      Key Components:
                    </h4>
                    <ul className="space-y-2 sm:space-y-3">
                      {system.components.map((component, index) => {
                        const ComponentIcon = component.icon
                        return (
                          <li
                            key={index}
                            className="flex items-start text-gray-700 text-sm sm:text-base group/item"
                          >
                            <div
                              className={`w-5 h-5 rounded-lg flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 bg-gradient-to-r ${system.color} bg-opacity-10 group-hover/item:scale-110 transition-transform duration-300`}
                            >
                              <ComponentIcon className="w-3 h-3 text-gray-700" />
                            </div>
                            <span className="leading-relaxed">{component.text}</span>
                          </li>
                        )
                      })}
                    </ul>
                  </div>

                  {/* CTA Button */}
                  <Button
                    onClick={() => scrollToSection("#contact")}
                    className={`w-full bg-gradient-to-r ${system.color} hover:shadow-2xl transition-all duration-500 group-hover:scale-105 rounded-lg sm:rounded-xl lg:rounded-2xl py-2.5 sm:py-3 font-semibold text-white border-0 text-sm sm:text-base touch-manipulation min-h-[44px] sm:min-h-[48px] cta-button`}
                  >
                    {system.cta}
                    <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16 sm:mt-20">
          <div className="card-dark rounded-xl sm:rounded-2xl lg:rounded-3xl p-6 sm:p-8 lg:p-12 text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-24 sm:w-32 lg:w-64 h-24 sm:h-32 lg:h-64 bg-gradient-to-l from-blue-500/15 to-transparent rounded-full blur-xl sm:blur-2xl lg:blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-24 sm:w-32 lg:w-64 h-24 sm:h-32 lg:h-64 bg-gradient-to-r from-purple-500/15 to-transparent rounded-full blur-xl sm:blur-2xl lg:blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-3 sm:mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-sm sm:text-base lg:text-lg text-white/90 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed">
                Let's build a custom AI system tailored to your unique business needs. Book a free consultation to get started.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
                <Button
                  size="lg"
                  onClick={() => scrollToSection("#contact")}
                  className="w-full sm:w-auto btn-neon px-6 sm:px-8 py-3 sm:py-4 font-bold rounded-lg sm:rounded-xl lg:rounded-2xl min-w-[250px] touch-manipulation min-h-[48px] cta-button"
                >
                  Book Your Free Consultation
                  <Sparkles className="ml-2 w-4 sm:w-5 h-4 sm:h-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => scrollToSection("#about")}
                  className="w-full sm:w-auto btn-ghost-neon px-6 sm:px-8 py-3 sm:py-4 font-bold rounded-lg sm:rounded-xl lg:rounded-2xl min-w-[200px] touch-manipulation min-h-[48px] cta-button"
                >
                  <BarChart3 className="mr-2 w-4 sm:w-5 h-4 sm:h-5" />
                  Learn About Us
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
