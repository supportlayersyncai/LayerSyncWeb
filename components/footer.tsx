"use client"

import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook } from "lucide-react"

export default function Footer() {
  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.substring(1))
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <footer className="bg-gray-900 text-white py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg">
                <span className="text-white font-bold text-lg">LS</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white leading-tight">LayerSync</span>
                <span className="text-sm font-medium text-blue-400 leading-tight">AI</span>
              </div>
            </div>
            <p className="text-white mb-6 max-w-md leading-relaxed">
              We're currently automating growth for a select group of businesses ready to scale with AI. Transform your
              operations with intelligent automation that delivers measurable results.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-blue-400 transition-colors duration-200">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-blue-400 transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white hover:text-blue-400 transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => scrollToSection("#home")}
                  className="text-white hover:text-blue-400 transition-colors duration-200 text-left"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#services")}
                  className="text-white hover:text-blue-400 transition-colors duration-200 text-left"
                >
                  Services
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#about")}
                  className="text-white hover:text-blue-400 transition-colors duration-200 text-left"
                >
                  About
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#pricing")}
                  className="text-white hover:text-blue-400 transition-colors duration-200 text-left"
                >
                  Pricing
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("#contact")}
                  className="text-white hover:text-blue-400 transition-colors duration-200 text-left"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <a
                    href="tel:+263783771054"
                    className="text-white hover:text-blue-400 transition-colors duration-200"
                  >
                    +263 78 377 1054
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <a
                    href="mailto:hello@layersyncai.com"
                    className="text-white hover:text-blue-400 transition-colors duration-200"
                  >
                    hello@layersyncai.com
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-blue-400 mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-white">Global Remote Team</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-gray-400 text-sm text-center md:text-left">
              © 2024 LayerSync AI. All rights reserved.
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-center">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-center">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-center">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 mt-12 text-center">
          <h3 className="text-xl md:text-2xl font-bold mb-4">Ready to Transform Your Business?</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Schedule your free AI strategy session and discover how automation can drive your growth.
          </p>
          <Button
            size="lg"
            onClick={() => scrollToSection("#contact")}
            className="bg-white text-blue-700 hover:bg-blue-50 px-6 md:px-8 py-3 font-semibold transition-all duration-300 hover:scale-105"
          >
            Get Started Today
          </Button>
        </div>
      </div>
    </footer>
  )
}
