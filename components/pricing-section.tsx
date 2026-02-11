"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, CheckCircle2, Phone, Mail, Building2 } from "lucide-react"

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

export default function PricingSection() {
  return (
    <section
      id="pricing"
      className="section-spacing bg-dark-gradient relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500"></div>
      </div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-l from-blue-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-r from-purple-500/10 to-transparent rounded-full blur-3xl"></div>

      <div className="container-responsive relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
        <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-500/10 backdrop-blur-sm border border-blue-500/20 rounded-full text-blue-400 text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Custom Solutions for Your Business
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Let's Build the Perfect AI System for Your Business
            </h1>
            <p className="text-xl text-white max-w-3xl mx-auto mb-8">
              Every business is unique — leave your details and our team will reach out for a tailored consultation.
            </p>
        </div>

          {/* Main CTA Card */}
          <div className="card-dark rounded-3xl p-8 md:p-12 text-center mb-12">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-3xl font-bold text-white mb-6">
                Ready to Transform Your Business with AI?
              </h2>
              <p className="text-lg text-white/90 mb-8 leading-relaxed">
                Our team will work with you to understand your unique challenges and design an AI system that delivers measurable results. No cookie-cutter solutions—just intelligent automation built for your success.
              </p>

              {/* Benefits Grid */}
              <div className="grid md:grid-cols-3 gap-6 mb-10">
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                    </div>
                  <h3 className="text-white font-semibold mb-2">Free Consultation</h3>
                  <p className="text-white/80 text-sm">No obligation. Just insights.</p>
                      </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Building2 className="w-6 h-6 text-white" />
                      </div>
                  <h3 className="text-white font-semibold mb-2">Tailored Solutions</h3>
                  <p className="text-white/80 text-sm">Built for your industry.</p>
                    </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-white" />
                            </div>
                  <h3 className="text-white font-semibold mb-2">Transparent Process</h3>
                  <p className="text-white/80 text-sm">Clear milestones, real progress.</p>
                            </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                      size="lg"
                      onClick={() => scrollToSection("#contact")}
                className="btn-neon px-8 py-6 text-lg font-semibold rounded-2xl min-h-[56px] w-full md:w-auto cta-button"
              >
                <Phone className="w-5 h-5 mr-2" />
                Book Your Free Consultation
                    </Button>

              <p className="text-white/70 text-sm mt-4">
                Typical response time: Under 24 hours
              </p>
            </div>
          </div>

          {/* What to Expect */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 text-center">
              What to Expect from Your Consultation
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-cyan-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Business Analysis</h4>
                  <p className="text-white/80 text-sm">
                    We'll dive deep into your current processes, challenges, and growth goals to identify the biggest opportunities.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Custom Strategy</h4>
                  <p className="text-white/80 text-sm">
                    Get a personalized roadmap showing exactly how AI can automate your operations and scale your revenue.
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">ROI Projection</h4>
                  <p className="text-white/80 text-sm">
                    See real numbers—how much time you'll save, how many more leads you'll get, and your expected revenue growth.
                  </p>
                </div>
        </div>
              <div className="flex items-start">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mr-4 flex-shrink-0 mt-1">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Clear Next Steps</h4>
                  <p className="text-white/80 text-sm">
                    Walk away with a clear implementation plan, timeline, and investment breakdown—no surprises.
                  </p>
                </div>
              </div>
            </div>
        </div>

          {/* Bottom CTA */}
          <div className="text-center mt-12">
            <p className="text-white/80 text-lg mb-4">
              Join 100+ businesses already growing with AI
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={() => scrollToSection("#contact")}
                className="btn-neon px-8 py-4 text-base font-semibold rounded-xl w-full sm:w-auto"
              >
                <Mail className="w-5 h-5 mr-2" />
                Get Started Today
            </Button>
          </div>
          </div>
        </div>
      </div>
    </section>
  )
}
