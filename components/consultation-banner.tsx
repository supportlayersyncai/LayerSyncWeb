"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Phone } from "lucide-react"

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

export default function ConsultationBanner() {
  const [isVisible, setIsVisible] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
          }
        })
      },
      { threshold: 0.2 }
    )

    if (bannerRef.current) {
      observer.observe(bannerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={bannerRef}
      className={`w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden transition-all duration-1000 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
      </div>

      {/* Content */}
      <div className="container-responsive relative z-10 py-12 sm:py-16 lg:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div
            className={`inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white text-sm font-medium mb-6 transition-all duration-1000 delay-200 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Free Strategy Call
          </div>

          {/* Headline */}
          <h2
            className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 leading-tight transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Ready to Transform Your Business with AI?
          </h2>

          {/* Subtext */}
          <p
            className={`text-lg sm:text-xl text-white/90 mb-8 sm:mb-10 leading-relaxed max-w-3xl mx-auto transition-all duration-1000 delay-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            Book a free strategy call to discover how LayerSync can design a system that drives measurable results for your business.
          </p>

          {/* CTA Button */}
          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 delay-700 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <Button
              size="lg"
              onClick={() => scrollToSection("#contact")}
              className="w-full sm:w-auto bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-bold rounded-2xl min-h-[56px] shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 group"
            >
              <Phone className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              Book Your Free Consultation
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
            </Button>
          </div>

          {/* Additional info */}
          <p
            className={`text-white/80 text-sm mt-6 transition-all duration-1000 delay-900 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            ✓ No obligation &nbsp;&nbsp; ✓ Free 30-minute strategy call &nbsp;&nbsp; ✓ Personalized AI roadmap
          </p>
        </div>
      </div>

      {/* Decorative wave at bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          className="w-full h-4 sm:h-6 lg:h-8 text-white fill-current"
          viewBox="0 0 1440 48"
          preserveAspectRatio="none"
        >
          <path d="M0,48 L1440,48 L1440,0 C1440,0 1200,48 720,48 C240,48 0,0 0,0 L0,48 Z" opacity="0.1"></path>
        </svg>
      </div>
    </div>
  )
}

