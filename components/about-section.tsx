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
    bio: "With a background in marketing leadership across aviation and national tourism, Tadiwa brings a rare blend of global brand positioning and growth execution. His experience at the Zimbabwe Tourism Authority and Aviation Assistance GmbH gives him a deep understanding of cross-border storytelling, digital experience design, and scalable outreach.",
    expertise: ["Global Brand Positioning", "Growth Marketing", "Cross-Border Strategy", "Digital Experience Design"],
    quote:
      "Marketing should feel like momentum. At LayerSync, we're not just building visibility—we're creating gravity around a brand that moves with the future.",
    achievements: [
      "Marketing leadership at Zimbabwe Tourism Authority",
      "International experience with Aviation Assistance GmbH",
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
    label: "Average ROI",
    description: "Proven results across all implementations",
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
    title: "Strategic Approach",
    description: "We don't just implement technology—we transform your entire business process for maximum impact.",
  },
  {
    icon: Shield,
    title: "Proven Methodology",
    description: "Our 4-step process has delivered consistent results across 500+ successful implementations.",
  },
  {
    icon: Users,
    title: "Dedicated Support",
    description: "24/7 ongoing support and optimization ensures your AI systems continue delivering results.",
  },
  {
    icon: TrendingUp,
    title: "Measurable Results",
    description: "Every implementation comes with clear KPIs and our 90-day ROI guarantee.",
  },
]

export default function AboutSection() {
  const [hoveredMember, setHoveredMember] = useState<number | null>(null)
  const [expandedMember, setExpandedMember] = useState<number | null>(null)

  return (
    <section id="about" className="py-12 md:py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Users className="w-4 h-4 mr-2" />
            About LayerSync AI
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6 px-4 leading-tight">
            Why LayerSync AI Is Your Trusted Partner for AI Transformation
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-4xl mx-auto px-4 leading-relaxed">
            We're currently automating growth for a select group of businesses ready to scale with AI. We're your
            strategic partner in business transformation, delivering measurable results that drive real growth.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="mb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <Target className="w-6 h-6 mr-3 text-blue-600" />
                  Our Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg">
                  To democratize AI automation for businesses of all sizes, making cutting-edge technology accessible
                  and profitable. We believe every business deserves the competitive advantage that intelligent
                  automation provides.
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-gray-900 flex items-center">
                  <Globe className="w-6 h-6 mr-3 text-purple-600" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed text-lg">
                  To become the global leader in AI business transformation, creating a world where intelligent
                  automation empowers businesses to achieve unprecedented growth and efficiency.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Company Statistics */}
        <div className="mb-20">
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Track Record Speaks for Itself</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {companyStats.map((stat, index) => {
              const IconComponent = stat.icon
              return (
                <Card
                  key={index}
                  className="text-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
                >
                  <CardContent className="p-8">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${stat.color} flex items-center justify-center`}
                    >
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>
                    <div
                      className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                    >
                      {stat.number}
                    </div>
                    <h4 className="text-xl font-semibold text-gray-900 mb-2">{stat.label}</h4>
                    <p className="text-gray-600">{stat.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Leadership Team */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Meet Our Leadership Team</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Industry experts with decades of combined experience in AI, business strategy, and technology innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:gap-8">
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
                <CardContent className="p-4 md:p-6">
                  {/* Basic Info */}
                  <div className="text-center mb-4">
                    <h4 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h4>
                    <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                    <p className="text-gray-600 leading-relaxed">{member.bio}</p>
                  </div>

                  {/* Quote */}
                  <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-4 italic text-gray-700">
                    "{member.quote}"
                  </div>

                  {/* Focus Areas */}
                  <div className="mb-4">
                    <h5 className="font-semibold text-gray-900 mb-2">Current Focus:</h5>
                    <ul className="space-y-1">
                      {member.focus.map((focus, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                          {focus}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Expertise Tags */}
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {member.expertise.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium"
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
                    <div className="border-t border-gray-200 pt-4">
                      <h5 className="font-semibold text-gray-900 mb-3">Key Achievements:</h5>
                      <ul className="space-y-2">
                        {member.achievements.map((achievement, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
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

        {/* Industry Expertise */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4 px-4">Industry Expertise</h3>
            <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto mb-8 px-4 leading-relaxed">
              We have the capability and infrastructure to deliver tailored AI systems across law, finance, healthcare,
              recruitment, and tech — with scalable frameworks ready for each industry.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {industries.map((industry, index) => {
              const IconComponent = industry.icon
              return (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                >
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors duration-300">
                      <IconComponent className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="text-base md:text-lg font-semibold text-gray-900">{industry.name}</h4>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Value Propositions */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">What Sets Us Apart</h3>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our unique approach combines cutting-edge technology with business expertise to deliver unmatched results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {valueProp.map((prop, index) => {
              const IconComponent = prop.icon
              return (
                <Card key={index} className="shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4 flex-shrink-0">
                        <IconComponent className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="text-xl font-bold text-gray-900 mb-3">{prop.title}</h4>
                        <p className="text-gray-600 leading-relaxed">{prop.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-12 text-white">
          <div className="flex items-center justify-center mb-4">
            <Play className="w-8 h-8 mr-3" />
            <h3 className="text-2xl font-bold">Ready to Experience the LayerSync Difference?</h3>
          </div>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto text-lg">
            Join our select group of high-impact businesses that have transformed their operations with our proven AI
            automation solutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-3 font-semibold transition-all duration-300 hover:scale-105"
            >
              Schedule Free Strategy Session
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-700 px-8 py-3 font-semibold transition-all duration-300 hover:scale-105 bg-transparent"
            >
              View Case Studies
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
