import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"
import ProcessSection from "@/components/process-section"
import ResultsSection from "@/components/results-section"
import PricingSection from "@/components/pricing-section"
import SuccessStoriesSection from "@/components/success-stories-section"
import AboutSection from "@/components/about-section"
import ContactSection from "@/components/contact-section"
import LeadMagnetSection from "@/components/lead-magnet-section"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Demo sections for testing scroll behavior */}
      <main>
        <ServicesSection />
        <ProcessSection />
        <ResultsSection />
        <PricingSection />
        <SuccessStoriesSection />
        <AboutSection />
        <ContactSection />
      </main>

      {/* Lead Magnet Section - Above Footer */}
      <LeadMagnetSection />

      <Footer />
    </div>
  )
}
