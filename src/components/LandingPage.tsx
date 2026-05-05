import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  ArrowRight, 
  Check, 
  Star, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  ChevronRight, 
  Quote, 
  Instagram, 
  Facebook, 
  Twitter,
  Sparkles,
  Shield,
  Home,
  UserPlus,
  Menu,
  X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAdminStore } from '../store/useAdminStore';

// --- Types ---
interface Service {
  id: string;
  name: string;
  price: number;
  description: string;
}

const LiquidBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-20%] right-[-10%] w-[80%] h-[80%] bg-primary/10 rounded-full blur-[120px] animate-morph"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-20%] left-[-10%] w-[70%] h-[70%] bg-secondary/15 rounded-full blur-[100px] animate-morph"
      />
      <motion.div
        animate={{
          opacity: [0.1, 0.3, 0.1],
          rotate: [0, 360],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/4 left-1/3 w-[50%] h-[50%] bg-accent/5 rounded-full blur-[140px] animate-morph"
      />
    </div>
  );
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home', icon: Home, from: '#0891B2', to: '#22D3EE' },
    { name: 'Services', href: '#services', icon: Shield, from: '#06B6D4', to: '#22D3EE' },
    { name: 'Calculator', href: '#calculator', icon: Plus, from: '#0D9488', to: '#2DD4BF' },
    { name: 'Transformations', href: '#transformations', icon: Sparkles, from: '#0891B2', to: '#06B6D4' },
    { name: 'Dr. Nova', href: '#doctor', icon: UserPlus, from: '#164E63', to: '#0891B2' },
    { name: 'Contact', href: '#contact', icon: Phone, from: '#059669', to: '#10B981' },
  ];

  return (
    <nav className={`fixed top-4 left-4 right-4 z-50 transition-all duration-500 rounded-[40px] ${scrolled ? 'glass py-3 shadow-2xl shadow-primary/10' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
            <Sparkles className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-display font-black tracking-tight text-deep">Lumina Dental</span>
        </div>

        <ul className="hidden lg:flex items-center gap-4">
          {navLinks.map((link) => (
            <li 
              key={link.name}
              className="relative group list-none"
              style={{ '--gradient-from': link.from, '--gradient-to': link.to } as React.CSSProperties}
            >
              <a 
                href={link.href}
                className={cn(
                  "flex items-center justify-center w-[54px] h-[54px] rounded-full bg-white shadow-sm border border-deep/5 transition-all duration-500 ease-out group-hover:w-[160px] group-hover:shadow-none overflow-hidden relative z-10",
                )}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))]" />
                <div className="flex items-center gap-3 relative z-20">
                  <link.icon className="w-5 h-5 text-deep group-hover:text-white transition-all duration-500 group-hover:scale-0" />
                  <span className="absolute left-1/2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-all duration-500 delay-150 text-white font-black text-xs uppercase tracking-widest whitespace-nowrap">
                    {link.name}
                  </span>
                </div>
              </a>
              <div className="absolute inset-0 rounded-full blur-[15px] opacity-0 group-hover:opacity-40 transition-all duration-500 bg-[linear-gradient(45deg,var(--gradient-from),var(--gradient-to))] -z-0" />
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-4">
          <a 
            href="#contact" 
            className="hidden sm:block bg-deep text-white px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:bg-primary transition-all duration-500 transform hover:scale-105 hover:shadow-2xl hover:shadow-primary/20 cursor-pointer"
          >
            Appointment
          </a>
          <button 
            className="lg:hidden text-deep p-3 cursor-pointer hover:bg-deep/5 rounded-2xl transition-colors bg-white/50 backdrop-blur-md"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-4 mx-4 glass shadow-2xl border border-white/40 rounded-[32px] md:hidden overflow-hidden"
          >
            <div className="flex flex-col p-8 gap-5">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  className="text-xl font-display font-bold text-deep py-2 border-b border-deep/5 hover:text-primary transition-colors cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </a>
              ))}
              <a 
                href="#contact" 
                className="bg-primary text-white px-6 py-5 rounded-[24px] text-center font-bold text-lg shadow-xl shadow-primary/20 cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                Book consultation
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  return (
    <section id="home" className="relative min-h-[100vh] flex items-center pt-32 pb-24 overflow-hidden bg-bg-light">
      <LiquidBackground />
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 items-center gap-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 relative z-20"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/50 text-primary text-xs font-bold uppercase tracking-[0.2em] mb-10 shadow-sm">
            <Sparkles className="w-4 h-4" />
            Voted #1 Aesthetic Dental Clinic
          </div>
          <h1 className="text-7xl lg:text-[100px] font-display font-black leading-[0.9] tracking-tighter text-deep mb-12">
            Exceptional <br />
            <span className="text-primary">Dental Care</span>
          </h1>
          <p className="text-xl text-deep/60 leading-relaxed max-w-lg mb-12 font-sans font-medium">
            Advanced solutions for stronger, healthier teeth. Designed for comfort, care, and confidence in every smile.
          </p>
          <div className="flex flex-wrap gap-5">
            <a href="#contact" className="px-10 py-5 bg-deep text-white rounded-2xl font-bold flex items-center gap-3 hover:bg-primary transition-all duration-500 group shadow-xl shadow-deep/10 cursor-pointer">
              Book Consultation
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#services" className="px-10 py-5 glass border border-white/50 rounded-2xl font-bold flex items-center gap-3 hover:bg-white/80 transition-all duration-500 cursor-pointer">
              Our Services
            </a>
          </div>
          <div className="mt-16 flex items-center gap-8">
            <div className="flex -space-x-5">
              {[1, 2, 3, 4].map((i) => (
                <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i + 20}`} alt="Patient" className="w-14 h-14 rounded-full border-4 border-white shadow-lg" />
              ))}
            </div>
            <div>
              <div className="flex text-yellow-500 mb-1">
                {[1, 2, 3, 4, 5].map((i) => <Star key={i} className="w-4 h-4 fill-current" />)}
              </div>
              <p className="text-sm font-bold text-deep/60 uppercase tracking-widest">500+ happy patients</p>
            </div>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          className="lg:col-span-5 relative"
        >
          <div className="relative z-10 glass p-4 rounded-[60px] border border-white/60 shadow-2xl">
            <div className="overflow-hidden rounded-[45px]">
              <motion.img whileHover={{ scale: 1.05 }} transition={{ duration: 0.8 }} src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=75&w=1200&auto=format&fit=crop" alt="Implant procedure" className="w-full aspect-[4/5] object-cover" />
            </div>
            <motion.div initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1, duration: 0.8 }} className="absolute -bottom-6 -left-12 glass p-8 rounded-[40px] shadow-2xl max-w-[240px] border border-white/80 z-20">
              <p className="text-xs font-black text-primary mb-3 tracking-[0.2em] uppercase">Modern Care</p>
              <p className="text-base font-bold text-deep leading-relaxed">"Designed for comfort, care, and confidence."</p>
            </motion.div>
          </div>
          <motion.div animate={{ y: [0, -25, 0], rotate: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-16 -right-12 w-40 h-40 bg-white/40 backdrop-blur-xl rounded-full shadow-2xl flex items-center justify-center p-8 z-30 border border-white/50 hidden xl:flex">
            <div className="w-full h-full p-4 bg-white rounded-full shadow-inner flex items-center justify-center">
              <img src="https://cdn-icons-png.flaticon.com/512/3224/3224747.png" alt="tooth" className="w-full h-full object-contain opacity-80" />
            </div>
          </motion.div>
        </motion.div>
      </div>
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 opacity-50">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-deep">Discover Lumina</span>
        <motion.div animate={{ y: [0, 15, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="w-1.5 h-10 bg-gradient-to-b from-primary to-transparent rounded-full" />
      </div>
    </section>
  );
};

const ServicesAndCalculator = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const services: Service[] = [
    { id: '1', name: 'Dental Implants', price: 1500, description: 'Permanent, natural-looking replacement for missing teeth.' },
    { id: '2', name: 'Teeth Whitening', price: 350, description: 'Brighten your smile with our professional whitening treatment.' },
    { id: '3', name: 'Dental Veneers', price: 800, description: 'Thin shells that cover the front surface of teeth.' },
    { id: '4', name: 'Orthodontics', price: 2500, description: 'Correct irregularities of the teeth and jaw alignment.' },
    { id: '5', name: 'Cleaning & Hygiene', price: 120, description: 'Professional scale and polish for ultimate oral health.' },
  ];

  const toggleService = (id: string) => {
    setSelectedServices(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const totalPrice = selectedServices.reduce((sum, id) => {
    const service = services.find(s => s.id === id);
    return sum + (service?.price || 0);
  }, 0);

  return (
    <section id="services" className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-start">
          <div>
            <div className="mb-12">
              <span className="text-primary font-bold tracking-widest uppercase text-xs">Our Expertise</span>
              <h2 className="text-4xl md:text-5xl font-display font-black mt-4 mb-6 leading-tight">Cutting-edge services <br />for every need</h2>
              <p className="text-deep/60 text-lg">We provide a wide range of aesthetic and clinical dental services tailored to your individual requirements.</p>
            </div>
            <div className="space-y-4">
              {services.map((service, idx) => (
                <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} viewport={{ once: true }} className="group p-6 rounded-2xl border border-deep/5 hover:border-primary/20 hover:bg-primary/5 transition-all duration-300">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-display font-bold text-xl group-hover:text-primary transition-colors">{service.name}</h3>
                    <span className="text-primary font-bold">from ${service.price}</span>
                  </div>
                  <p className="text-deep/50 text-sm">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
          <div id="calculator" className="sticky top-24">
            <div className="bg-deep rounded-[40px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[80px] -mr-32 -mt-32" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                    <Plus className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-display font-black">Treatment Calculator</h3>
                    <p className="text-white/40 text-sm">Estimate your investment</p>
                  </div>
                </div>
                <div className="space-y-4 mb-12">
                  {services.map(service => (
                    <button key={service.id} onClick={() => toggleService(service.id)} className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${selectedServices.includes(service.id) ? 'bg-primary border-primary' : 'bg-white/5 border-white/10 hover:border-white/30'}`}>
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${selectedServices.includes(service.id) ? 'bg-white text-primary' : 'border border-white/20'}`}>
                          {selectedServices.includes(service.id) && <Check size={14} strokeWidth={4} />}
                        </div>
                        <span className="font-medium text-sm">{service.name}</span>
                      </div>
                      <span className="font-bold opacity-80">${service.price}</span>
                    </button>
                  ))}
                </div>
                <div className="pt-8 border-t border-white/10 flex items-end justify-between">
                  <div>
                    <p className="text-white/40 text-sm mb-1 uppercase tracking-widest font-bold">Total Estimated Cost</p>
                    <div className="text-5xl font-display font-bold">${totalPrice.toLocaleString()}</div>
                  </div>
                  <a href="#contact" className="flex flex-col items-center gap-2 group">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ChevronRight size={32} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60">Book Now</span>
                  </a>
                </div>
                <p className="mt-8 text-[10px] text-white/30 leading-relaxed italic text-center">* Prices are estimates. A full clinical examination is required for a fixed quote.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BeforeAfter = () => {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    const position = ((x - rect.left) / rect.width) * 100;
    setSliderPos(Math.max(0, Math.min(100, position)));
  };

  return (
    <section id="transformations" className="py-32 bg-white relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px]">Transformations</span>
          <h2 className="text-5xl md:text-7xl font-display font-black mt-6 mb-8 text-deep">See the Smile Difference</h2>
          <p className="max-w-2xl mx-auto text-deep/50 text-lg font-medium leading-relaxed">Using state-of-the-art porcelain veneers and orthodontics, we craft smiles that look natural and feel like they belong.</p>
        </div>
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div ref={containerRef} className="relative h-[600px] rounded-[60px] overflow-hidden shadow-2xl cursor-ew-resize select-none border border-white/50" onMouseMove={handleMove} onTouchMove={handleMove}>
            <div className="absolute inset-0">
              <img src="/images/after.png" alt="After treatment" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 z-10" style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
              <img src="/images/before.png" alt="Before treatment" className="w-full h-full object-cover" />
            </div>
            <div className="absolute top-0 bottom-0 w-1 bg-white/80 backdrop-blur-md z-20" style={{ left: `${sliderPos}%` }}>
              <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center border border-primary/20">
                <div className="flex gap-1.5">
                  <motion.div animate={{ height: [12, 20, 12] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-4 bg-primary rounded-full" />
                  <motion.div animate={{ height: [20, 12, 20] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-4 bg-primary rounded-full" />
                </div>
              </motion.div>
            </div>
            <div className="absolute top-8 left-8 z-30 px-6 py-3 bg-white/40 backdrop-blur-xl border border-white/50 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-deep shadow-lg">Before Treatment</div>
            <div className="absolute top-8 right-8 z-30 px-6 py-3 bg-primary/40 backdrop-blur-xl border border-white/30 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-lg">Lumina Result</div>
          </div>
          <div className="space-y-8">
            <div className="p-8 bg-white rounded-3xl border border-deep/5 shadow-sm">
              <Quote className="text-primary w-10 h-10 mb-4 opacity-20" />
              <p className="text-xl font-display font-bold leading-relaxed text-deep mb-6">"I never thought my smile could look this natural. The confidence I feel now is worth every second. Dr. Nova's attention to detail is truly world-class."</p>
              <div className="flex items-center gap-4">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" alt="Patient" className="w-14 h-14 rounded-full bg-accent/10" />
                <div>
                  <h4 className="font-bold text-deep">Emma Harrison</h4>
                  <p className="text-sm text-deep/50">Full Smile Reconstruction</p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-6 bg-primary/5 rounded-2xl border border-primary/10">
                <h5 className="text-3xl font-display font-bold text-primary mb-1">0%</h5>
                <p className="text-xs font-bold uppercase tracking-widest text-deep/60">Interest Finance</p>
              </div>
              <div className="p-6 bg-deep text-white rounded-2xl">
                <h5 className="text-3xl font-display font-bold mb-1">10yr</h5>
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">Treatment Guarantee</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    { name: 'Kate Davis', role: 'Digital Creator', rating: 4.9, text: "The care and level of technology here is mind-blowing. I've never felt so comfortable in a dentist chair.", logo: 'https://cdn-icons-png.flaticon.com/512/3670/3670163.png' },
    { name: 'Martin Kazlauska', role: 'Architect', rating: 5.0, text: "Precision work. My implants feel like my natural teeth, and the process was surprisingly efficient.", logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968705.png' },
    { name: 'Sanjay Sharma', role: 'Doctor', rating: 4.8, text: "As a medical professional, I appreciate the hygiene and standard of equipment at Lumina.", logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968039.png' },
    { name: 'Tawanna Afumba', role: 'Researcher', rating: 5.0, text: "The team is incredible. They explained everything clearly and the results exceeded my expectations.", logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968841.png' },
    { name: 'Larry King', role: 'Director', rating: 4.9, text: "Best cosmetic work I've seen. Natural shading and perfect alignment. Highly recommended.", logo: 'https://cdn-icons-png.flaticon.com/512/5969/5969188.png' },
    { name: 'Fatima Mohamed', role: 'Blogger', rating: 5.0, text: "The atmosphere is more like a spa than a dentist. So calm and beautiful. My teeth look amazing!", logo: 'https://cdn-icons-png.flaticon.com/512/5968/5968852.png' },
  ];
  return (
    <section className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-display font-bold text-deep">Our trusted <span className="px-6 py-2 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20">Clients</span></h2>
          <p className="max-w-xl mx-auto text-deep/50 mt-8 font-medium text-lg leading-relaxed">Our mission is to drive progress and enhance the lives of our customers by delivering superior products and services.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="p-8 rounded-[32px] bg-white border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-xl transition-all">
              <div className="flex justify-between items-center mb-6">
                <img src={review.logo} alt="Brand" className="h-8 grayscale opacity-50" />
                <div className="flex items-center gap-1 font-bold text-sm">{review.rating} <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" /></div>
              </div>
              <p className="text-deep/70 mb-8 font-bold leading-relaxed">"{review.text}"</p>
              <div>
                <h4 className="font-bold text-deep font-display">{review.name}</h4>
                <p className="text-xs text-deep/40 font-bold uppercase tracking-wider">{review.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const DoctorProfile = () => {
  return (
    <section id="doctor" className="relative min-h-screen flex items-center bg-white overflow-hidden pt-20 pb-0">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.03] z-0">
        <h2 className="text-[40vw] font-display font-black leading-none tracking-tighter whitespace-nowrap">NOVA</h2>
      </div>
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 items-center gap-12 relative z-10 w-full">
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true }} className="max-w-xl">
          <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px] mb-6 block">Meet the Specialist</span>
          <h2 className="text-6xl md:text-8xl font-display font-black text-deep leading-tight mb-8">Precision Meets <br /><span className="text-primary">Artistry.</span></h2>
          <p className="text-deep/50 text-xl leading-relaxed mb-12 font-medium">Dr. Julian Nova blends scientific precision with artistic vision to craft bespoke smiles that are as unique as they are perfect.</p>
          <div className="grid grid-cols-1 gap-6 mb-12">
            {[
              { title: 'PhD in Esthetic Dentistry', desc: 'Harvard University' },
              { title: 'Master of Clinical Implantology', desc: 'King\'s College London' },
            ].map((item, i) => (
              <div key={i} className="flex gap-5 items-center p-6 rounded-3xl bg-bg-light border border-deep/5 group hover:border-primary/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:text-white transition-colors">
                  <Check className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-deep">{item.title}</h4>
                  <p className="text-sm text-deep/40 font-medium">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <a href="#contact" className="inline-flex items-center gap-3 px-8 py-4 bg-deep text-white rounded-2xl font-bold hover:bg-primary transition-all group shadow-xl shadow-deep/10">Schedule a Private Consultation <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" /></a>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 100, scale: 0.9 }} whileInView={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }} viewport={{ once: true }} className="relative lg:h-[90vh] flex items-end justify-center lg:justify-end">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_70%)] opacity-20 blur-3xl" />
          <img src="/images/dr-nova-new.png" alt="Dr. Julian Nova" className="h-full w-auto object-contain relative z-10 select-none grayscale hover:grayscale-0 transition-all duration-1000 transform scale-110 origin-bottom" />
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute top-[20%] -left-12 glass p-6 rounded-[32px] border border-white/80 shadow-2xl z-20 max-w-[180px] hidden xl:block">
            <p className="text-3xl font-display font-black text-primary mb-1">15+</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-deep/40 leading-tight">Years of Clinical Excellence</p>
          </motion.div>
          <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }} className="absolute bottom-[30%] -right-8 glass p-6 rounded-[32px] border border-white/80 shadow-2xl z-20 max-w-[180px] hidden xl:block">
            <p className="text-3xl font-display font-black text-primary mb-1">2k+</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-deep/40 leading-tight">Smile Transformations</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const BookingForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', location: '', date: '', service: 'Consultation' });
  const [submitted, setSubmitted] = useState(false);
  const { addPatient, addVisit, findPatientsByPhone } = useAdminStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // 1. Check if patient exists first (Phone is unique)
      const patients = await findPatientsByPhone(formData.phone);
      let patient = patients[0];
      
      // 2. Create patient if doesn't exist
      if (!patient) {
        patient = await addPatient({
          name: formData.name,
          age: Math.floor(Math.random() * 40) + 20,
          gender: 'Not Specified',
          phone: formData.phone,
          email: formData.email,
          location: formData.location,
          chief_complaint: formData.service
        });
      }
      
      // 3. Always create a new visit for the appointment
      await addVisit({
        patient_id: patient.id,
        visit_date: formData.date || new Date().toISOString().split('T')[0],
        doctor: 'Dr. Nova',
        status: 'pending',
        procedures: [],
        completion_pct: 0,
        total_cost: 0,
        amount_paid: 0,
        payment_status: 'unpaid',
        chief_complaint: formData.service
      });

      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      console.error('Booking error:', err);
      alert('Booking failed: ' + (err.message || 'Unknown error'));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-32 bg-deep relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0], opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--color-primary)_0%,_transparent_60%)]" />
        <motion.div animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0], opacity: [0.05, 0.15, 0.05] }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-[radial-gradient(circle_at_center,_var(--color-secondary)_0%,_transparent_60%)]" />
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20">
          <div className="text-white">
            <span className="text-primary font-bold tracking-[0.3em] uppercase text-[10px]">Get in touch</span>
            <h2 className="text-5xl md:text-7xl font-display font-black mt-4 mb-8 leading-tight">Your new smile <br /><span className="text-primary">starts here.</span></h2>
            <p className="text-white/40 text-lg mb-12 max-w-md">Contact our specialist team to book your initial consultation and take the first step towards dental perfection.</p>
            <div className="space-y-8">
              <div className="flex items-center gap-6"><div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center"><Phone className="text-primary" /></div><div><p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">Call us directly</p><p className="text-xl font-bold">+1 (555) 888 2000</p></div></div>
              <div className="flex items-center gap-6"><div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center"><Mail className="text-primary" /></div><div><p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">Email our studio</p><p className="text-xl font-bold">concierge@lumina-dental.com</p></div></div>
              <div className="flex items-center gap-6"><div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center"><MapPin className="text-primary" /></div><div><p className="text-xs text-white/40 font-bold uppercase tracking-widest mb-1">Find us at</p><p className="text-xl font-bold">77 Fifth Avenue, New York</p></div></div>
            </div>
          </div>
          <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-2xl relative">
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="flex flex-col items-center justify-center h-full text-center py-20"><div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-6"><Check size={40} strokeWidth={3} /></div><h3 className="text-3xl font-display font-bold text-deep mb-4">Request Sent!</h3><p className="text-deep/50 max-w-xs">Our concierge will contact you within the next 2 hours to confirm your appointment.</p></motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2"><label className="text-xs font-bold uppercase tracking-widest text-deep/40 pl-2">Full Name</label><input required type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary/30 focus:ring-0 transition-all outline-none" /></div>
                    <div className="space-y-2"><label className="text-xs font-bold uppercase tracking-widest text-deep/40 pl-2">Email Address</label><input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary/30 focus:ring-0 transition-all outline-none" /></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2"><label className="text-xs font-bold uppercase tracking-widest text-deep/40 pl-2">Phone Number</label><input required type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary/30 focus:ring-0 transition-all outline-none" /></div>
                    <div className="space-y-2"><label className="text-xs font-bold uppercase tracking-widest text-deep/40 pl-2">Location</label><input required type="text" name="location" value={formData.location} onChange={handleChange} placeholder="City, Area" className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary/30 focus:ring-0 transition-all outline-none" /></div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2"><label className="text-xs font-bold uppercase tracking-widest text-deep/40 pl-2">Preferred Date</label><div className="relative"><input required type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary/30 focus:ring-0 transition-all outline-none appearance-none" /><Calendar size={18} className="absolute right-6 top-1/2 -translate-y-1/2 text-deep/20 pointer-events-none" /></div></div>
                    <div className="space-y-2"><label className="text-xs font-bold uppercase tracking-widest text-deep/40 pl-2">Desired Treatment</label><select name="service" value={formData.service} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-transparent focus:bg-white focus:border-primary/30 focus:ring-0 transition-all outline-none appearance-none"><option>Consultation</option><option>Dental Implants</option><option>Teeth Whitening</option><option>Veneers</option><option>Checkup</option></select></div>
                  </div>
                  <button type="submit" className="w-full py-5 bg-primary text-white rounded-2xl font-bold text-lg hover:bg-secondary transition-all shadow-xl shadow-primary/20 transform hover:-translate-y-1 active:scale-[0.98] cursor-pointer">Confirm Appointment</button>
                  <p className="text-[10px] text-center text-deep/30 px-6 italic">By submitting, you agree to our privacy policy and consent to receive appointment communications.</p>
                </form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-white pt-24 pb-12 border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center"><Sparkles className="text-white w-4 h-4" /></div>
              <span className="text-lg font-display font-bold tracking-tight text-deep">Lumina Dental</span>
            </div>
            <p className="text-deep/50 text-sm leading-relaxed mb-6">Redefining aesthetic dentistry through art, science, and care. World-class treatments in the heart of New York.</p>
            <div className="flex gap-4">
              <Instagram className="w-5 h-5 text-deep/30 hover:text-primary transition-colors cursor-pointer" /><Facebook className="w-5 h-5 text-deep/30 hover:text-primary transition-colors cursor-pointer" /><Twitter className="w-5 h-5 text-deep/30 hover:text-primary transition-colors cursor-pointer" />
            </div>
          </div>
          <div><h4 className="font-bold text-deep mb-6 uppercase text-xs tracking-widest">Clinic</h4><ul className="space-y-4 text-sm text-deep/60"><li><a href="#" className="hover:text-primary transition-colors">Our Approach</a></li><li><a href="#" className="hover:text-primary transition-colors">Safety & Standards</a></li><li><a href="#" className="hover:text-primary transition-colors">Fees & Finance</a></li><li><a href="#" className="hover:text-primary transition-colors">Case Studies</a></li></ul></div>
          <div><h4 className="font-bold text-deep mb-6 uppercase text-xs tracking-widest">Treatments</h4><ul className="space-y-4 text-sm text-deep/60"><li><a href="#" className="hover:text-primary transition-colors">Aesthetic Consult</a></li><li><a href="#" className="hover:text-primary transition-colors">Dental Implants</a></li><li><a href="#" className="hover:text-primary transition-colors">Porcelain Veneers</a></li><li><a href="#" className="hover:text-primary transition-colors">Smile Makeover</a></li></ul></div>
          <div><h4 className="font-bold text-deep mb-6 uppercase text-xs tracking-widest">Hours</h4><ul className="space-y-4 text-sm text-deep/60"><li className="flex justify-between"><span>Mon - Fri</span><span>08:00 - 20:00</span></li><li className="flex justify-between"><span>Saturday</span><span>09:00 - 18:00</span></li><li className="flex justify-between"><span>Sunday</span><span className="text-red-400 font-bold">Closed</span></li></ul></div>
        </div>
        <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-bold uppercase tracking-[0.2em] text-deep/30">
          <p>© 2024 Lumina Dental Studio. All rights reserved.</p>
          <div className="flex gap-8"><a href="#" className="hover:text-deep transition-colors">Privacy Policy</a><a href="#" className="hover:text-deep transition-colors">Terms of Use</a></div>
        </div>
      </div>
    </footer>
  );
};

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-bg-light font-sans selection:bg-primary/20 selection:text-primary">
      <Navbar />
      <Hero />
      <ServicesAndCalculator />
      <BeforeAfter />
      <Testimonials />
      <DoctorProfile />
      <BookingForm />
      <Footer />
    </div>
  );
};
