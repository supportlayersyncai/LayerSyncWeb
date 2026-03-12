"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Users,
  Award,
  Target,
  TrendingUp,
  Shield,
  Zap,
  Globe,
  ExternalLink,
  Play,
  Calendar,
  Star,
  Briefcase,
} from "lucide-react"

const teamMembers = [
  {
    id: 1,
    name: "Kevin Chisango",
    role: "Chief Executive Officer",
    bio: "Kevin brings a strong background in operational strategy and supply chain systems from his leadership role at Hempac Agricultural Solutions, where he focused on solving real-world infrastructure problems in underserved markets. At LayerSync, he translates this same systems-thinking approach into the world of AI automation—ensuring that powerful, scalable solutions are accessible to businesses looking to grow fast and operate lean.",
    expertise: ["Operational Strategy", "Supply Chain Systems", "AI Infrastructure", "Team Leadership"],
    quote:
      "From farming equipment to digital automation—my goal has always been to remove barriers that stop businesses from growing. LayerSync is that mission, reimagined for the AI era.",
    achievements: [
      "Led operational strategy at Hempac Agricultural Solutions",
      "Expert in scalable systems design",
      "Proven track record in underserved markets",
    ],
    focus: [
      "Designing frictionless client onboarding and delivery systems",
      "Scaling AI infrastructure that delivers real-world results",
      "Building a high-performance team culture rooted in execution and innovation",
    ],
  },
  {
    id: 2,
    name: "Tadiwa Gerald Chidzidzi",
    role: "Chief Marketing Officer",
    bio: "With a background in marketing leadership across aviation and national tourism, Tadiwa brings a rare blend of global brand positioning and growth execution. His experience gives him a deep understanding of cross-border storytelling, digital experience design, and scalable outreach.",
    expertise: ["Global Brand Positioning", "Growth Marketing", "Cross-Border Strategy", "Digital Experience Design"],
    quote:
      "Marketing should feel like momentum. At LayerSync, we're not just building visibility—we're creating gravity around a brand that moves with the future.",
    achievements: [
      "Marketing leadership in tourism sector",
      "International aviation marketing experience",
      "Expert in cross-border storytelling and brand positioning",
    ],
    focus: [
      "Go-to-market strategy for automation and AI products",
      "Content systems that drive demand across platforms",
      "Brand voice and visual identity across international markets",
    ],
  },
  {
    id: 3,
    name: "Andre Dingiswayo",
    role: "Chief Technology Officer",
    bio: "Andre is a full-stack developer and fintech systems architect who has built technology for banks, brokers, and financial institutions across Africa. His expertise in secure, scalable infrastructure directly fuels LayerSync's ability to deliver powerful backend systems for automation, AI chat agents, database activations, and custom workflows.",
    expertise: ["Full-Stack Development", "Fintech Architecture", "Secure Infrastructure", "AI Systems"],
    quote:
      "Every great system feels invisible—it just works. At LayerSync, I build those invisible engines so clients can move faster, smarter, and more efficiently.",
    achievements: [
      "Built technology for banks and financial institutions across Africa",
      "Expert in secure, scalable infrastructure",
      "Proven fintech systems architect",
    ],
    focus: [
      "Leading development of automation architecture and client dashboards",
      "Building secure, low-latency systems for dynamic AI operations",
      "Integrating data pipelines that support advanced decision-making and CRM sync",
    ],
  },
]

const companyStats = [
  {
    icon: TrendingUp,
    number: "300%",
    label: "Growth Target",
    description: "Our benchmark for client success",
    color: "from-green-500 to-green-600",
  },
  {
    icon: Users,
    number: "Select",
    label: "Business Partners",
    description: "Currently automating growth for businesses ready to scale",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Calendar,
    number: "2+",
    label: "Years Experience",
    description: "Deep expertise in AI automation",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: Award,
    number: "98%",
    label: "Client Retention",
    description: "Long-term partnerships built on results",
    color: "from-orange-500 to-orange-600",
  },
]

const industries = [
  { name: "Legal Services", icon: Shield },
  { name: "Financial Services", icon: TrendingUp },
  { name: "Healthcare", icon: Users },
  { name: "Recruitment", icon: Briefcase },
  { name: "Technology", icon: Zap },
]

const valueProp = [
  {
    icon: Target,
    title: "We Focus on Revenue, Not Tech",
    description: "• Every AI system we build is designed to make you more money",
    description2: "• We measure success by your revenue growth, not technical complexity",
    description3: "• You see results in your first month, not after 6 months of setup"
  },
  {
    icon: Shield,
    title: "Proven 4-Step Process",
    description: "• Our method has generated 300% ROI for every client",
    description2: "• We've helped 50+ businesses double their revenue",
    description3: "• 90-day money-back guarantee if you don't see results"
  },
  {
    icon: Users,
    title: "24/7 Support That Actually Helps",
    description: "• Real humans answer your questions, not chatbots",
    description2: "• We optimize your systems weekly to maximize results",
    description3: "• You get a dedicated success manager who knows your business"
  },
  {
    icon: TrendingUp,
    title: "Guaranteed Revenue Growth",
    description: "• We track every metric that matters to your bottom line",
    description2: "• Monthly reports show exactly how much money you're making",
    description3: "• If we don't deliver results, you get your money back"
  },
]

export default function AboutSection() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)
  const [expandedMember, setExpandedMember] = useState<number | null>(null)

  return (
    <section id="about" className="py-12 sm:py-16 lg:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container-responsive">
        {/* Section Header - Mobile optimized */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Users className="w-3 sm:w-4 h-3 sm:h-4 mr-1.5 sm:mr-2" />
            About LayerSync AI
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            Why Businesses Choose Us for 300% Revenue Growth
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We don't just implement AI - we transform your entire business to generate more revenue, save time, and scale faster than you ever thought possible.
          </p>
        </div>

        {/* Mission & Vision - Mobile single column */}
        <div className="mb-16 sm:mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                  <Target className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3 text-blue-600 flex-shrink-0" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                  To help every business double their revenue with AI that actually works - no technical complexity, no months of setup, just real results that start showing in your first month.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
                  <Globe className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3 text-purple-600 flex-shrink-0" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                  To be the go-to partner for businesses that want to scale fast and smart - where every AI system we build delivers measurable revenue growth from day one.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Company Statistics - Mobile responsive grid */}
        <div className="mb-16 sm:mb-20">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-8 sm:mb-12">
            Results That Speak for Themselves
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {companyStats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card
                  key={index}
                  className="text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <div
                      className={`w-12 sm:w-14 lg:w-16 h-12 sm:h-14 lg:h-16 mx-auto mb-3 sm:mb-4 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center shadow-lg`}
                    >
                      <IconComponent className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 text-white" />
                    </div>
                    <div
                      className={`text-3xl sm:text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                    >
                      {stat.number}
                    </div>
                    <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{stat.label}</h4>
                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed">{stat.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Leadership Team - Mobile single column */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Meet Our Leadership Team</h3>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Industry experts with decades of combined experience in AI, business strategy, and technology innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:gap-8">
            {teamMembers.map((member) => (
              <Card
                key={member.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-2xl ${
                  hoveredMember === member.id ? "shadow-xl -translate-y-2" : ""
                } ${expandedMember === member.id ? "ring-2 ring-blue-500" : ""}`}
                onMouseEnter={() => setHoveredMember(member.id)}
                onMouseLeave={() => setHoveredMember(null)}
                onClick={() => setExpandedMember(expandedMember === member.id ? null : member.id)}
              >
                <CardContent className="p-4 sm:p-6">
                  {/* Basic Info */}
                  <div className="text-center mb-4 sm:mb-6">
                    <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">{member.name}</h4>
                    <p className="text-blue-600 font-semibold mb-3 text-sm sm:text-base">{member.role}</p>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{member.bio}</p>
                  </div>

                  {/* Quote */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-3 sm:p-4 mb-4 sm:mb-6 italic text-gray-800 text-sm sm:text-base">
                    "{member.quote}"
                  </div>

                  {/* Focus Areas */}
                  <div className="mb-4 sm:mb-6">
                    <h5 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">Current Focus:</h5>
                    <ul className="space-y-1 sm:space-y-2">
                      {member.focus.map((focus, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                          {focus}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-2 justify-center mb-4 sm:mb-6">
                    {member.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Expandable Achievements */}
                  <div
                    className={`transition-all duration-300 overflow-hidden ${
                      expandedMember === member.id ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="border-t border-gray-200 pt-3 sm:pt-4">
                      <h5 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">
                        Key Achievements:
                      </h5>
                      <ul className="space-y-1 sm:space-y-2">
                        {member.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-700">
                            <Star className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-500 mr-2 flex-shrink-0" />
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Industry Expertise - Mobile responsive */}
        <div className="mb-16 sm:mb-20">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Industry Expertise</h3>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-4xl mx-auto mb-6 sm:mb-8 leading-relaxed">
              We have the capability and infrastructure to deliver tailored AI systems across law, finance, healthcare,
              recruitment, and tech — with scalable frameworks ready for each industry.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {industries.map((industry, index) => {
              const IconComponent = industry.icon
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                >
                  <CardContent className="p-4 sm:p-6 text-center">
                    <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 sm:mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                      <IconComponent className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                    </div>
                    <h4 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900">{industry.name}</h4>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Value Propositions - Mobile single column */}
        <div className="mb-12 sm:mb-16">
          <div className="text-center mb-8 sm:mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">What Sets Us Apart</h3>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Our unique approach combines cutting-edge technology with business expertise to deliver unmatched results.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {valueProp.map((prop, index) => {
              const IconComponent = prop.icon
              return (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-4 sm:p-6 lg:p-8">
                    <div className="flex items-start">
                      <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-3 sm:mr-4 flex-shrink-0">
                        <IconComponent className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">{prop.title}</h4>
                        <div className="space-y-1">
                          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{prop.description}</p>
                          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{prop.description2}</p>
                          <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{prop.description3}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* CTA Section - Mobile optimized */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 sm:p-8 lg:p-12 text-white">
          <div className="flex flex-col sm:flex-row items-center justify-center mb-4 sm:mb-6">
            <Play className="w-6 sm:w-8 h-6 sm:h-8 mb-2 sm:mb-0 sm:mr-3 flex-shrink-0" />
            <h3 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
              Ready to Experience the LayerSync Difference?
            </h3>
          </div>
          <p className="text-blue-100 mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg leading-relaxed">
            Join our select group of high-impact businesses that have transformed their operations with our proven AI
            automation solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-white text-blue-700 hover:bg-blue-50 px-6 sm:px-8 py-3 font-semibold transition-all duration-300 hover:scale-105 min-h-[48px] touch-manipulation"
            >
              Schedule Free Strategy Session
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("#pricing")}
              className="w-full sm:w-auto border-2 border-white text-white hover:bg-white hover:text-blue-700 px-6 sm:px-8 py-3 font-semibold transition-all duration-300 hover:scale-105 bg-transparent min-h-[48px] touch-manipulation"
            >
              View Consultation Options
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
