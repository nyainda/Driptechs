import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/product-card";
import { ArrowRight, Droplets, Leaf, TrendingUp, CheckCircle, Wrench, Award, Phone, Mail, Calendar, User, BookOpen } from "lucide-react";
import { Link } from "wouter";
import type { Product, Project, BlogPost } from "@shared/schema";

export default function Home() {
  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: () => fetch("/api/products").then(res => res.json()),
  });

  const { data: projects } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
    queryFn: () => fetch("/api/projects").then(res => res.json()),
  });

  const { data: blogPosts } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
    queryFn: () => fetch("/api/blog").then(res => res.json()),
  });

  const featuredProducts = products?.slice(0, 3) || [];
  const recentProjects = projects?.slice(0, 3) || [];
  const latestBlogPosts = blogPosts?.slice(0, 3) || [];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 dark:from-blue-950 dark:via-blue-900 dark:to-blue-800 text-white">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1525498128493-380d1990a112?w=1600&h=900&fit=crop')",
          }}
        />
        <div className="absolute inset-0 bg-blue-900/80 dark:bg-blue-950/85"></div>
        <div className="relative container mx-auto px-4 py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Revolutionary Irrigation Solutions for
              <span className="text-blue-300 block">Modern Agriculture</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 leading-relaxed">
              Transform your farming with our advanced drip irrigation technology. 
              Save water, increase yields, and build sustainable agricultural practices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/quote">
                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg">
                  Get Free Quote
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/products">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 text-lg">
                  View Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose DripTech Irrigation?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We combine cutting-edge technology with proven agricultural expertise to deliver irrigation solutions that work.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Droplets className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl mb-2">Water Efficiency</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Save up to 60% water compared to traditional irrigation methods while maximizing crop yields.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl mb-2">Proven Results</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Over 500 successful installations across Kenya with measurable productivity improvements.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Wrench className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl mb-2">Expert Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Professional installation, maintenance, and ongoing technical support from our certified team.</p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl mb-2">Quality Guarantee</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">Premium materials and components backed by comprehensive warranties and quality assurance.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Discover our most popular irrigation solutions designed for efficiency and reliability.
            </p>
          </div>

          {featuredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">Loading featured products...</p>
            </div>
          )}

          <div className="text-center">
            <Link href="/products">
              <Button size="lg" variant="outline" className="px-8 py-3">
                View All Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Projects */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Recent Projects
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See how we've helped farmers transform their agricultural operations.
            </p>
          </div>

          {recentProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {recentProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {project.images && project.images.length > 0 && (
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={project.images[0]}
                        alt={project.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <Badge className="w-fit mb-2">{project.projectType}</Badge>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription>{project.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Area Size: {project.areaSize}</span>
                      <Badge variant="secondary">{project.status}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading recent projects...</p>
            </div>
          )}

          <div className="text-center">
            <Link href="/projects">
              <Button size="lg" variant="outline" className="px-8 py-3">
                View All Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Latest Insights & Updates
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Stay informed with the latest irrigation technology insights, tips, and success stories.
            </p>
          </div>

          {latestBlogPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {latestBlogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  {post.featuredImage && (
                    <div className="aspect-video overflow-hidden bg-gray-100 dark:bg-gray-800">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between mb-3">
                      <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-sm">
                        {post.category}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(post.createdAt!).toLocaleDateString()}
                      </div>
                    </div>
                    <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                    
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {post.tags.slice(0, 2).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <User className="h-3 w-3 mr-1" />
                        <span>DripTech Team</span>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="ghost" size="sm" className="group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                          Read More
                          <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No blog posts available yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Check back soon for irrigation insights and updates!</p>
            </div>
          )}

          <div className="text-center">
            <Link href="/blog">
              <Button size="lg" variant="outline" className="px-8 py-3 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors">
                View All Articles
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Transform Your Farm?
          </h2>
          <p className="text-xl mb-8 text-blue-100 max-w-2xl mx-auto">
            Get a customized irrigation solution designed specifically for your farm's needs. 
            Our experts are ready to help you increase productivity and save water.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/quote">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 px-8 py-3 text-lg">
                Get Free Consultation
                <Phone className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-900 px-8 py-3 text-lg">
                Contact Us
                <Mail className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}