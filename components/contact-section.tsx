"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Phone,
  Mail,
  Calendar,
  MessageCircle,
  Shield,
  Clock,
  Star,
  Users,
  ArrowRight,
  Lock,
  Award,
  Sparkles,
} from "lucide-react"

const revenueRanges = [
  "Under $10K/month",
  "$10K - $50K/month",
  "$50K - $100K/month",
  "$100K - $500K/month",
  "$500K - $1M/month",
  "Over $1M/month",
]

const primaryChallenges = [
  "Lead generation and qualification",
  "Customer retention and engagement",
  "Content creation and marketing",
  "Sales process automation",
  "Customer support efficiency",
  "Data management and insights",
  "Other (please specify)",
]

const contactMethods = [
  {
    icon: Phone,
    title: "Call Us Directly",
    description: "Speak with an AI specialist",
    action: "+263 78 377 1054",
    link: "tel:+263783771054",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Mail,
    title: "Email Us",
    description: "Get a response within 2 hours",
    action: "hello@layersyncai.com",
    link: "mailto:hello@layersyncai.com",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Calendar,
    title: "Book a Meeting",
    description: "Schedule at your convenience",
    action: "View Available Times",
    link: "#calendar",
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our AI assistant",
    action: "Start Conversation",
    link: "#chat",
    color: "from-orange-500 to-red-500",
  },
]

const faqItems = [
  {
    question: "What happens during the free strategy session?",
    answer:
      "We'll analyze your current processes, identify automation opportunities, and create a custom roadmap for your business growth.",
  },
  {
    question: "How long does implementation take?",
    answer: "Most implementations are completed within 2-4 weeks, depending on the complexity of your requirements.",
  },
  {
    question: "Do you offer ongoing support?",
    answer:
      "Yes, all plans include ongoing support, optimization, and regular performance reviews to ensure continued success.",
  },
]

export default function ContactSection() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    company: "",
    phone: "",
    revenue: "",
    challenge: "",
    additionalInfo: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const sectionRef = useRef<HTMLElement>(null)

  const validateField = (name: string, value: string) => {
    const newErrors = { ...errors }

    switch (name) {
      case "fullName":
        if (!value.trim()) {
          newErrors.fullName = "Full name is required"
        } else if (value.trim().length < 2) {
          newErrors.fullName = "Please enter your full name"
        } else {
          delete newErrors.fullName
        }
        break
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!value.trim()) {
          newErrors.email = "Email is required"
        } else if (!emailRegex.test(value)) {
          newErrors.email = "Please enter a valid email address"
        } else {
          delete newErrors.email
        }
        break
      case "company":
        if (!value.trim()) {
          newErrors.company = "Company name is required"
        } else {
          delete newErrors.company
        }
        break
      case "phone":
        const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
        if (!value.trim()) {
          newErrors.phone = "Phone number is required"
        } else if (!phoneRegex.test(value.replace(/[\s\-()]/g, ""))) {
          newErrors.phone = "Please enter a valid phone number"
        } else {
          delete newErrors.phone
        }
        break
    }

    setErrors(newErrors)
  }

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
    validateField(name, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validate all fields
    Object.keys(formData).forEach((key) => {
      if (key !== "additionalInfo") {
        validateField(key, formData[key as keyof typeof formData])
      }
    })

    // Check if form is valid
    const hasErrors = Object.keys(errors).length > 0
    const hasEmptyRequired = !formData.fullName || !formData.email || !formData.company || !formData.phone

    if (hasErrors || hasEmptyRequired) {
      setIsSubmitting(false)
      return
    }

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)

    // Redirect to Calendly instead of showing success message
    window.open("https://calendly.com/layersyncai/strategy-call", "_blank")

    // Reset form
    setFormData({
      fullName: "",
      email: "",
      company: "",
      phone: "",
      revenue: "",
      challenge: "",
      additionalInfo: "",
    })
    setErrors({})
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden safe-area-bottom"
    >
      {/* Enhanced Background Elements - Mobile optimized */}
      <div className="absolute inset-0">
        <div className="absolute top-10 sm:top-20 left-10 sm:left-20 w-64 sm:w-80 lg:w-96 h-64 sm:h-80 lg:h-96 bg-gradient-to-r from-blue-400/8 to-purple-600/8 rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-48 sm:w-64 lg:w-80 h-48 sm:h-64 lg:h-80 bg-gradient-to-r from-purple-400/8 to-pink-600/8 rounded-full blur-2xl sm:blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 sm:w-48 lg:w-64 h-32 sm:h-48 lg:h-64 bg-gradient-to-r from-cyan-400/4 to-blue-600/4 rounded-full blur-xl sm:blur-2xl"></div>
      </div>

      <div className="container-responsive relative z-10">
        {/* Section Header - Mobile optimized */}
        <div className="text-center mb-12 sm:mb-16">
          <div className="inline-flex items-center px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-white/90 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
            <Sparkles className="w-3 sm:w-4 h-3 sm:h-4 mr-1.5 sm:mr-2 text-blue-300" />
            Get Your Free AI Strategy Session
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight">
            Ready to Transform Your Business?
          </h2>
          <p className="text-base sm:text-lg lg:text-xl text-blue-100/90 max-w-4xl mx-auto leading-relaxed font-light">
            Discover automation opportunities in 2-3 minutes and get your personalized AI strategy roadmap.
          </p>
        </div>

        {/* Main Content - Mobile responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Lead Capture Form - Mobile optimized */}
          <Card className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl">
            <CardHeader className="px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
              <CardTitle className="text-xl sm:text-2xl lg:text-3xl font-bold text-white text-center mb-3 sm:mb-4">
                Get Your Free AI Strategy Session
              </CardTitle>
              <p className="text-white/80 text-center text-sm sm:text-base lg:text-lg leading-relaxed">
                Discover automation opportunities in 2-3 minutes
              </p>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 form-modern">
                {/* Full Name - Mobile optimized */}
                <div className="relative">
                  <Label
                    htmlFor="fullName"
                    className={`absolute left-3 sm:left-4 transition-all duration-200 pointer-events-none text-white/70 ${
                      focusedField === "fullName" || formData.fullName
                        ? "top-2 text-xs text-blue-300"
                        : "top-3 sm:top-4 text-sm sm:text-base"
                    }`}
                  >
                    Full Name *
                  </Label>
                  <Input
                    id="fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange("fullName", e.target.value)}
                    onFocus={() => setFocusedField("fullName")}
                    onBlur={() => setFocusedField(null)}
                    className={`pt-5 sm:pt-6 pb-2 sm:pb-3 h-12 sm:h-14 text-sm sm:text-base text-white touch-manipulation ${
                      errors.fullName ? "border-red-400" : "border-white/30"
                    }`}
                  />
                  {errors.fullName && <p className="text-red-300 text-xs sm:text-sm mt-1">{errors.fullName}</p>}
                </div>

                {/* Business Email - Mobile optimized */}
                <div className="relative">
                  <Label
                    htmlFor="email"
                    className={`absolute left-3 sm:left-4 transition-all duration-200 pointer-events-none text-white/70 ${
                      focusedField === "email" || formData.email
                        ? "top-2 text-xs text-blue-300"
                        : "top-3 sm:top-4 text-sm sm:text-base"
                    }`}
                  >
                    Business Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    className={`pt-5 sm:pt-6 pb-2 sm:pb-3 h-12 sm:h-14 text-sm sm:text-base text-white touch-manipulation ${
                      errors.email ? "border-red-400" : "border-white/30"
                    }`}
                  />
                  {errors.email && <p className="text-red-300 text-xs sm:text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Company Name - Mobile optimized */}
                <div className="relative">
                  <Label
                    htmlFor="company"
                    className={`absolute left-3 sm:left-4 transition-all duration-200 pointer-events-none text-white/70 ${
                      focusedField === "company" || formData.company
                        ? "top-2 text-xs text-blue-300"
                        : "top-3 sm:top-4 text-sm sm:text-base"
                    }`}
                  >
                    Company Name *
                  </Label>
                  <Input
                    id="company"
                    type="text"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    onFocus={() => setFocusedField("company")}
                    onBlur={() => setFocusedField(null)}
                    className={`pt-5 sm:pt-6 pb-2 sm:pb-3 h-12 sm:h-14 text-sm sm:text-base text-white touch-manipulation ${
                      errors.company ? "border-red-400" : "border-white/30"
                    }`}
                  />
                  {errors.company && <p className="text-red-300 text-xs sm:text-sm mt-1">{errors.company}</p>}
                </div>

                {/* Phone Number - Mobile optimized */}
                <div className="relative">
                  <Label
                    htmlFor="phone"
                    className={`absolute left-3 sm:left-4 transition-all duration-200 pointer-events-none text-white/70 ${
                      focusedField === "phone" || formData.phone
                        ? "top-2 text-xs text-blue-300"
                        : "top-3 sm:top-4 text-sm sm:text-base"
                    }`}
                  >
                    Phone Number *
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    onFocus={() => setFocusedField("phone")}
                    onBlur={() => setFocusedField(null)}
                    className={`pt-5 sm:pt-6 pb-2 sm:pb-3 h-12 sm:h-14 text-sm sm:text-base text-white touch-manipulation ${
                      errors.phone ? "border-red-400" : "border-white/30"
                    }`}
                  />
                  {errors.phone && <p className="text-red-300 text-xs sm:text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Monthly Revenue Range - Mobile optimized */}
                <div>
                  <Label htmlFor="revenue" className="text-xs sm:text-sm font-medium text-white/80 mb-2 sm:mb-3 block">
                    Monthly Revenue Range
                  </Label>
                  <Select value={formData.revenue} onValueChange={(value) => handleInputChange("revenue", value)}>
                    <SelectTrigger className="h-12 sm:h-14 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl sm:rounded-2xl text-white text-sm sm:text-base touch-manipulation">
                      <SelectValue placeholder="Select your monthly revenue range" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 rounded-xl sm:rounded-2xl">
                      {revenueRanges.map((range) => (
                        <SelectItem
                          key={range}
                          value={range}
                          className="text-white hover:bg-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base"
                        >
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Primary Challenge - Mobile optimized */}
                <div>
                  <Label
                    htmlFor="challenge"
                    className="text-xs sm:text-sm font-medium text-white/80 mb-2 sm:mb-3 block"
                  >
                    Primary Challenge
                  </Label>
                  <Select value={formData.challenge} onValueChange={(value) => handleInputChange("challenge", value)}>
                    <SelectTrigger className="h-12 sm:h-14 bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl sm:rounded-2xl text-white text-sm sm:text-base touch-manipulation">
                      <SelectValue placeholder="What's your biggest business challenge?" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-slate-600 rounded-xl sm:rounded-2xl">
                      {primaryChallenges.map((challenge) => (
                        <SelectItem
                          key={challenge}
                          value={challenge}
                          className="text-white hover:bg-slate-700 rounded-lg sm:rounded-xl text-sm sm:text-base"
                        >
                          {challenge}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Information - Mobile optimized */}
                <div>
                  <Label
                    htmlFor="additionalInfo"
                    className="text-xs sm:text-sm font-medium text-white/80 mb-2 sm:mb-3 block"
                  >
                    Additional Information (Optional)
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                    placeholder="Tell us more about your business goals and challenges..."
                    className="min-h-[100px] sm:min-h-[120px] bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl sm:rounded-2xl text-white placeholder:text-white/50 text-sm sm:text-base touch-manipulation"
                  />
                </div>

                {/* Submit Button - Mobile optimized */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 hover:scale-105 shadow-2xl h-12 sm:h-14 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl border-0 touch-manipulation"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 sm:h-5 w-4 sm:w-5 border-b-2 border-white mr-2 sm:mr-3"></div>
                      Starting Your Free AI Strategy Session...
                    </>
                  ) : (
                    <>
                      Get Your Free AI Strategy Session
                      <ArrowRight className="w-4 sm:w-5 h-4 sm:h-5 ml-2" />
                    </>
                  )}
                </Button>

                {/* Trust Elements - Mobile optimized */}
                <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-xs sm:text-sm text-white/60 pt-3 sm:pt-4">
                  <div className="flex items-center">
                    <Lock className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                    <span>Privacy Protected</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-3 sm:w-4 h-3 sm:h-4 mr-1 sm:mr-2" />
                    <span>No Spam</span>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information - Mobile optimized */}
          <div className="space-y-6 sm:space-y-8">
            {/* Alternative Contact Methods - Mobile optimized */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl">
              <CardHeader className="px-4 sm:px-6 pt-6 sm:pt-8">
                <CardTitle className="text-xl sm:text-2xl font-bold text-white">Other Ways to Connect</CardTitle>
                <p className="text-white/80 text-sm sm:text-base">Choose the method that works best for you</p>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6 pb-6 sm:pb-8">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon
                  return (
                    <a
                      key={index}
                      href={method.link}
                      className="flex items-center p-3 sm:p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl sm:rounded-2xl hover:bg-white/10 transition-all duration-300 group hover:scale-105 touch-manipulation"
                    >
                      <div
                        className={`w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r ${method.color} rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 shadow-lg flex-shrink-0`}
                      >
                        <IconComponent className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white group-hover:text-blue-300 transition-colors text-sm sm:text-base">
                          {method.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-white/80 truncate">{method.description}</p>
                        <p className="text-xs sm:text-sm font-medium text-blue-300 truncate">{method.action}</p>
                      </div>
                    </a>
                  )
                })}
              </CardContent>
            </Card>

            {/* What to Expect - Mobile optimized */}
            <Card className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl shadow-2xl">
              <CardHeader className="px-4 sm:px-6 pt-6 sm:pt-8">
                <CardTitle className="text-xl sm:text-2xl font-bold text-white flex items-center">
                  <Star className="w-5 sm:w-6 h-5 sm:h-6 mr-2 sm:mr-3 text-yellow-400 flex-shrink-0" />
                  What to Expect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6 pb-6 sm:pb-8">
                <div className="flex items-start">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 mt-1 shadow-lg flex-shrink-0">
                    <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white mb-1 sm:mb-2 text-sm sm:text-base">
                      45-Minute Strategy Session
                    </h4>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                      Deep dive into your business processes and automation opportunities
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 mt-1 shadow-lg flex-shrink-0">
                    <Users className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white mb-1 sm:mb-2 text-sm sm:text-base">Custom ROI Projection</h4>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                      Personalized analysis of potential revenue increases
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl sm:rounded-2xl flex items-center justify-center mr-3 sm:mr-4 mt-1 shadow-lg flex-shrink-0">
                    <Award className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-white mb-1 sm:mb-2 text-sm sm:text-base">Implementation Roadmap</h4>
                    <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                      Step-by-step plan tailored to your business needs
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Time - Mobile optimized */}
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-sm border border-white/20 rounded-2xl sm:rounded-3xl p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center mb-3 sm:mb-4">
                <div className="w-8 sm:w-10 h-8 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center mb-2 sm:mb-0 sm:mr-3 shadow-lg flex-shrink-0">
                  <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-base sm:text-lg">Quick Response Guarantee</h3>
              </div>
              <p className="text-white/90 leading-relaxed text-sm sm:text-base">
                We respond to all inquiries within <strong className="text-blue-300">2 hours</strong> during business
                hours (9 AM - 6 PM EST, Monday - Friday).
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section - Mobile optimized */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-12">
            Frequently Asked Questions
          </h3>
          <div className="space-y-4 sm:space-y-6">
            {faqItems.map((item, index) => (
              <Card
                key={index}
                className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl sm:rounded-3xl shadow-xl"
              >
                <CardContent className="p-4 sm:p-6 lg:p-8">
                  <h4 className="font-bold text-white mb-3 sm:mb-4 text-base sm:text-lg leading-tight">
                    {item.question}
                  </h4>
                  <p className="text-white/90 leading-relaxed text-sm sm:text-base">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
