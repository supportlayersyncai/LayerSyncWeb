"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Star, Shield, Clock, CreditCard, Zap, Award } from "lucide-react"
import Tooltip from "@/components/ui/tooltip"

const pricingTiers = [
  {
    id: 1,
    name: "Entry Plan",
    price: 1500,
    description:
      "Perfect for small businesses ready to start generating 2x more leads and revenue with AI that works while you sleep.",
    popular: false,
    deliverables: [
      "AI lead generation system setup",
      "Basic content automation (20 pieces/week)",
      "Email marketing automation",
      "Weekly performance reports",
      "24/7 customer support",
      "30-day results guarantee"
    ],
    benefits: [
      "• Generate 5x more qualified leads automatically",
      "• Convert 30% more website visitors into customers", 
      "• Create 20+ pieces of content per week without writing",
      "• Save 15+ hours per week on marketing tasks",
      "• Get dedicated support that never sleeps",
      "• See results in your first 30 days"
    ],
    cta: "Book My Free AI Plan",
    color: "from-blue-500 to-blue-600",
  },
  {
    id: 2,
    name: "Growth AI System",
    price: 3500,
    description:
      "For businesses serious about scaling fast - get 5x more revenue with advanced AI that handles your entire marketing funnel.",
    popular: true,
    deliverables: [
      "Everything in Entry Plan, plus:",
      "Dedicated AI agent setup",
      "Advanced content automation (50+ pieces/week)",
      "Social media management automation",
      "Paid advertising automation",
      "Monthly strategy calls",
      "Custom performance dashboards",
      "Dedicated success manager"
    ],
    benefits: [
      "• Everything in Entry Plan, plus:",
      "• Run profitable ads on Facebook, Google & LinkedIn automatically",
      "• Get a dedicated success manager who knows your business",
      "• Monthly strategy calls to maximize your results",
      "• Custom dashboards showing exactly how much you're earning",
      "• Scale to 5x revenue without hiring more staff"
    ],
    cta: "Book My Free AI Plan",
    color: "from-purple-500 to-purple-600",
  },
  {
    id: 3,
    name: "Elite AI System",
    price: 5000,
    priceNote: "+",
    description:
      "For established businesses that want to dominate their market - get custom AI built specifically for your industry and scale to 10x revenue.",
    popular: false,
    deliverables: [
      "Everything in Growth AI System, plus:",
      "Custom AI development for your industry",
      "System integration (CRM, tools, databases)",
      "White-label AI solutions",
      "Priority 24/7 support",
      "Quarterly strategy sessions",
      "Unlimited customizations",
      "Dedicated engineering team"
    ],
    benefits: [
      "• Everything in Growth AI System, plus:",
      "• Custom AI built specifically for your industry",
      "• Connect to all your existing systems seamlessly",
      "• White-label AI solutions to sell to your clients",
      "• 24/7 priority support from our engineering team",
      "• Quarterly strategy sessions with AI specialists",
      "• Unlimited customizations and feature requests"
    ],
    cta: "Book My Free AI Plan",
    color: "from-orange-500 to-orange-600",
  },
]

const trustBadges = [
  { icon: Shield, text: "90-Day Money-Back Guarantee" },
  { icon: CreditCard, text: "No Setup Fees" },
  { icon: Clock, text: "Cancel Anytime" },
  { icon: Award, text: "SOC 2 Certified", tooltip: "SOC 2 is a security certification that ensures your data is protected with enterprise-grade security measures" },
]

export default function PricingSection() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly")
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
            // Show all cards immediately to ensure visibility
            setVisibleCards([1, 2, 3])
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const getPrice = (basePrice: number) => {
    if (billingCycle === "annual") {
      return Math.floor(basePrice * 0.85)
    }
    return basePrice
  }

  return (
    <section
      id="pricing"
      ref={sectionRef}
      className="section-spacing bg-dark-gradient relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 border border-purple-200 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-blue-200 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-full text-sm font-medium mb-4 backdrop-blur-sm">
            <Zap className="w-4 h-4 mr-2" />
            Pricing Plans
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">Choose Your Revenue Growth Plan</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Pick the plan that matches your growth goals. All plans include our 90-day money-back guarantee if you don't see results.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-gray-800/50 p-1 rounded-lg flex border border-gray-700/50">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  billingCycle === "monthly" ? "bg-gray-700 text-white shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle("annual")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                  billingCycle === "annual" ? "bg-gray-700 text-white shadow-sm" : "text-gray-400 hover:text-white"
                }`}
              >
                Annual
                <Badge className="ml-2 bg-green-500/20 text-green-400 text-xs">Save 15%</Badge>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards - Single Layout for All Devices */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {pricingTiers.map((tier, index) => {
            const price = getPrice(tier.price)

            return (
              <div key={tier.id} className="w-full">
                <Card
                  className={`relative h-full transition-all duration-300 hover:shadow-xl card-dark ${
                    tier.popular ? "ring-2 ring-green-500 shadow-xl" : ""
                  }`}
                  onMouseEnter={() => setHoveredCard(tier.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  {/* Popular Badge */}
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-gradient-to-r from-green-500 to-cyan-500 text-white px-4 py-2 text-sm font-semibold">
                        <Star className="w-4 h-4 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-4 px-4 pt-6">
                    <CardTitle className="text-lg font-bold text-white mb-2">{tier.name}</CardTitle>
                    <p className="text-gray-300 mb-4 text-sm leading-relaxed">{tier.description}</p>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline justify-center">
                        <span className="text-3xl md:text-4xl font-bold text-white">${price.toLocaleString()}</span>
                        {tier.priceNote && <span className="text-xl font-bold text-white">{tier.priceNote}</span>}
                        <span className="text-gray-400 ml-2 text-sm">/month</span>
                      </div>
                      {billingCycle === "annual" && (
                        <p className="text-sm text-green-600 mt-2">Save ${(tier.price - price) * 12}/year</p>
                      )}
                      {/* Guarantee Text */}
                      <div className="mt-3 text-center">
                        <p className="text-xs text-gray-400 font-medium">
                          90-Day ROI Guarantee | Cancel Anytime | No Setup Fees
                        </p>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="px-4 pb-6 flex-1 flex flex-col">
                    {/* Deliverables List */}
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-white mb-3 text-center">What You Get:</h4>
                      <ul className="space-y-2">
                        {tier.deliverables.map((deliverable, deliverableIndex) => (
                          <li key={deliverableIndex} className="flex items-start text-gray-300">
                            <div className="w-4 h-4 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 bg-cyan-500/20">
                              <Check className="w-2.5 h-2.5 text-cyan-400" />
                            </div>
                            <span className="leading-relaxed text-xs">{deliverable}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Benefits List */}
                    <div className="mb-6 flex-1">
                      <h4 className="text-sm font-semibold text-white mb-3 text-center">Key Benefits:</h4>
                      <ul className="space-y-2">
                        {tier.benefits.map((benefit, benefitIndex) => (
                          <li key={benefitIndex} className="flex items-start text-gray-300">
                            <div className="w-4 h-4 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0 bg-green-500/20">
                              <Check className="w-2.5 h-2.5 text-green-400" />
                            </div>
                            <span className="leading-relaxed text-xs">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* CTA Button */}
                    <Button
                      size="lg"
                      onClick={() => scrollToSection("#contact")}
                      className={`w-full h-10 md:h-12 text-sm md:text-base font-semibold transition-all duration-300 hover:scale-105 ${
                        tier.popular
                          ? "btn-neon"
                          : `bg-gradient-to-r ${tier.color} hover:shadow-lg`
                      }`}
                    >
                      {tier.cta}
                    </Button>

                    {/* Additional Info */}
                    <p className="text-center text-xs text-gray-400 mt-3">
                      Setup in 24-48 hours • No long-term contracts
                    </p>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>

        {/* Trust Elements */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-12">
          <h3 className="text-center text-xl font-bold text-gray-900 mb-8">Why Choose LayerSync AI?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustBadges.map((badge, index) => {
              const BadgeIcon = badge.icon
              return (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                    <BadgeIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  {badge.tooltip ? (
                    <Tooltip content={badge.tooltip}>
                      <span className="font-semibold text-gray-900">{badge.text}</span>
                    </Tooltip>
                  ) : (
                  <span className="font-semibold text-gray-900">{badge.text}</span>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* FAQ Preview */}
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Questions About Our Pricing?</h3>
          <p className="text-gray-600 mb-6">We're here to help you choose the right plan for your business needs.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => scrollToSection("#contact")}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-8 py-3 font-semibold transition-all duration-300 hover:scale-105"
            >
              Schedule Free Consultation
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 font-semibold transition-all duration-300 hover:scale-105 bg-transparent"
            >
              View FAQ
            </Button>
          </div>
        </div>

        {/* Bottom Guarantee */}
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-green-600 mr-3" />
            <h3 className="text-2xl font-bold text-gray-900">90-Day ROI Guarantee</h3>
          </div>
          <p className="text-gray-700 max-w-3xl mx-auto leading-relaxed">
            We're so confident in our AI automation solutions that we guarantee measurable ROI within 90 days, or we'll
            refund your investment. No questions asked.
          </p>
        </div>
      </div>
    </section>
  )
}
