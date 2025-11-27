
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import { School, Users, Truck, MapPin, TrendingUp, Shield, Clock, CheckCircle, ArrowRight, Phone, Mail, Globe, Menu, X, Brain, BookOpen, Activity, Home, Utensils, GraduationCap, } from "lucide-react"
import { Link } from "react-router-dom"

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

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

  // Autoplay functionality
  useEffect(() => {
    if (!api) return

    const interval = setInterval(() => {
      if (api.canScrollNext()) {
        api.scrollNext()
      } else {
        api.scrollTo(0) // Reset to first slide
      }
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [api])

  const stats = [
    { label: "Schools Supported", value: "2,847", icon: School, color: "text-blue-600" },
    { label: "Students Fed Daily", value: "1.2M", icon: Users, color: "text-blue-600" },
    { label: "Active Suppliers", value: "156", icon: Truck, color: "text-blue-600" },
    { label: "Districts Covered", value: "30", icon: MapPin, color: "text-blue-600" },
  ]

  const features = [
    {
      title: "Real-time Monitoring",
      description: "Track food distribution, inventory levels, and delivery status in real-time across all schools.",
      icon: Clock,
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Quality Assurance",
      description: "Ensure food safety and nutritional standards with comprehensive quality control systems.",
      icon: Shield,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      title: "Transparent Operations",
      description: "Complete visibility into the supply chain from procurement to student meals.",
      icon: CheckCircle,
      color: "bg-sky-50 text-sky-600",
    },
    {
      title: "Impact Measurement",
      description: "Measure the program's impact on student health, attendance, and academic performance.",
      icon: TrendingUp,
      color: "bg-cyan-50 text-cyan-600",
    },
  ]

  const importanceItems = [
    {
      title: "Improved Academic Performance",
      description: "Well-nourished students show 23% better learning outcomes and improved concentration in class.",
      icon: Brain,
      color: "bg-blue-500",
    },
    {
      title: "Enhanced School Attendance",
      description:
        "School feeding programs increase attendance rates by up to 85%, especially among vulnerable children.",
      icon: BookOpen,
      color: "bg-indigo-500",
    },
    {
      title: "Better Health & Nutrition",
      description: "Balanced meals reduce malnutrition by 40% and improve overall child health and development.",
      icon: Activity,
      color: "bg-sky-500",
    },
    {
      title: "Community Development",
      description: "Programs support local farmers and suppliers, creating jobs and strengthening local economies.",
      icon: Home,
      color: "bg-cyan-500",
    },
    {
      title: "Food Security",
      description: "Ensures consistent access to nutritious meals, reducing household food insecurity by 60%.",
      icon: Utensils,
      color: "bg-blue-600",
    },
    {
      title: "Long-term Education Goals",
      description: "Students are 3x more likely to complete their education when school feeding is available.",
      icon: GraduationCap,
      color: "bg-indigo-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2"> 
               <img
                   src="/logo.svg"
                   alt="School Feeding Logo"
                   width={30}
                   height={30}
                   className="h-auto object-cover"
                 />
              <span className="text-xl font-bold text-blue-900">School Feeding</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
                About
              </a>
              <a href="#importance" className="text-gray-700 hover:text-blue-600 transition-colors">
                Importance
              </a>
              <a href="#impact" className="text-gray-700 hover:text-blue-600 transition-colors">
                Impact
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                Contact
              </a>
              <Link to="/login">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                  Login
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <a href="#about" className="text-gray-700 hover:text-blue-600 transition-colors">
                  About
                </a>
                <a href="#importance" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Importance
                </a>
                <a href="#impact" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Impact
                </a>
                <a href="#contact" className="text-gray-700 hover:text-blue-600 transition-colors">
                  Contact
                </a>
                <Link to="/login">
                  <Button className="bg-blue-600 hover:bg-blue-700 w-full text-white">
                    Login
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Slideshow */}
      <section className="relative w-full overflow-hidden">
        <div className="w-full relative">
          <Carousel setApi={setApi} className="w-full" opts={{ loop: true, align: "start" }}>
            <CarouselContent className="-ml-0 w-full">
              {/* Slide 1 */}
              <CarouselItem className="pl-0 basis-full">
                <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
                  <img
                    src="/images/image01.jpg"
                    alt="Happy students enjoying nutritious meals in school cafeteria"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
                  <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                      <div className="max-w-2xl space-y-6 text-white">
                        <Badge className="mb-4 bg-blue-500/90 text-white hover:bg-blue-500/90 border-0">
                          Transforming Education Through Nutrition
                        </Badge>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                          Nourishing Rwanda's
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-300 block">
                            Future Leaders
                          </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-100 leading-relaxed">
                          A comprehensive digital platform managing school feeding programs across Rwanda, ensuring every child
                          receives nutritious meals to support their education and development.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <Link to="https://www.mineduc.gov.rw/index.php?eID=dumpFile&t=f&f=23437&token=cb243d309da920d47fec8fdd0ad3011928149779" target="_blank">
                            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                              Read More
                              <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* Slide 2 */}
              <CarouselItem className="pl-0 basis-full">
                <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
                  <img
                    src="/images/image02.jpg"
                    alt="Students showing improved concentration and learning in classroom"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
                  <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                      <div className="max-w-2xl space-y-6 text-white">
                        <Badge className="mb-4 bg-indigo-500/90 text-white hover:bg-indigo-500/90 border-0">
                          Quality Nutrition for Every Child
                        </Badge>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                          Building Healthy
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 block">
                            Communities
                          </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-100 leading-relaxed">
                          Our program ensures that every student receives balanced, nutritious meals that meet international
                          nutritional standards, supporting their physical growth and cognitive development.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <Link to="/login">
                            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg">
                              Get Started
                              <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* Slide 3 */}
              <CarouselItem className="pl-0 basis-full">
                <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
                  <img
                    src="/images/image09.jpg"
                    alt="School feeding program community impact"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
                  <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                      <div className="max-w-2xl space-y-6 text-white">
                        <Badge className="mb-4 bg-sky-500/90 text-white hover:bg-sky-500/90 border-0">
                          Transparency & Accountability
                        </Badge>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                          Real-time
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 to-cyan-300 block">
                            Monitoring & Tracking
                          </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-100 leading-relaxed">
                          Track food distribution, inventory levels, and delivery status in real-time. Our platform ensures
                          complete transparency from procurement to student meals.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <Link to="/login">
                            <Button size="lg" className="bg-sky-600 hover:bg-sky-700 text-white shadow-lg">
                              Explore Platform
                              <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>

              {/* Slide 4 */}
              <CarouselItem className="pl-0 basis-full">
                <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
                  <img
                    src="/images/image01.jpg"
                    alt="Successful school feeding program results"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
                  <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                      <div className="max-w-2xl space-y-6 text-white">
                        <Badge className="mb-4 bg-cyan-500/90 text-white hover:bg-cyan-500/90 border-0">
                          Impact & Results
                        </Badge>
                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold">
                          Measurable
                          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-teal-300 block">
                            Success Stories
                          </span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-100 leading-relaxed">
                          With over 1.2 million students fed daily and 2,847 schools supported, our program has shown
                          significant improvements in attendance, academic performance, and overall student well-being.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                          <Link to="#impact">
                            <Button size="lg" className="bg-cyan-600 hover:bg-cyan-700 text-white shadow-lg">
                              View Impact
                              <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CarouselItem>
            </CarouselContent>
            
            {/* Navigation Arrows */}
            <CarouselPrevious className="left-4 md:left-8 h-12 w-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm shadow-lg border-0 text-white hover:text-white z-20" />
            <CarouselNext className="right-4 md:right-8 h-12 w-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm shadow-lg border-0 text-white hover:text-white z-20" />
          </Carousel>

          {/* Slide Indicators */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex justify-center gap-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index + 1 === current
                    ? "w-8 bg-white"
                    : "w-2 bg-white/50 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
              Our Impact
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Program Impact in Numbers
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Real numbers showing the reach and impact of our school feeding program across Rwanda
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-2xl transition-all duration-300 border-0 shadow-lg hover:scale-105 bg-white/80 backdrop-blur-sm">
                <CardContent className="pt-8 pb-8">
                  <div
                    className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center ${stat.color} shadow-md`}
                  >
                    <stat.icon className="w-8 h-8" />
                  </div>
                  <div className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
                    {stat.value}
                  </div>
                  <div className="text-gray-700 font-medium text-lg">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-indigo-100 text-indigo-800 hover:bg-indigo-100">
              About Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              About Rwanda School Feeding Program
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive government initiative transforming education through nutrition
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-lg text-gray-700 leading-relaxed">
                  The Rwanda School Feeding Program is a government initiative designed to improve student health,
                  nutrition, and educational outcomes by providing nutritious meals to students across the country.
                </p>
                <p className="text-lg text-gray-700 leading-relaxed">
                  Our digital platform streamlines the entire process from procurement to delivery, ensuring transparency,
                  efficiency, and accountability at every step.
                </p>
              </div>

              <div className="space-y-5">
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-7 h-7 text-blue-600 mt-0.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Improved Nutrition</h4>
                    <p className="text-gray-700">Balanced meals meeting nutritional standards for growing children</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-7 h-7 text-indigo-600 mt-0.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Increased Attendance</h4>
                    <p className="text-gray-700">Students are more likely to attend school when meals are provided</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-sky-50 hover:bg-sky-100 transition-colors">
                  <div className="flex-shrink-0">
                    <CheckCircle className="w-7 h-7 text-sky-600 mt-0.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 text-lg mb-1">Better Learning Outcomes</h4>
                    <p className="text-gray-700">Well-nourished students perform better academically</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                 <img
                   src="/images/image02.jpg"
                   alt="Students showing improved concentration and learning in classroom"
                   className="w-full h-[500px] object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl border-0">
                  <div className="text-4xl font-bold mb-2">98%</div>
                  <div className="text-sm text-blue-100">School Participation Rate</div>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-xl border-0">
                  <div className="text-4xl font-bold mb-2">85%</div>
                  <div className="text-sm text-indigo-100">Attendance Improvement</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>
 

      {/* Importance of School Feeding Section */}
      <section id="importance" className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 border-2 border-blue-300 rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 border-2 border-indigo-300 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-2 border-blue-200 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-100">
              Why It Matters
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Why School Feeding Matters</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              School feeding programs are transformative interventions that address multiple challenges simultaneously,
              creating lasting positive impacts on children, families, and communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {importanceItems.map((item, index) => (
              <Card
                key={index}
                className="bg-white/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group hover:scale-105"
              >
                <CardHeader className="text-center pb-4 pt-8">
                  <div
                    className={`w-20 h-20 mx-auto mb-6 rounded-full ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900 mb-2">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center pb-8">
                  <CardDescription className="text-gray-700 text-base leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Community Impact Image */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border-0">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-10 lg:p-14 flex flex-col justify-center bg-gradient-to-br from-white to-blue-50/30">
                <Badge className="mb-4 w-fit bg-blue-100 text-blue-800 hover:bg-blue-100">
                  Community Impact
                </Badge>
                <h3 className="text-3xl font-bold text-gray-900 mb-6">Community-Centered Approach</h3>
                <p className="text-gray-700 mb-8 leading-relaxed text-lg">
                  Our school feeding program goes beyond just providing meals. It creates a sustainable ecosystem that
                  supports local farmers, suppliers, and communities while ensuring children receive the nutrition they
                  need to thrive academically and physically.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors">
                    <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-800 font-medium">Local sourcing supports 500+ farmers</span>
                  </div>
                  <div className="flex items-center space-x-4 p-3 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-800 font-medium">Creates 2,000+ jobs in rural communities</span>
                  </div>
                  <div className="flex items-center space-x-4 p-3 rounded-lg bg-sky-50 hover:bg-sky-100 transition-colors">
                    <div className="w-3 h-3 bg-sky-500 rounded-full flex-shrink-0"></div>
                    <span className="text-gray-800 font-medium">Reduces family food expenses by 40%</span>
                  </div>
                </div>
              </div>
              <div className="relative h-64 lg:h-auto min-h-[400px]">
                 <img
                   src="/images/image09.jpg"
                   alt="School feeding program"
                   className="w-full h-full object-cover"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-cyan-100 text-cyan-800 hover:bg-cyan-100">
              Our Progress
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Program Impact & Progress
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Measuring success through key performance indicators and continuous improvement
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-8 shadow-2xl border-0 bg-gradient-to-br from-white to-blue-50/50 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                  <School className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Coverage Progress</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-base font-medium text-gray-700">Primary Schools</span>
                    <span className="text-lg font-bold text-blue-600">94%</span>
                  </div>
                  <Progress value={94} className="h-3 bg-gray-200" />
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-base font-medium text-gray-700">Secondary Schools</span>
                    <span className="text-lg font-bold text-indigo-600">78%</span>
                  </div>
                  <Progress value={78} className="h-3 bg-gray-200" />
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-base font-medium text-gray-700">Rural Areas</span>
                    <span className="text-lg font-bold text-sky-600">89%</span>
                  </div>
                  <Progress value={89} className="h-3 bg-gray-200" />
                </div>
              </div>
            </Card>

            <Card className="p-8 shadow-2xl border-0 bg-gradient-to-br from-white to-indigo-50/50 hover:shadow-3xl transition-all duration-300">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Quality Metrics</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-base font-medium text-gray-700">Food Safety Standards</span>
                    <span className="text-lg font-bold text-green-600">96%</span>
                  </div>
                  <Progress value={96} className="h-3 bg-gray-200" />
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-base font-medium text-gray-700">Nutritional Requirements</span>
                    <span className="text-lg font-bold text-cyan-600">92%</span>
                  </div>
                  <Progress value={92} className="h-3 bg-gray-200" />
                </div>
                <div>
                  <div className="flex justify-between mb-3">
                    <span className="text-base font-medium text-gray-700">On-time Delivery</span>
                    <span className="text-lg font-bold text-teal-600">88%</span>
                  </div>
                  <Progress value={88} className="h-3 bg-gray-200" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
              Contact Us
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get In Touch
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about the school feeding program? We're here to help and support you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <Phone className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Phone</h3>
              <p className="text-gray-700 text-lg">+250 788 123 456</p>
            </Card>

            <Card className="text-center p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                <Mail className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Email</h3>
              <p className="text-gray-700 text-lg">schoolfeeding.info@gmail.com</p>
            </Card>

            <Card className="text-center p-8 shadow-2xl border-0 bg-white/90 backdrop-blur-sm hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
                <Globe className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-900">Website</h3>
              <p className="text-gray-700 text-lg">www.schoolfeeding.gov.rw</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                 <img
                   src="/logo.svg"
                   alt="School Feeding Logo"
                   width={20}
                   height={20}
                   className="h-auto object-cover"
                 />
                <span className="text-xl font-bold">School Feeding</span>
              </div>
              <p className="text-gray-400">
                Nourishing minds, building futures through comprehensive school feeding programs.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#about" className="hover:text-white transition-colors">
                    About
                  </a>
                </li>
                <li>
                  <a href="#importance" className="hover:text-white transition-colors">
                    Importance
                  </a>
                </li>
                <li>
                  <a href="#impact" className="hover:text-white transition-colors">
                    Impact
                  </a>
                </li>
                <li>
                  <a href="#contact" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform Access</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/login" className="hover:text-white transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <a href="https://www.mineduc.gov.rw/index.php?eID=dumpFile&t=f&f=23437&token=cb243d309da920d47fec8fdd0ad3011928149779" target="_blank" className="hover:text-white transition-colors">
                    Documentation
                  </a>
                </li>
                <li>
                  <a href="https://planipolis.iiep.unesco.org/sites/default/files/ressources/rwanda_school_feeding_operational_guidelines_summary.pdf" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li> 
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Government</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="https://www.mineduc.gov.rw/" target="_blank" className="hover:text-white transition-colors">
                    Ministry of Education
                  </a> 
                </li>
                <li>
                  <a href="https://www.rab.gov.rw/" target="_blank"  className="hover:text-white transition-colors">
                    Rwanda Agriculture Board
                  </a>
                </li>
                <li>
                  <a href="https://www.gov.rw/" target="_blank"   className="hover:text-white transition-colors">
                    Local Government
                  </a>
                </li> 
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 School Feeding. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
