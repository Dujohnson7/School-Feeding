
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { School, Users, Truck, MapPin, TrendingUp, Shield, Clock, CheckCircle, ArrowRight, Phone, Mail, Globe, Menu, X, Brain, BookOpen, Activity, Home, Utensils, GraduationCap, ChevronRight, BarChart3, Target, Zap } from "lucide-react"
import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"

function useIntersectionObserver(options = {}) {
  const [element, setElement] = useState<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect(); 
      }
    }, { threshold: 0.1, ...options });

    observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, [element, options]);

  return [setElement, isVisible] as const;
}

const Counter = ({ end, duration = 2000, suffix = "" }: { end: number, duration?: number, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const [ref, isVisible] = useIntersectionObserver();

  useEffect(() => {
    if (!isVisible) return;

    let startTime: number | null = null;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
 
      const easeOutQuart = (x: number) => 1 - Math.pow(1 - x, 4);

      setCount(Math.floor(easeOutQuart(progress) * end));

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return <span ref={ref as any}>{count.toLocaleString()}{suffix}</span>;
};

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  useEffect(() => {
    if (!api) return

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0) 
      }
    }, 6000)

    return () => clearInterval(interval)
  }, [api])

  const stats = [
    { label: "Schools Supported", value: 2847, description: "Partner institutions", icon: School, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Students Fed Daily", value: 1200000, isFloat: true, display: "1.2M", description: "Beneficiaries", icon: Users, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Active Suppliers", value: 156, description: "Local partners", icon: Truck, color: "text-sky-600", bg: "bg-sky-50" },
    { label: "Districts Covered", value: 30, description: "Nationwide reach", icon: MapPin, color: "text-purple-600", bg: "bg-purple-50" },
  ]

  const importanceItems = [
    {
      title: "Academic Performance",
      description: "23% better learning outcomes and improved concentration.",
      icon: Brain,
      color: "text-blue-500",
    },
    {
      title: "School Attendance",
      description: "Increase attendance rates by up to 85% among children.",
      icon: BookOpen,
      color: "text-indigo-500",
    },
    {
      title: "Health & Nutrition",
      description: "Balanced meals reduce malnutrition by 40% globally.",
      icon: Activity,
      color: "text-teal-500",
    },
    {
      title: "Local Economy",
      description: "Creating jobs and strengthening local farmer markets.",
      icon: Home,
      color: "text-orange-500",
    }
  ]

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
      {/* Navigation */}
      <nav
        className={cn(
          "fixed w-full z-50 transition-all duration-300 border-b border-transparent",
          scrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-gray-100 py-2" : "bg-transparent py-4 text-white"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3 group cursor-pointer">
              <div className="relative overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-110">
                <img
                  src="/logo.svg"
                  alt="School Feeding Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-cover"
                />
              </div>
              <span className={cn("text-xl font-bold transition-colors", scrolled ? "text-slate-900" : "text-white drop-shadow-md")}>
                School Feeding
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {['About', 'Services', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={cn(
                    "text-sm font-medium transition-all hover:-translate-y-0.5",
                    scrolled
                      ? "text-slate-600 hover:text-blue-600"
                      : "text-white/90 hover:text-white drop-shadow-sm"
                  )}
                >
                  {item}
                </a>
              ))}
              <Link to="/login">
                <Button
                  className={cn(
                    "transition-all duration-300 px-6 rounded-full",
                    scrolled
                      ? "bg-blue-900 hover:bg-blue-800 text-white shadow-md"
                      : "bg-white text-blue-900 hover:bg-gray-100 shadow-lg"
                  )}
                >
                  Login
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={cn(scrolled ? "text-slate-900" : "text-white")}
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-t border-gray-100 shadow-xl animate-in slide-in-from-top-5">
              <div className="flex flex-col p-4 space-y-4">
                {['About', 'Services', 'Team', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="text-slate-600 font-medium hover:text-blue-600 hover:bg-blue-50 px-4 py-3 rounded-lg transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item}
                  </a>
                ))}
                <div className="px-4 pt-2">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full bg-blue-900 hover:bg-blue-800 text-white shadow-lg rounded-full">
                      Login
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Slideshow */}
      <section className="relative w-full overflow-hidden h-[780px]">
        <Carousel setApi={setApi} className="w-full h-full" opts={{ loop: true, align: "start" }}>
          <CarouselContent className="-ml-0 w-full h-full">
            {/* Slide 1 */}
            <CarouselItem className="pl-0 basis-full h-full">
              <div className="relative w-full h-full">
                <div className="absolute inset-0 bg-blue-900/10 z-10"></div>
                <img
                  src="/images/image01.jpg"
                  alt="Happy students"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-transparent z-20"></div>
                <div className="absolute inset-0 flex items-center z-30">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full animate-in fade-in slide-in-from-left-10 duration-1000">
                    <div className="max-w-2xl space-y-6">
                      <h4 className="text-yellow-400 font-semibold tracking-wide uppercase text-sm">
                        Building a brighter future
                      </h4>
                      <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                        WE IMPROVE YOUR <br />
                        <span className="text-blue-400">SCHOOL FEEDING</span>
                      </h1>
                      <p className="text-lg text-slate-200 max-w-lg leading-relaxed">
                        A comprehensive digital platform managing school feeding programs across Rwanda.
                      </p>
                      <div className="pt-4">
                        <Link to="/login">
                          <Button className="bg-white text-blue-900 hover:bg-gray-100 rounded-full px-8 py-6 text-lg font-semibold shadow-xl transition-transform hover:-translate-y-1">
                            Get Started
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>

            {/* Slide 2 */}
            <CarouselItem className="pl-0 basis-full h-full">
              <div className="relative w-full h-full">
                <img
                  src="/images/image02.jpg"
                  alt="Students learning"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-transparent to-transparent z-20"></div>
                <div className="absolute inset-0 flex items-center z-30">
                  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full animate-in fade-in slide-in-from-left-10 duration-1000">
                    <div className="max-w-2xl space-y-6">
                      <h4 className="text-yellow-400 font-semibold tracking-wide uppercase text-sm">
                        Quality Nutrition
                      </h4>
                      <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                        HEALTHY MEALS FOR <br />
                        <span className="text-emerald-400">EVERY CHILD</span>
                      </h1>
                      <div className="pt-4">
                        <Link to="/login">
                          <Button className="bg-emerald-500 text-white hover:bg-emerald-600 rounded-full px-8 py-6 text-lg font-semibold shadow-xl transition-transform hover:-translate-y-1">
                            Join Us
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>

          {/* Custom Indicators */}
          <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col space-y-3 z-30 hidden md:flex">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={cn(
                  "w-2 rounded-full transition-all duration-300 bg-white/50 hover:bg-white",
                  index + 1 === current ? "h-8 bg-white" : "h-2"
                )}
              />
            ))}
          </div>
        </Carousel>
      </section>

      {/* Statistics Strip - Lowered Position */}
      <section className="relative z-40 bg-slate-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          {/* Negative margin reduced to allow it to sit just below or slightly overlap */}
          <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-white shadow-xl md:rounded-lg -mt-12 mx-4 md:mx-0 overflow-hidden relative">
            {stats.map((stat, index) => (
              <div key={index} className="p-8 group hover:bg-slate-50 transition-colors cursor-default text-center">
                <div className="flex flex-col items-center">
                  <stat.icon className={cn("w-10 h-10 mb-4 transition-transform group-hover:scale-110 duration-300", stat.color)} />
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{stat.label}</h3>
                  <p className="text-slate-500 text-sm">{stat.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section - Swapped Layout (Image Left) */}
      <section id="about" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left Column: Image */}
            <div className="relative">
              <div className="relative rounded-sm overflow-hidden shadow-2xl">
                <img
                  src="/images/image09.jpg"
                  alt="Students focused"
                  className="w-full h-auto object-cover"
                />
              </div>
              {/* Decorative dots or shape */}
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-blue-100 rounded-full -z-10"></div>
              <div className="absolute -top-6 -right-6 w-32 h-32 bg-slate-50 rounded-full -z-10"></div>
            </div>

            {/* Right Column: Text */}
            <div className="space-y-8">
              <div>
                <h4 className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-2">About Our Program</h4>
                <h2 className="text-4xl font-bold text-slate-900 leading-tight mb-6">
                  We Provide High Quality Nutrition & <br /> Innovative Solutions
                </h2>
                <p className="text-slate-600 leading-relaxed text-lg">
                  The Rwanda School Feeding Program is a transformative government initiative designed to improve student health, nutrition, and educational outcomes.
                </p>
                <p className="text-slate-500 leading-relaxed mt-4">
                  We ensure transparency and efficiency in the delivery of millions of meals every day, fostering a healthier generation ready to learn.
                </p>
              </div>

              <div className="flex justify-between gap-4 pt-4 border-t border-gray-100">
                <div className="text-center">
                  <Target className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h5 className="font-bold text-slate-900">Vision</h5>
                </div>
                <div className="text-center">
                  <Zap className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h5 className="font-bold text-slate-900">Mission</h5>
                </div>
                <div className="text-center">
                  <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h5 className="font-bold text-slate-900">Goal</h5>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Separator / CTA Strip */}
      <section className="py-16 bg-blue-900 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/image02.jpg')] opacity-10 bg-cover bg-center mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">We provide high quality services & innovative solutions</h2>
          <Link to="/login">
            <Button className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-md font-semibold">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Services / Importance Section */}
      <section id="services" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h4 className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-2">Our Impact</h4>
          <h2 className="text-4xl font-bold text-slate-900 mb-16">Why It Matters</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {importanceItems.map((item, idx) => (
              <div key={idx} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-xl transition-shadow border-t-4 border-transparent hover:border-blue-600 group">
                <div className="flex justify-center mb-6">
                  <item.icon className={cn("w-12 h-12 group-hover:scale-110 transition-transform duration-300", item.color)} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">
                  {item.description}
                </p>
                <div className="mt-4">
                  <a href="#" className="text-blue-600 text-sm font-semibold hover:underline">Read More</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fun Facts / Impact Section - Centered */}
      <section className="py-24 bg-white relative">
        {/* Background Map Graphic Placeholder */}
        <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
          <Globe className="w-[600px] h-[600px] text-slate-300" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h4 className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-2">Fun Facts</h4>
          <h2 className="text-4xl font-bold text-slate-900 mb-16">Some fun facts about our program</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="space-y-2">
              <div className="text-5xl font-bold text-slate-300">
                <Counter end={2847} suffix="+" />
              </div>
              <p className="font-bold text-slate-900">Schools</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Supported</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-slate-300">
                <Counter end={100} suffix="%" />
              </div>
              <p className="font-bold text-slate-900">Growth</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Year over Year</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-slate-300">
                <Counter end={30} suffix="+" />
              </div>
              <p className="font-bold text-slate-900">Districts</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Covered</p>
            </div>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-slate-300">
                <Counter end={24} suffix="/7" />
              </div>
              <p className="font-bold text-slate-900">Support</p>
              <p className="text-xs text-slate-500 uppercase tracking-widest">Monitoring</p>
            </div>
          </div>

          <div className="mt-16">
            <Link to="/login">
              <Button className="bg-blue-900 text-white px-8 py-3 rounded-sm hover:bg-slate-800">
                VIEW REPORT
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Contact / Consultation Section */}
      <section id="contact" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-4 text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">FREE CONSULTATION</h2>
          <div className="w-12 h-1 bg-blue-600 mx-auto mt-4 mb-4"></div>
          <p className="text-slate-500">Contact us to learn more about how you can support or participate in the program.</p>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden flex flex-col md:flex-row">
            <div className="md:w-1/2 relative min-h-[400px]">
              <img src="/images/image02.jpg" className="absolute inset-0 w-full h-full object-cover" alt="Contact" />
              <div className="absolute inset-0 bg-blue-900/20"></div>
            </div>
            <div className="md:w-1/2 p-12">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Name</label>
                  <input type="text" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-blue-600 transition-colors" placeholder="Your name" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Email</label>
                  <input type="email" className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-blue-600 transition-colors" placeholder="Your email" />
                </div>
              </div>
              <div className="space-y-2 mb-8">
                <label className="text-xs font-bold text-slate-400 uppercase">Message</label>
                <textarea className="w-full border-b border-gray-200 py-2 focus:outline-none focus:border-blue-600 transition-colors resize-none" rows={3} placeholder="How can we help?"></textarea>
              </div>
              <Button className="bg-blue-900 hover:bg-blue-800 text-white px-8 rounded-sm">
                SEND MESSAGE
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-blue-950 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 text-sm border-b border-blue-900 pb-12 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <img src="/logo.svg" alt="Logo" className="h-8 w-auto bg-white rounded-full p-1" />
                <span className="font-bold text-xl tracking-tight">School Feeding</span>
              </div>
              <p className="text-blue-200 leading-relaxed">
                Empowering the next generation through nutrition, education, and community support.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider">Useful Links</h4>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Our Services</a></li>
                <li><a href="#" className="hover:text-white">Track Record</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider">Resources</h4>
              <ul className="space-y-2 text-blue-200">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Support</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Use</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-6 uppercase tracking-wider">Newsletter</h4>
              <p className="text-blue-200 mb-4">Subscribe to get the latest news and updates.</p>
              <div className="flex">
                <input type="text" placeholder="Enter your email" className="bg-blue-900 border-none text-white px-4 py-2 w-full focus:ring-1 focus:ring-blue-500 outline-none rounded-l-sm" />
                <button className="bg-white text-blue-900 font-bold px-4 py-2 rounded-r-sm uppercase text-xs">GO</button>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center text-blue-300 text-xs">
            <p>&copy; {new Date().getFullYear()} School Feeding Program. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
