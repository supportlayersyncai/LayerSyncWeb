import React, { useState, useRef, useEffect } from 'react';
import { useScroll, motion, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import { ScrollCanvas } from './components/ScrollCanvas';
import { TextBeat } from './components/TextBeat';
import { Logo } from './components/Logo';
import { 
  ChevronDown, 
  Check, 
  ArrowRight,
  X,
  FileText,
  Video,
  MessageSquare,
  ShieldCheck,
  Maximize,
  Sun,
  Moon
} from 'lucide-react';

const App: React.FC = () => {
  const scrollytellingRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [selectedService, setSelectedService] = useState<any | null>(null);

  const { scrollYProgress: localScrollYProgress } = useScroll({
    target: scrollytellingRef,
    offset: ["start start", "end end"]
  });

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-mode');
      document.body.style.backgroundColor = '#050505';
    } else {
      document.body.classList.add('light-mode');
      document.body.style.backgroundColor = '#f5f5f7';
    }
  }, [isDarkMode]);

  const indicatorOpacity = useTransform(localScrollYProgress, [0, 0.1, 0.9, 1], [1, 0, 0, 0]);

  const services = [
    {
      id: "staging",
      title: "AI Virtual Staging",
      tagline: "Ultra-Realistic Property Enhancement",
      desc: "Traditional staging in Zimbabwe costs $500+. We deliver high-end 4K staging for $2.00, reducing days-on-market by 40%.",
      metrics: "SDXL + ControlNet Architecture",
      color: "#8B5CF6",
      icon: <Maximize className="w-6 h-6" />,
      features: [
        { label: "SAM Room Detection", detail: "Automated space mapping using Meta's Segment Anything Model." },
        { label: "Style Selection", detail: "Modern, Traditional, Minimalist, Luxury, and Industrial presets." },
        { label: "Furniture Placement", detail: "AI-driven perspective correction for true-to-life depth." },
        { label: "Unlimited Revisions", detail: "Iterate on style and layout without additional costs." },
        { label: "4K Export", detail: "High-resolution output optimized for property portals." }
      ]
    },
    {
      id: "marketing",
      title: "AI Content Marketing",
      tagline: "One Listing. Five Channels. Zero Effort.",
      desc: "Generate professional descriptions, social posts, and email campaigns in 3 minutes. Saves 95% of agent writing time.",
      metrics: "MLS URL Parsing Enabled",
      color: "#3B82F6",
      icon: <FileText className="w-6 h-6" />,
      features: [
        { label: "MLS Data Import", detail: "Automatically pull property details from any live URL." },
        { label: "Multi-Channel Pack", detail: "Facebook, IG, LinkedIn, and TikTok captions in one click." },
        { label: "Email Automation", detail: "Templates for Just Listed, Open House, and Price Reductions." },
        { label: "Compliance Filter", detail: "Real-time checks for Fair Housing language and SEO quality." },
        { label: "Tone Control", detail: "Switch between Luxury, Professional, and Friendly voices." }
      ]
    },
    {
      id: "chatbot",
      title: "AI Chat & Lead Qual",
      tagline: "24/7 Availability on WhatsApp & Web",
      desc: "Respond instantly to inquiries when your team is offline. Capture 30% more leads via automated qualification.",
      metrics: "Twilio + WhatsApp Integration",
      color: "#06B6D4",
      icon: <MessageSquare className="w-6 h-6" />,
      features: [
        { label: "WhatsApp Integration", detail: "Native support for the Zimbabwe market's preferred channel." },
        { label: "Budget Qualification", detail: "Automatically filters leads based on budget and pre-approval." },
        { label: "Viewing Scheduler", detail: "Calendly sync for automated property tour bookings." },
        { label: "Natural Language (NLU)", detail: "Advanced AI that understands complex buyer questions." },
        { label: "CRM Auto-Sync", detail: "Instant lead creation in Follow Up Boss, Salesforce, or HubSpot." }
      ]
    },
    {
      id: "transaction",
      title: "AI Transaction Sync",
      tagline: "Automated ESCROW Management",
      desc: "Stop chasing paperwork. Our AI extracts key dates from contracts and manages the entire deal checklist.",
      metrics: "Google Document AI Powered",
      color: "#4B6BFF",
      icon: <ShieldCheck className="w-6 h-6" />,
      features: [
        { label: "Deadline Extraction", detail: "AI-parsing of inspection, appraisal, and closing dates." },
        { label: "Smart Reminders", detail: "Automated SMS/Email alerts to agents, lenders, and titles." },
        { label: "Doc Checklist", detail: "Compliance-first tracking of every required transaction document." },
        { label: "Client Transparency", detail: "Secure portal for buyers and sellers to track deal progress." },
        { label: "E-Signature Sync", detail: "One-click DocuSign/HelloSign integration." }
      ]
    },
    {
      id: "video",
      title: "AI Video Marketing",
      tagline: "Cinematic Reels in 2 Minutes",
      desc: "Turn property photos into professional tours with AI voiceovers. Listings with video get 403% more inquiries.",
      metrics: "ElevenLabs Voice Synthesis",
      color: "#EC4899",
      icon: <Video className="w-6 h-6" />,
      features: [
        { label: "Ken Burns Pan/Zoom", detail: "AI-generated movement for static property photos." },
        { label: "Pro Voiceovers", detail: "High-end AI scripts voiced by ElevenLabs synthesis." },
        { label: "Agency Branding", detail: "Automated overlays for your logo, agent info, and CTAs." },
        { label: "Multiple Ratios", detail: "Optimized for TikTok (9:16), YouTube (16:9), and Feed (1:1)." },
        { label: "Direct Upload", detail: "Direct API distribution to social media channels." }
      ]
    }
  ];

  const marketROI = [
    { name: "Virtual Staging", traditional: "$500 - $1,500", layerSync: "$2.00 / Image", savings: "98% Reduction" },
    { name: "Content Copywriting", traditional: "$30 - $80 / Pack", layerSync: "$5.00 / Listing", savings: "94% Reduction" },
    { name: "Lead Qual Receptionist", traditional: "$800 - $1,500 / Mo", layerSync: "$150 / Month", savings: "85% Reduction" },
    { name: "Transaction Coord", traditional: "$300 - $500 / Deal", layerSync: "$15 / Deal", savings: "96% Reduction" },
    { name: "Video Production", traditional: "$200 - $500 / Video", layerSync: "$8.00 / Video", savings: "97% Reduction" }
  ];

  const packages = [
    {
      name: "Starter Bundle",
      price: "$120",
      bestFor: "Small Agencies (5-15 agents)",
      features: [
        "20 Staging Images / mo",
        "10 Content Listings / mo",
        "10 Marketing Videos / mo",
        "Weekly Tech Support",
        "Standard API Access"
      ],
      savings: "Save $50 (29% Discount)"
    },
    {
      name: "Professional Bundle",
      price: "$500",
      bestFor: "Medium Agencies (15-50 agents)",
      popular: true,
      features: [
        "50 Staging Images / mo",
        "30 Content Listings / mo",
        "AI Chatbot (2k conv/mo)",
        "30 Marketing Videos / mo",
        "Priority CRM Integration",
        "Dedicated Success Manager"
      ],
      savings: "Save $225 (31% Discount)"
    },
    {
      name: "Enterprise Bundle",
      price: "$1,200",
      bestFor: "Large Agencies (50+ agents)",
      features: [
        "150 Staging Images / mo",
        "100 Content Listings / mo",
        "Unlimited AI Chatbot",
        "40 Transaction Slots / mo",
        "100 Marketing Videos / mo",
        "Full System Optimization"
      ],
      savings: "Save $730 (38% Discount)"
    }
  ];

  const faqs = [
    { q: "Do you accept local currency (ZiG)?", a: "Yes. While our core pricing is in USD, we accept ZiG at prevailing RBZ rates, updated weekly. We support EcoCash, InnBucks, and local bank transfers." },
    { q: "Is there a free trial?", a: "We offer a 7-day trial with limited usage (5 staging images, 3 listings) so you can experience the ROI first-hand. No credit card required." },
    { q: "How long does implementation take?", a: "Typically 3-5 business days. We handle the technical layering while your team continues with their daily operations." },
    { q: "What if we only need one service?", a: "We offer À La Carte options starting at $2.50/image or $150/mo for chatbots. Bundles simply offer the best market value." }
  ];

  const bgColor = isDarkMode ? "#050505" : "#f5f5f7";
  const textColor = isDarkMode ? "text-white" : "text-black";
  const borderSubtle = isDarkMode ? "border-white/5" : "border-black/5";

  return (
    <main className={`relative transition-colors duration-700 ${isDarkMode ? 'bg-[#050505] text-white' : 'bg-[#f5f5f7] text-black'}`}>
      
      {/* Background Ambience */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className={`ambient-glow absolute top-[5%] left-[5%] w-[40vw] h-[40vw] blur-[150px] ${isDarkMode ? 'bg-blue-600/10' : 'bg-blue-400/10'}`} />
        <div className={`ambient-glow absolute bottom-[5%] right-[5%] w-[45vw] h-[45vw] blur-[150px] ${isDarkMode ? 'bg-purple-600/10' : 'bg-purple-400/10'}`} />
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 py-6 sm:py-8 px-6 sm:px-14 flex items-center justify-between ${
        isScrolled ? 'nav-scrolled' : 'bg-transparent'
      }`}>
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <Logo isDarkMode={isDarkMode} className={`transition-all duration-500 ${isScrolled ? 'h-7' : 'h-10'}`} />
          <span className={`font-light tracking-widest uppercase transition-all duration-500 ${isScrolled ? 'text-lg' : 'text-2xl'}`}>LayerSync</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-12 text-[10px] uppercase tracking-[0.3em] font-medium opacity-50">
          <a href="#services" className="hover:opacity-100 transition-opacity">Solutions</a>
          <a href="#roi" className="hover:opacity-100 transition-opacity">Market ROI</a>
          <a href="#pricing" className="hover:opacity-100 transition-opacity">Pricing</a>
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-full transition-colors ${isDarkMode ? 'bg-white/5 hover:bg-white/10' : 'bg-black/5 hover:bg-black/10'}`}
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <a href="#apply" className={`btn-glow px-8 py-3 rounded-full font-bold uppercase tracking-widest text-[10px] ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
            Start Free Trial
          </a>
        </div>
      </nav>

      {/* Hero Scrollytelling Section */}
      <section ref={scrollytellingRef} className="relative h-[400vh] w-full z-10">
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          <ScrollCanvas isDarkMode={isDarkMode} scrollYProgress={localScrollYProgress} />
          
          <TextBeat 
            title="Smarter Real *Estate*" 
            subtitle="Zimbabwe's agencies are drowning in manual friction. LayerSync implements the AI layers that save 20+ hours weekly."
            scrollYProgress={localScrollYProgress}
            range={[0, 0.2]}
          />

          <TextBeat 
            title="95% Cost *Savings*" 
            subtitle="Virtual staging for $2 instead of $500. Listing copy for $5 instead of $50. High-end AI ROI for the local market."
            scrollYProgress={localScrollYProgress}
            range={[0.25, 0.45]}
          />

          <TextBeat 
            title="24/7 *Growth*" 
            subtitle="Capture leads on WhatsApp while you sleep. Our AI agents qualify prospects and book showings automatically."
            scrollYProgress={localScrollYProgress}
            range={[0.5, 0.7]}
          />

          <TextBeat 
            title="Systematic *Sync*" 
            subtitle="We architect custom AI ecosystems that layer perfectly over your existing agency logic and CRM stack."
            scrollYProgress={localScrollYProgress}
            range={[0.75, 0.95]}
          />

          <motion.div style={{ opacity: indicatorOpacity }} className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-5">
            <span className="text-[10px] uppercase tracking-[0.4em] opacity-30 font-bold">Scroll to Explore</span>
            <div className={`w-[1px] h-16 bg-gradient-to-b from-current opacity-30 to-transparent`} />
          </motion.div>
        </div>
      </section>

      {/* Content Blocks */}
      <div className={`relative z-20 transition-colors duration-700 ${isDarkMode ? 'bg-[#050505]' : 'bg-[#f5f5f7]'}`}>
        
        {/* ROI Table */}
        <section id="roi" className={`relative py-32 sm:py-60 px-6 max-w-7xl mx-auto border-t ${borderSubtle} z-20`}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-24">
            <div className="inline-flex items-center gap-3 mb-8 py-1.5 px-5 rounded-full border border-green-500/20 text-green-500 text-[10px] uppercase tracking-[0.3em] font-medium">Regional ROI</div>
            <h2 className="hero-heading mb-10">Market *Efficiency*</h2>
            <p className="sub-heading max-w-2xl mx-auto">Traditional costs in Zimbabwe shouldn't stop you from scaling. We deliver world-class automation at local scale.</p>
          </motion.div>

          <div className={`glass-card overflow-hidden rounded-[48px] border ${borderSubtle}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className={`border-b ${borderSubtle} bg-current opacity-[0.02]`}>
                    <th className="p-10 text-[10px] uppercase tracking-[0.4em] opacity-30">Service Layer</th>
                    <th className="p-10 text-[10px] uppercase tracking-[0.4em] opacity-30">Traditional Cost</th>
                    <th className="p-10 text-[10px] uppercase tracking-[0.4em] opacity-30 text-blue-500">LayerSync AI</th>
                    <th className="p-10 text-[10px] uppercase tracking-[0.4em] opacity-30">Savings</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${borderSubtle}`}>
                  {marketROI.map((row, i) => (
                    <tr key={i} className="hover:bg-current hover:opacity-[0.01] transition-colors group">
                      <td className="p-10 font-medium group-hover:text-blue-500">{row.name}</td>
                      <td className="p-10 opacity-50">{row.traditional}</td>
                      <td className="p-10 font-bold text-blue-500">{row.layerSync}</td>
                      <td className="p-10 text-green-500 font-bold">{row.savings}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Solutions */}
        <section id="services" className={`relative py-32 sm:py-60 px-6 border-y ${borderSubtle} z-20`}>
          <div className="max-w-7xl mx-auto mb-32">
            <h2 className="hero-heading mb-10">The Intelligence *Stack*</h2>
            <p className="sub-heading">Click a service to explore technical specifications and Zimbabwe regional impact.</p>
          </div>
          <div className="grid gap-6 max-w-7xl mx-auto">
            {services.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedService(s)}
                className={`glass-card p-10 sm:p-14 rounded-[40px] flex flex-col md:flex-row items-center gap-10 border ${borderSubtle} hover:border-current hover:border-opacity-10 cursor-pointer group`}
              >
                <div className="w-20 h-20 rounded-[30px] flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110" style={{ background: `${s.color}15`, color: s.color }}>{s.icon}</div>
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-3xl font-light mb-4">{s.title}</h4>
                  <p className="text-lg opacity-50">{s.desc}</p>
                </div>
                <ArrowRight className="w-6 h-6 opacity-30 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="relative py-32 sm:py-60 px-6 max-w-7xl mx-auto z-20">
          <div className="text-center mb-32">
            <h2 className="hero-heading mb-10">System *Bundles*</h2>
            <p className="sub-heading">Value-based pricing for the modern African brokerage. Accept USD and ZiG.</p>
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            {packages.map((p, i) => (
              <div key={i} className={`p-10 rounded-[48px] border flex flex-col items-center text-center transition-all duration-700 hover:scale-[1.02] ${p.popular ? 'border-blue-500/40 bg-blue-500/5 glass-card shadow-2xl' : borderSubtle}`}>
                <h5 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-8">{p.name}</h5>
                <div className="text-6xl font-light mb-2">{p.price}</div>
                <div className="text-xs opacity-40 mb-12">per month</div>
                <div className="space-y-5 mb-16 flex-1">
                  {p.features.map((f, fi) => (
                    <div key={fi} className="flex items-center gap-3 text-sm opacity-60"><Check className="w-4 h-4 text-blue-500" /> {f}</div>
                  ))}
                </div>
                <button className={`w-full py-5 rounded-[24px] font-black uppercase tracking-widest text-[11px] btn-glow ${p.popular ? (isDarkMode ? 'bg-white text-black' : 'bg-black text-white') : 'border ' + borderSubtle}`}>Get Started</button>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="relative py-32 sm:py-60 px-6 max-w-4xl mx-auto z-20">
          <h2 className="hero-heading mb-20 text-center text-shimmer">Common *Questions*</h2>
          <div className="space-y-5">
            {faqs.map((faq, i) => (
              <div key={i} className={`rounded-[32px] border ${borderSubtle} cursor-pointer overflow-hidden transition-colors`} onClick={() => setActiveFaq(activeFaq === i ? null : i)}>
                <div className="p-8 flex items-center justify-between">
                  <h6 className="text-xl font-light">{faq.q}</h6>
                  <ChevronDown className={`w-5 h-5 transition-transform ${activeFaq === i ? 'rotate-180' : ''}`} />
                </div>
                <AnimatePresence>
                  {activeFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-8 pb-8 opacity-40 text-lg">
                      {faq.a}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section id="apply" className="relative py-32 sm:py-60 px-6 max-w-7xl mx-auto z-20">
          <div className={`p-12 sm:p-32 rounded-[64px] border ${borderSubtle} glass-card text-center relative overflow-hidden`}>
            <div className={`ambient-glow absolute inset-0 ${isDarkMode ? 'bg-blue-600/5' : 'bg-blue-400/5'}`} />
            <Logo isDarkMode={isDarkMode} className="h-20 sm:h-24 mx-auto mb-16" />
            <h3 className="hero-heading mb-16 text-shimmer leading-[1.1]">Design Your *System*</h3>
            <p className="sub-heading mb-24 max-w-3xl mx-auto">We are accepting a limited number of agencies for our early partner program in Zimbabwe. Secure your audit today.</p>
            <button className={`btn-glow px-16 py-6 rounded-[24px] font-bold uppercase tracking-[0.2em] text-sm shadow-2xl inline-flex items-center gap-4 ${isDarkMode ? 'bg-white text-black' : 'bg-black text-white'}`}>
              Request AI Audit <ArrowRight className="w-5 h-5" />
            </button>
            <p className="mt-12 text-[10px] uppercase tracking-widest opacity-30 font-bold">Zimbabwe Launch • Limited Onboarding Slots Available</p>
          </div>
        </section>

        {/* Footer */}
        <footer className={`relative py-20 border-t ${borderSubtle} opacity-30 text-center z-20`}>
          <Logo isDarkMode={isDarkMode} className="h-12 mx-auto mb-8" />
          <p className="text-[10px] tracking-[0.4em] font-black uppercase">© 2025 LayerSync AI • Zimbabwe Regional Launch</p>
        </footer>
      </div>

      {/* Modal Overlay */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/95 backdrop-blur-3xl" onClick={() => setSelectedService(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="relative max-w-4xl w-full glass-card p-12 rounded-[48px] border border-white/10 overflow-hidden shadow-2xl text-white">
              <button className="absolute top-8 right-8 p-4 rounded-full bg-white/5" onClick={() => setSelectedService(null)}><X className="w-5 h-5" /></button>
              <div className="flex flex-col md:flex-row gap-16 relative z-10">
                <div className="flex-1">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-10" style={{ background: `${selectedService.color}15`, color: selectedService.color }}>{selectedService.icon}</div>
                  <h2 className="text-4xl font-light mb-6">{selectedService.title}</h2>
                  <p className="text-lg text-white/50 leading-relaxed mb-10">{selectedService.tagline}</p>
                  <button className="bg-white text-black px-10 py-4 rounded-full font-bold uppercase tracking-widest text-[11px]">Request AI Audit</button>
                </div>
                <div className="flex-1">
                  <h6 className="text-[10px] uppercase tracking-[0.4em] font-black opacity-30 mb-8">Technical Specifications</h6>
                  <div className="space-y-8">
                    {selectedService.features.map((f: any, i: number) => (
                      <div key={i} className="border-l border-white/10 pl-6">
                        <div className="font-bold text-blue-400 mb-1">{f.label}</div>
                        <div className="text-sm opacity-40">{f.detail}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
};

export default App;