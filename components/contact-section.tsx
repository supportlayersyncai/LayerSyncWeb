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
  Zap,
  ArrowRight,
  Lock,
  Award,
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
    color: "from-green-500 to-green-600",
  },
  {
    icon: Mail,
    title: "Email Us",
    description: "Get a response within 2 hours",
    action: "hello@layersyncai.com",
    link: "mailto:hello@layersyncai.com",
    color: "from-blue-500 to-blue-600",
  },
  {
    icon: Calendar,
    title: "Book a Meeting",
    description: "Schedule at your convenience",
    action: "View Available Times",
    link: "#calendar",
    color: "from-purple-500 to-purple-600",
  },
  {
    icon: MessageCircle,
    title: "Live Chat",
    description: "Chat with our AI assistant",
    action: "Start Conversation",
    link: "#chat",
    color: "from-orange-500 to-orange-600",
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
  const [isSubmitted, setIsSubmitted] = useState(false)
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
        } else if (!phoneRegex.test(value.replace(/[\s\-$$$$]/g, ""))) {
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
      className="py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 border border-blue-200 rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 border border-purple-200 rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Zap className="w-4 h-4 mr-2" />
            Get Started Today
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 px-4 leading-tight">
            Ready to Transform Your Business?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4 leading-relaxed">
            Get your free AI strategy session and discover how to increase conversions by 300% in 90 days.
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Lead Capture Form */}
          <Card className="shadow-xl">
            <CardHeader className="px-4 md:px-6">
              <CardTitle className="text-xl md:text-2xl font-bold text-gray-900 text-center">
                Get Your Free AI Strategy Session
              </CardTitle>
              <p className="text-gray-600 text-center text-sm md:text-base">
                Schedule a personalized consultation to discover your automation opportunities
              </p>
            </CardHeader>
            <CardContent className="px-4 md:px-6">
              <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                {/* Full Name */}
                <div className="relative">
                  <Label
                    htmlFor="fullName"
                    className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                      focusedField === "fullName" || formData.fullName
                        ? "top-2 text-xs text-blue-600"
                        : "top-4 text-gray-500"
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
                    className={`pt-6 pb-2 h-12 md:h-14 text-base ${errors.fullName ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
                </div>

                {/* Business Email */}
                <div className="relative">
                  <Label
                    htmlFor="email"
                    className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                      focusedField === "email" || formData.email ? "top-2 text-xs text-blue-600" : "top-4 text-gray-500"
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
                    className={`pt-6 pb-2 h-12 md:h-14 text-base ${errors.email ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>

                {/* Company Name */}
                <div className="relative">
                  <Label
                    htmlFor="company"
                    className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                      focusedField === "company" || formData.company
                        ? "top-2 text-xs text-blue-600"
                        : "top-4 text-gray-500"
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
                    className={`pt-6 pb-2 h-12 md:h-14 text-base ${errors.company ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.company && <p className="text-red-500 text-sm mt-1">{errors.company}</p>}
                </div>

                {/* Phone Number */}
                <div className="relative">
                  <Label
                    htmlFor="phone"
                    className={`absolute left-3 transition-all duration-200 pointer-events-none ${
                      focusedField === "phone" || formData.phone ? "top-2 text-xs text-blue-600" : "top-4 text-gray-500"
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
                    className={`pt-6 pb-2 h-12 md:h-14 text-base ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                {/* Monthly Revenue Range */}
                <div>
                  <Label htmlFor="revenue" className="text-sm font-medium text-gray-700 mb-2 block">
                    Monthly Revenue Range
                  </Label>
                  <Select value={formData.revenue} onValueChange={(value) => handleInputChange("revenue", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your monthly revenue range" />
                    </SelectTrigger>
                    <SelectContent>
                      {revenueRanges.map((range) => (
                        <SelectItem key={range} value={range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Primary Challenge */}
                <div>
                  <Label htmlFor="challenge" className="text-sm font-medium text-gray-700 mb-2 block">
                    Primary Challenge
                  </Label>
                  <Select value={formData.challenge} onValueChange={(value) => handleInputChange("challenge", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="What's your biggest business challenge?" />
                    </SelectTrigger>
                    <SelectContent>
                      {primaryChallenges.map((challenge) => (
                        <SelectItem key={challenge} value={challenge}>
                          {challenge}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Additional Information */}
                <div>
                  <Label htmlFor="additionalInfo" className="text-sm font-medium text-gray-700 mb-2 block">
                    Additional Information (Optional)
                  </Label>
                  <Textarea
                    id="additionalInfo"
                    value={formData.additionalInfo}
                    onChange={(e) => handleInputChange("additionalInfo", e.target.value)}
                    placeholder="Tell us more about your business goals and challenges..."
                    className="min-h-[100px]"
                  />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 hover:scale-105 shadow-lg h-12 md:h-14 text-base md:text-lg"
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Scheduling Your Session...
                    </>
                  ) : (
                    <>
                      Schedule My Free Strategy Session
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>

                {/* Trust Elements */}
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 pt-4">
                  <div className="flex items-center">
                    <Lock className="w-4 h-4 mr-1" />
                    <span>Privacy Protected</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-1" />
                    <span>No Spam</span>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Alternative Contact Methods */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900">Other Ways to Connect</CardTitle>
                <p className="text-gray-600">Choose the method that works best for you</p>
              </CardHeader>
              <CardContent className="space-y-4">
                {contactMethods.map((method, index) => {
                  const IconComponent = method.icon
                  return (
                    <a
                      key={index}
                      href={method.link}
                      className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
                    >
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-lg flex items-center justify-center mr-4`}
                      >
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {method.title}
                        </h3>
                        <p className="text-sm text-gray-600">{method.description}</p>
                        <p className="text-sm font-medium text-blue-600">{method.action}</p>
                      </div>
                    </a>
                  )
                })}
              </CardContent>
            </Card>

            {/* What to Expect */}
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  What to Expect
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <Clock className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">45-Minute Strategy Session</h4>
                    <p className="text-sm text-gray-600">
                      Deep dive into your business processes and automation opportunities
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Custom ROI Projection</h4>
                    <p className="text-sm text-gray-600">Personalized analysis of potential revenue increases</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3 mt-1">
                    <Award className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Implementation Roadmap</h4>
                    <p className="text-sm text-gray-600">Step-by-step plan tailored to your business needs</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Response Time */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex items-center mb-3">
                <Clock className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="font-bold text-gray-900">Quick Response Guarantee</h3>
              </div>
              <p className="text-gray-700">
                We respond to all inquiries within <strong>2 hours</strong> during business hours (9 AM - 6 PM EST,
                Monday - Friday).
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">Frequently Asked Questions</h3>
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <Card key={index} className="shadow-sm">
                <CardContent className="p-6">
                  <h4 className="font-semibold text-gray-900 mb-2">{item.question}</h4>
                  <p className="text-gray-600">{item.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
