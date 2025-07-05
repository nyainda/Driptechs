import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Compass, 
  Wrench, 
  Cog, 
  GraduationCap, 
  Leaf, 
  Zap,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail
} from "lucide-react";

export default function Services() {
  const services = [
    {
      id: "design",
      title: "System Design & Planning",
      description: "Custom irrigation system design tailored to your specific crop requirements, soil conditions, and water sources.",
      icon: Compass,
      color: "bg-blue-600",
      features: [
        "Site survey and analysis",
        "Hydraulic calculations",
        "3D system modeling",
        "Cost optimization",
        "ROI analysis",
        "Regulatory compliance"
      ],
      process: [
        "Initial consultation",
        "Site assessment",
        "Technical design",
        "Client approval",
        "Implementation planning"
      ]
    },
    {
      id: "installation",
      title: "Professional Installation",
      description: "Professional installation by certified technicians ensuring optimal performance and longevity.",
      icon: Wrench,
      color: "bg-green-600",
      features: [
        "Certified installation team",
        "Quality assurance testing",
        "System commissioning",
        "Training included",
        "Warranty coverage",
        "Post-installation support"
      ],
      process: [
        "Pre-installation planning",
        "Equipment delivery",
        "Installation execution",
        "System testing",
        "Client training"
      ]
    },
    {
      id: "maintenance",
      title: "Maintenance & Support",
      description: "Comprehensive maintenance programs to ensure your irrigation system operates at peak efficiency.",
      icon: Cog,
      color: "bg-purple-600",
      features: [
        "Scheduled inspections",
        "Preventive maintenance",
        "Emergency repairs",
        "Performance optimization",
        "Parts replacement",
        "System upgrades"
      ],
      process: [
        "Maintenance scheduling",
        "System inspection",
        "Performance analysis",
        "Corrective actions",
        "Reporting"
      ]
    },
    {
      id: "training",
      title: "Training & Consultation",
      description: "Comprehensive training programs for operators and maintenance staff.",
      icon: GraduationCap,
      color: "bg-orange-600",
      features: [
        "System operation training",
        "Maintenance procedures",
        "Troubleshooting guides",
        "Certification programs",
        "Best practices",
        "Ongoing consultation"
      ],
      process: [
        "Training needs assessment",
        "Customized curriculum",
        "Hands-on training",
        "Certification testing",
        "Ongoing support"
      ]
    },
    {
      id: "fertigation",
      title: "Fertigation Solutions",
      description: "Advanced nutrient delivery systems for optimized crop nutrition and growth.",
      icon: Leaf,
      color: "bg-emerald-600",
      features: [
        "Nutrient management plans",
        "Precise injection systems",
        "Monitoring and control",
        "Crop-specific programs",
        "Automation integration",
        "Performance tracking"
      ],
      process: [
        "Crop analysis",
        "Nutrient planning",
        "System design",
        "Installation",
        "Monitoring setup"
      ]
    },
    {
      id: "smart-tech",
      title: "Smart Technology Integration",
      description: "IoT-enabled irrigation systems with remote monitoring and automated controls.",
      icon: Zap,
      color: "bg-indigo-600",
      features: [
        "Weather integration",
        "Soil moisture sensors",
        "Mobile app control",
        "Data analytics",
        "Automated scheduling",
        "Remote diagnostics"
      ],
      process: [
        "Technology assessment",
        "System integration",
        "Sensor installation",
        "Software configuration",
        "User training"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 heading-primary">
            Comprehensive Irrigation Services
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From initial consultation to ongoing maintenance, we provide complete irrigation solutions 
            that ensure optimal performance and maximum returns on your investment
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {services.map((service) => (
            <Card key={service.id} className="h-full admin-card">
              <CardHeader>
                <div className={`w-16 h-16 ${service.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-center">{service.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-muted-foreground text-center">
                  {service.description}
                </p>
                
                <div>
                  <h4 className="font-semibold mb-3">Key Features:</h4>
                  <ul className="space-y-2">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-start space-x-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-3">Process:</h4>
                  <div className="space-y-2">
                    {service.process.map((step, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <Badge variant="outline" className="text-xs">
                          {index + 1}
                        </Badge>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <Link href={`/contact?service=${service.id}`}>
                  <Button className="w-full" variant="outline">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Service Packages */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Service Packages</h2>
            <p className="text-muted-foreground">
              Choose the package that best fits your needs and budget
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic Package */}
            <Card className="relative admin-card">
              <CardHeader className="text-center">
                <Badge className="mx-auto mb-4">Basic</Badge>
                <CardTitle className="text-2xl">Essential Services</CardTitle>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  From KSh 50,000
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Basic system design</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Professional installation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>System commissioning</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Basic training</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>6-month warranty</span>
                  </li>
                </ul>
                <Link href="/quote?package=basic">
                  <Button className="w-full mt-6" variant="outline">
                    Get Quote
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Premium Package */}
            <Card className="relative admin-card border-blue-600">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-blue-600 text-white">Most Popular</Badge>
              </div>
              <CardHeader className="text-center">
                <Badge className="mx-auto mb-4 bg-blue-100 text-blue-800">Premium</Badge>
                <CardTitle className="text-2xl">Complete Solution</CardTitle>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  From KSh 150,000
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Advanced system design</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Professional installation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Smart technology integration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Comprehensive training</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Fertigation system</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>12-month warranty</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Quarterly maintenance</span>
                  </li>
                </ul>
                <Link href="/quote?package=premium">
                  <Button className="w-full mt-6 bg-blue-600 hover:bg-blue-700">
                    Get Quote
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Enterprise Package */}
            <Card className="relative admin-card">
              <CardHeader className="text-center">
                <Badge className="mx-auto mb-4 bg-purple-100 text-purple-800">Enterprise</Badge>
                <CardTitle className="text-2xl">Enterprise Solution</CardTitle>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  Custom Pricing
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Custom system design</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Full project management</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Advanced automation</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Staff training program</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>24/7 support</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Extended warranty</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span>Dedicated account manager</span>
                  </li>
                </ul>
                <Link href="/contact?package=enterprise">
                  <Button className="w-full mt-6" variant="outline">
                    Contact Us
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto quote-form">
            <CardContent className="p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Get Started?
              </h3>
              <p className="mb-6">
                Contact our experts today for a free consultation and custom quote
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/quote">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Get Free Quote
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                    <Phone className="mr-2 h-5 w-5" />
                    Call Us Now
                  </Button>
                </Link>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <div className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+254 700 123 456</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>info@driptech.co.ke</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
