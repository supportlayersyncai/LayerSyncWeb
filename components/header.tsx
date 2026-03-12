"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import React from "react"

const navigation = [
  { name: "Home", href: "#home" },
  { name: "Services", href: "#services" },
  { name: "Pricing", href: "#pricing" },
  { name: "About", href: "#about" },
  { name: "Contact", href: "#contact" },
]

const MemoizedNavigation = React.memo(({ navigation, activeSection, scrollToSection }) => (
  <nav className="hidden lg:flex items-center space-x-4 xl:space-x-6">
    {navigation.map((item) => (
      <button
        key={item.name}
        onClick={() => scrollToSection(item.href)}
        className={`relative text-gray-700 hover:text-blue-600 font-medium transition-all duration-300 group px-3 py-2 rounded-xl hover:bg-blue-50/80 ${
          activeSection === item.href.substring(1) ? "text-blue-600 bg-blue-50/80" : ""
        }`}
      >
        {item.name}
        <span
          className={`absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 group-hover:w-full ${
            activeSection === item.href.substring(1) ? "w-full" : ""
          }`}
        />
      </button>
    ))}
  </nav>
))

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 100)
          ticking = false
        })
        ticking = true
      }
    }

    const handleSectionChange = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const sections = navigation.map((item) => item.href.substring(1))
          const currentSection = sections.find((section) => {
            const element = document.getElementById(section)
            if (element) {
              const rect = element.getBoundingClientRect()
              return rect.top <= 100 && rect.bottom >= 100
            }
            return false
          })
          if (currentSection) {
            setActiveSection(currentSection)
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    window.addEventListener("scroll", handleSectionChange, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("scroll", handleSectionChange)
    }
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.substring(1))
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    setIsMobileMenuOpen(false)
  }

  return (
    <header
      className={`navbar fixed top-0 left-0 right-0 z-50 transition-all duration-500 safe-area-top ${
        isScrolled ? "navbar--solid" : ""
      }`}
    >
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
          {/* Logo - Clean single logo design */}
          <div className="flex items-center">
            <img 
              src="/LayerSyncAI_full.svg" 
              alt="LayerSync AI" 
              className="h-8 sm:h-10 object-contain"
            />
          </div>

          {/* Desktop Navigation */}
          <MemoizedNavigation navigation={navigation} activeSection={activeSection} scrollToSection={scrollToSection} />

          {/* Book Free Strategy Session Button - Enhanced for mobile */}
          <div className="hidden sm:block">
            <Button
              onClick={() => scrollToSection("#contact")}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-4 sm:px-6 py-2 sm:py-2.5 rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl border-0 text-sm sm:text-base whitespace-nowrap"
            >
              Book Free Strategy Session
            </Button>
          </div>

          {/* Mobile menu button - Enhanced */}
          <div className="sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-200 p-2 rounded-xl hover:bg-blue-50 tap-highlight-transparent touch-manipulation"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation - Enhanced */}
        <div
          className={`sm:hidden transition-all duration-300 ease-in-out overflow-hidden ${
            isMobileMenuOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col space-y-1 pt-4 border-t border-gray-100">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className={`text-left py-3 px-4 rounded-xl text-gray-700 hover:text-blue-600 hover:bg-blue-50/80 font-medium transition-all duration-200 touch-manipulation ${
                  activeSection === item.href.substring(1) ? "text-blue-600 bg-blue-50/80" : ""
                }`}
              >
                {item.name}
              </button>
            ))}
            <div className="pt-3">
              <Button
                onClick={() => scrollToSection("#contact")}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 border-0 touch-manipulation"
              >
                Book Free Strategy Session
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
