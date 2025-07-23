import Header from "@/components/header"
import HeroSection from "@/components/hero-section"
import ServicesSection from "@/components/services-section"
import ProcessSection from "@/components/process-section"
import ResultsSection from "@/components/results-section"
import PricingSection from "@/components/pricing-section"
import AboutSection from "@/components/about-section"
import ContactSection from "@/components/contact-section"
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
        <AboutSection />
        <ContactSection />

        <section id="resources" className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Resources</h2>
            <p className="text-xl text-gray-600">Learn more about AI automation</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
