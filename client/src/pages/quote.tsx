import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import QuoteForm from "@/components/quote-form";
import { Calculator, FileText, Download, Lightbulb, Phone, Mail } from "lucide-react";

export default function Quote() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const productId = searchParams.get('product');
  const packageType = searchParams.get('package');

  const [activeTab, setActiveTab] = useState("form");

  const benefits = [
    {
      icon: Calculator,
      title: "Accurate Pricing",
      description: "Detailed cost breakdown with no hidden fees"
    },
    {
      icon: FileText,
      title: "Professional Documentation",
      description: "Comprehensive quote with technical specifications"
    },
    {
      icon: Download,
      title: "Instant PDF Download",
      description: "Get your quote document immediately"
    },
    {
      icon: Lightbulb,
      title: "Expert Recommendations",
      description: "Customized solutions for your specific needs"
    }
  ];

  const packages = [
    {
      name: "Basic Package",
      price: "From KSh 50,000",
      description: "Essential irrigation system for small farms",
      features: [
        "Basic system design",
        "Standard installation",
        "6-month warranty",
        "Basic training",
        "Email support"
      ],
      badge: null
    },
    {
      name: "Premium Package",
      price: "From KSh 150,000",
      description: "Complete solution for commercial operations",
      features: [
        "Advanced system design",
        "Professional installation",
        "Smart technology integration",
        "12-month warranty",
        "Comprehensive training",
        "Priority support"
      ],
      badge: "Most Popular"
    },
    {
      name: "Enterprise Package",
      price: "Custom Pricing",
      description: "Large-scale solutions for industrial applications",
      features: [
        "Custom system design",
        "Full project management",
        "Advanced automation",
        "Extended warranty",
        "Staff training program",
        "24/7 dedicated support"
      ],
      badge: null
    }
  ];

  const faqs = [
    {
      question: "How long does it take to receive a quote?",
      answer: "You'll receive an initial quote within 24 hours. For complex projects requiring site visits, detailed quotes are provided within 3-5 business days."
    },
    {
      question: "Is the quote legally binding?",
      answer: "Our quotes are valid for 30 days and serve as the basis for our service agreement. Final contracts include detailed terms and conditions."
    },
    {
      question: "What information do you need for an accurate quote?",
      answer: "We need project type, area size, crop type, location, water source details, and any specific requirements. Site plans or photos are helpful but not required."
    },
    {
      question: "Do you offer financing options?",
      answer: "Yes, we offer flexible payment plans and can connect you with agricultural financing partners. Discuss options during your consultation."
    },
    {
      question: "What's included in the installation service?",
      answer: "Installation includes equipment delivery, system setup, testing, commissioning, basic training, and warranty activation."
    }
  ];

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 heading-primary">Get Your Custom Quote</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional irrigation system design and pricing tailored to your specific needs. Get started with our free consultation and detailed quote.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center admin-card">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <benefit.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="form">Quote Request</TabsTrigger>
            <TabsTrigger value="packages">Service Packages</TabsTrigger>
            <TabsTrigger value="calculator">Quick Calculator</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="space-y-8">
            <QuoteForm 
              productId={productId || undefined}
              onSuccess={() => {}}
            />
          </TabsContent>

          <TabsContent value="packages" className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Choose Your Package</h2>
              <p className="text-muted-foreground">Select the service package that best fits your needs and budget</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {packages.map((pkg, index) => (
                <Card key={index} className={`relative admin-card ${pkg.badge ? 'border-blue-600' : ''}`}>
                  {pkg.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-blue-600 text-white">{pkg.badge}</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{pkg.name}</CardTitle>
                    <p className="text-2xl font-bold text-blue-600">{pkg.price}</p>
                    <p className="text-sm text-muted-foreground">{pkg.description}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {pkg.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center space-x-2 text-sm">
                          <div className="w-2 h-2 bg-green-600 rounded-full" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className={`w-full ${pkg.badge ? 'btn-primary' : ''}`} variant={pkg.badge ? 'default' : 'outline'} onClick={() => setActiveTab("form")}>Get Quote</Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calculator" className="space-y-8">
            <Card className="max-w-2xl mx-auto admin-card">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Quick Cost Calculator</CardTitle>
                <p className="text-center text-muted-foreground">Get an instant estimate for your irrigation project</p>
              </CardHeader>
              <CardContent className="text-center py-16">
                <Calculator className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-4">Calculator Coming Soon</h3>
                <p className="text-muted-foreground mb-6">Our interactive cost calculator is under development. For now, please use our quote form for accurate pricing.</p>
                <Button onClick={() => setActiveTab("form")} className="btn-primary">Request Detailed Quote</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <section className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 heading-secondary">Frequently Asked Questions</h2>
            <p className="text-muted-foreground">Common questions about our quoting process and services</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Card key={index} className="admin-card">
                <CardHeader>
                  <CardTitle className="text-lg">{faq.question}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <Card className="max-w-2xl mx-auto quote-form">
            <CardContent className="p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">Need Help with Your Quote?</h3>
              <p className="mb-6">Our irrigation experts are here to help you choose the right solution</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={() => window.open('tel:+254111409454')}>
                  <Phone className="mr-2 h-5 w-5" /> Call Now
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600" onClick={() => window.open('mailto:driptechs.info@gmail.com')}>
                  <Mail className="mr-2 h-5 w-5" /> Email Us
                </Button>
              </div>
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center text-sm">
                <div className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+254 111 409 454</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Phone className="h-4 w-4" />
                  <span>+254 114 575 401</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>driptechs.info@gmail.com</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  💬 <a href="https://wa.me/254111409454" target="_blank" rel="noopener noreferrer" className="underline">Chat on WhatsApp</a>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
}
