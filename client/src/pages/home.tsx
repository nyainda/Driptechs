import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { Sprout, Play, Award, Leaf, Users, Globe, ArrowRight } from "lucide-react";
import ProductCard from "@/components/product-card";
import type { Product, Project } from "@shared/schema";

export default function Home() {
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const featuredProducts = products?.slice(0, 3) || [];
  const featuredProjects = projects?.slice(0, 3) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Hero Background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
            alt="Advanced irrigation systems in greenhouse"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>

        <div className="relative container mx-auto px-4 py-32">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 heading-primary">
              Advanced Irrigation Solutions for{" "}
              <span className="text-green-400">Modern Agriculture</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-200">
              Transforming farming with smart irrigation technology that saves water, 
              increases yields, and maximizes efficiency
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link href="/products">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                  <Sprout className="mr-2 h-5 w-5" />
                  Explore Solutions
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-black">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center stats-card rounded-lg p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">15+</div>
                <div className="text-gray-300">Years Experience</div>
              </div>
              <div className="text-center stats-card rounded-lg p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">500+</div>
                <div className="text-gray-300">Projects Completed</div>
              </div>
              <div className="text-center stats-card rounded-lg p-6">
                <div className="text-3xl font-bold text-green-400 mb-2">40%</div>
                <div className="text-gray-300">Water Savings</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 heading-secondary">
              Premium Irrigation Products
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover our comprehensive range of advanced irrigation solutions 
              designed for maximum efficiency and sustainability
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Link href="/products">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 heading-secondary">
              Comprehensive Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From initial consultation to ongoing maintenance, we provide complete irrigation solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center admin-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sprout className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">System Design</h3>
                <p className="text-muted-foreground mb-6">
                  Custom irrigation system design tailored to your specific crop requirements, 
                  soil conditions, and water sources
                </p>
                <Link href="/services#design">
                  <Button variant="outline">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center admin-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Installation</h3>
                <p className="text-muted-foreground mb-6">
                  Professional installation by certified technicians ensuring optimal 
                  performance and longevity
                </p>
                <Link href="/services#installation">
                  <Button variant="outline">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="text-center admin-card">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Maintenance</h3>
                <p className="text-muted-foreground mb-6">
                  Comprehensive maintenance programs to ensure your irrigation system 
                  operates at peak efficiency
                </p>
                <Link href="/services#maintenance">
                  <Button variant="outline">
                    Learn More
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-4xl font-bold mb-6 heading-secondary">
                  Leading Innovation in Irrigation Technology
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  With over 15 years of experience in the irrigation industry, DripTech has 
                  established itself as Kenya's premier irrigation solutions provider. We combine 
                  cutting-edge technology with deep agricultural expertise to deliver systems that 
                  maximize efficiency while minimizing environmental impact.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <Award className="text-green-600 h-5 w-5" />
                    <span>ISO 9001:2015 Certified Quality Management</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Leaf className="text-green-600 h-5 w-5" />
                    <span>Sustainable Agriculture Technology Solutions</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="text-green-600 h-5 w-5" />
                    <span>Expert Team of Agricultural Engineers</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Globe className="text-green-600 h-5 w-5" />
                    <span>International Standards & Best Practices</span>
                  </div>
                </div>
                <div className="flex space-x-4">
                  <Link href="/about">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      Our Story
                    </Button>
                  </Link>
                  <Link href="/about#certifications">
                    <Button variant="outline">
                      Certifications
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="space-y-6">
                <Card className="admin-card">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Performance Metrics</h3>
                        <p className="text-muted-foreground">Proven results across all projects</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">500+</div>
                        <div className="text-sm text-muted-foreground">Projects Completed</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">98%</div>
                        <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="admin-card">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                        <Leaf className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold">Water Efficiency</h3>
                        <p className="text-muted-foreground">Sustainable resource management</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">40%</div>
                        <div className="text-sm text-muted-foreground">Average Water Savings</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">25%</div>
                        <div className="text-sm text-muted-foreground">Yield Increase</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 quote-form">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-4xl font-bold mb-4">
              Ready to Transform Your Irrigation?
            </h2>
            <p className="text-xl mb-8">
              Get a professional consultation and custom quote for your irrigation needs
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/quote">
                <Button size="lg" className="bg-green-600 hover:bg-green-700">
                  Get Free Quote
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
