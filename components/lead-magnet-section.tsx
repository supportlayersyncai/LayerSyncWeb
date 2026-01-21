"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { 
  Download, 
  CheckCircle, 
  FileText, 
  ArrowRight,
  Mail,
  User,
  Sparkles
} from "lucide-react"

export default function LeadMagnetSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (error) setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")

    // Basic validation
    if (!formData.name.trim()) {
      setError("Please enter your name")
      setIsSubmitting(false)
      return
    }

    if (!formData.email.trim()) {
      setError("Please enter your email address")
      setIsSubmitting(false)
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address")
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call to Resend
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // For now, we'll just simulate success
      // In production, you would integrate with Resend API here
      console.log("Form submitted:", formData)
      
      setIsSubmitted(true)
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDownload = () => {
    // Create a placeholder PDF download
    const link = document.createElement('a')
    link.href = '/placeholder-ai-checklist.pdf' // Placeholder PDF
    link.download = 'AI-Automation-Checklist.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isSubmitted) {
    return (
      <section className="py-16 bg-gradient-to-r from-green-50 to-blue-50 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-32 h-32 border border-green-200 rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-24 h-24 border border-blue-200 rounded-full"></div>
        </div>

        <div className="container-responsive relative z-10">
          <Card className="max-w-2xl mx-auto bg-white shadow-2xl border-0">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
                Check Your Email!
              </h2>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                We've sent the AI Automation Checklist to <strong>{formData.email}</strong>. 
                Check your inbox and spam folder for the download link.
              </p>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-center mb-2">
                  <FileText className="w-5 h-5 text-blue-600 mr-2" />
                  <span className="font-semibold text-gray-900">AI Automation Checklist</span>
                </div>
                <p className="text-sm text-gray-600">
                  A comprehensive guide to identify growth opportunities in your business
                </p>
              </div>

              <Button
                onClick={handleDownload}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 font-semibold transition-all duration-300 hover:scale-105"
              >
                <Download className="w-5 h-5 mr-2" />
                Download PDF Now
              </Button>

              <p className="text-xs text-gray-400 mt-4">
                Didn't receive the email? Check your spam folder or contact support.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gradient-to-r from-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 left-10 w-32 h-32 border border-blue-200 rounded-full"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 border border-purple-200 rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-blue-100 rotate-45 rounded-lg"></div>
      </div>

      <div className="container-responsive relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4 mr-2" />
            Free Resource
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Not Ready to Book Yet? Start with Our Free Guide.
          </h2>
          
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Download the AI Automation Checklist to discover opportunities for growth in your business.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="bg-white shadow-2xl border-0">
            <CardContent className="p-8 sm:p-12">
              {/* PDF Preview */}
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">AI Automation Checklist</h3>
                <p className="text-gray-600 text-sm">
                  A comprehensive guide to identify growth opportunities in your business
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-gray-700 mb-2 block">
                      <User className="w-4 h-4 inline mr-1" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="h-12 text-base"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 mb-2 block">
                      <Mail className="w-4 h-4 inline mr-1" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Enter your email address"
                      className="h-12 text-base"
                      required
                    />
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg font-semibold transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Download className="w-5 h-5 mr-2" />
                      Get My Free AI Checklist
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-gray-400 text-center">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </form>

              {/* Trust Indicators */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    <span>No spam, ever</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    <span>Instant download</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                    <span>Free forever</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Ready to take the next step? Book a free strategy session with our AI experts.
          </p>
          <Button
            onClick={() => {
              const element = document.getElementById('contact')
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' })
              }
            }}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white px-8 py-3 font-semibold transition-all duration-300 hover:scale-105"
          >
            Book Free Strategy Session
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  )
}
