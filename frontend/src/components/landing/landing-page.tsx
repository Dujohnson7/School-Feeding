
import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  School,
  Users,
  Truck,
  MapPin,
  TrendingUp,
  Heart,
  Shield,
  Clock,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Globe,
  Menu,
  X,
  Brain,
  BookOpen,
  Activity,
  Home,
  Utensils,
  GraduationCap,
} from "lucide-react"
import { Link } from "react-router-dom"

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-white to-indigo-100">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 left-10 w-32 h-32 border-2 border-blue-300 rounded-full"></div>
            <div className="absolute top-32 right-20 w-24 h-24 border-2 border-indigo-300 rounded-full"></div>
            <div className="absolute bottom-20 left-1/4 w-40 h-40 border-2 border-blue-200 rounded-full"></div>
            <div className="absolute bottom-32 right-1/3 w-28 h-28 border-2 border-indigo-200 rounded-full"></div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
                Transforming Education Through Nutrition
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Nourishing Rwanda's
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                  {" "}
                  Future Leaders
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                A comprehensive digital platform managing school feeding programs across Rwanda, ensuring every child
                receives nutritious meals to support their education and development.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="https://www.mineduc.gov.rw/index.php?eID=dumpFile&t=f&f=23437&token=cb243d309da920d47fec8fdd0ad3011928149779" target="_blank">
                  <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Read More
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link> 
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                 <img
                   src="/images/image01.jpg"
                   alt="Happy students enjoying nutritious meals in school cafeteria"
                   width={600}
                   height={400}
                   className="w-full h-auto object-cover"
                 />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Program Impact</h2>
            <p className="text-lg text-gray-600">
              Real numbers showing the reach and impact of our school feeding program
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardContent className="pt-6">
                  <div
                    className={`w-12 h-12 mx-auto mb-4 rounded-full bg-blue-50 flex items-center justify-center ${stat.color}`}
                  >
                    <stat.icon className="w-6 h-6" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">About Rwanda School Feeding Program</h2>
              <p className="text-lg text-gray-600 mb-6">
                The Rwanda School Feeding Program is a government initiative designed to improve student health,
                nutrition, and educational outcomes by providing nutritious meals to students across the country.
              </p>
              <p className="text-lg text-gray-600 mb-8">
                Our digital platform streamlines the entire process from procurement to delivery, ensuring transparency,
                efficiency, and accountability at every step.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Improved Nutrition</h4>
                    <p className="text-gray-600">Balanced meals meeting nutritional standards for growing children</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Increased Attendance</h4>
                    <p className="text-gray-600">Students are more likely to attend school when meals are provided</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-gray-900">Better Learning Outcomes</h4>
                    <p className="text-gray-600">Well-nourished students perform better academically</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-xl">
                 <img
                   src="/images/image02.jpg"
                   alt="Students showing improved concentration and learning in classroom"
                   width={500}
                   height={400}
                   className="w-full h-auto object-cover"
                 />
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <Card className="p-4 bg-white shadow-md">
                  <div className="text-2xl font-bold text-blue-600 mb-2">98%</div>
                  <div className="text-sm text-gray-600">School Participation Rate</div>
                </Card>
                <Card className="p-4 bg-white shadow-md">
                  <div className="text-2xl font-bold text-indigo-600 mb-2">85%</div>
                  <div className="text-sm text-gray-600">Attendance Improvement</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Platform Features</h2>
            <p className="text-lg text-gray-600">
              Advanced technology ensuring efficient and transparent school feeding operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg ${feature.color} flex items-center justify-center mb-4`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Importance of School Feeding Section */}
      <section id="importance" className="py-16 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-64 h-64 border-2 border-blue-300 rounded-full"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 border-2 border-indigo-300 rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-2 border-blue-200 rounded-full"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Why School Feeding Matters</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              School feeding programs are transformative interventions that address multiple challenges simultaneously,
              creating lasting positive impacts on children, families, and communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {importanceItems.map((item, index) => (
              <Card
                key={index}
                className="bg-white hover:shadow-xl transition-all duration-300 border-0 shadow-lg group"
              >
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full ${item.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                  >
                    <item.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-gray-600 text-base leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Community Impact Image */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Community-Centered Approach</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our school feeding program goes beyond just providing meals. It creates a sustainable ecosystem that
                  supports local farmers, suppliers, and communities while ensuring children receive the nutrition they
                  need to thrive academically and physically.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-700">Local sourcing supports 500+ farmers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                    <span className="text-gray-700">Creates 2,000+ jobs in rural communities</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-sky-500 rounded-full"></div>
                    <span className="text-gray-700">Reduces family food expenses by 40%</span>
                  </div>
                </div>
              </div>
              <div className="relative h-64 lg:h-auto">
                 <img
                   src="/images/image09.jpg"
                   alt="School feeding program"
                   width={600}
                   height={400}
                   className="w-full h-full object-cover"
                 />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Program Impact & Progress</h2>
            <p className="text-lg text-gray-600">Measuring success through key performance indicators</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="p-6 shadow-lg border-0">
              <h3 className="text-xl font-semibold mb-4">Coverage Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Primary Schools</span>
                    <span className="text-sm font-medium">94%</span>
                  </div>
                  <Progress value={94} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Secondary Schools</span>
                    <span className="text-sm font-medium">78%</span>
                  </div>
                  <Progress value={78} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Rural Areas</span>
                    <span className="text-sm font-medium">89%</span>
                  </div>
                  <Progress value={89} className="h-2" />
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-lg border-0">
              <h3 className="text-xl font-semibold mb-4">Quality Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Food Safety Standards</span>
                    <span className="text-sm font-medium">96%</span>
                  </div>
                  <Progress value={96} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">Nutritional Requirements</span>
                    <span className="text-sm font-medium">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-gray-600">On-time Delivery</span>
                    <span className="text-sm font-medium">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-lg text-gray-600">
              Have questions about the school feeding program? We're here to help.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-6 shadow-lg border-0">
              <Phone className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Phone</h3>
              <p className="text-gray-600">+250 788 123 456</p>
            </Card>

            <Card className="text-center p-6 shadow-lg border-0">
              <Mail className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Email</h3>
              <p className="text-gray-600">info@schoolfeeding.gov.rw</p>
            </Card>

            <Card className="text-center p-6 shadow-lg border-0">
              <Globe className="w-8 h-8 text-blue-600 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Website</h3>
              <p className="text-gray-600">www.schoolfeeding.gov.rw</p>
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
