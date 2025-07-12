import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Droplets, Leaf, TrendingUp, CheckCircle, Wrench, Award, Phone, Mail, Calendar, User, BookOpen, Star, Package, Users, Trophy } from "lucide-react";
import { Link } from "wouter";
import type { Product, Project, BlogPost, TeamMember, SuccessStory } from "@shared/schema.ts";

// Helper component for a more advanced product card.
// The 'isFeatured' prop is no longer used in the main layout but kept for potential future use.
function PremierProductCard({ product, isFeatured = false }: { product: Product, isFeatured?: boolean }) {
  return (
    <Card className="group relative flex h-full w-full flex-col overflow-hidden rounded-lg border-2 shadow-md transition-all duration-300 hover:border-green-500 hover:shadow-2xl">
      <div className="relative h-48 overflow-hidden">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1593941707882-6e779f871f28?w=800&q=80'}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/20 transition-all duration-300 group-hover:bg-black/40"></div>
        <Badge className="absolute top-4 left-4 bg-green-600 text-white shadow-lg">Bestseller</Badge>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <CardHeader className="p-0">
          <CardTitle className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-green-700">{product.name}</CardTitle>
          <CardDescription className="line-clamp-3 text-base text-gray-600">{product.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex-grow p-0 pt-4">
          <div className="mb-4 space-y-2">
            <h4 className="font-semibold text-gray-700">Key Features:</h4>
            <ul className="list-inside list-disc space-y-1 text-sm text-gray-500">
                {/* This should be replaced with actual data if available */}
                <li>Automated watering schedules</li>
                <li>Durable, all-weather tubing</li>
                <li>Reduces water waste by 70%</li>
            </ul>
          </div>
           <div className="flex items-center mb-4">
            {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            ))}
            <span className="ml-2 text-sm text-gray-500">(50+ reviews)</span>
          </div>
        </CardContent>
        <div className="mt-auto pt-4">
          <Link href={`/products/${product.id}`}>
            <Button size="lg" className="w-full bg-green-600 text-base font-semibold text-white transition-transform group-hover:scale-105 group-hover:bg-green-700">
              View Details <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

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

  const { data: teamMembers } = useQuery<TeamMember[]>({
    queryKey: ["/api/team"],
    queryFn: () => fetch("/api/team").then(res => res.json()),
  });

  const { data: successStories } = useQuery<SuccessStory[]>({
    queryKey: ["/api/success-stories"],
    queryFn: () => fetch("/api/success-stories").then(res => res.json()),
  });

  // Data will be sliced inline for better error handling

  const displayProducts = products?.slice(0, 6) || [];
  const recentProjects = projects?.slice(0, 3) || [];
  const latestBlogPosts = blogPosts?.slice(0, 3) || [];

  return (
    <div className="flex flex-col">
      {/* Hero Section (Existing Code) */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1525498128493-380d1990a112?w=1600&h=900&fit=crop')",
          }}
        />
        <div className="relative container mx-auto px-4 py-24 lg:py-36 text-center">
          <Badge className="mb-4 bg-green-500 text-white">Innovate & Grow</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 leading-tight animate-fade-in-up">
            Next-Generation Irrigation for
            <span className="block text-green-400">Sustainable Agriculture</span>
          </h1>
          <p className="text-lg md:text-xl mb-10 text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Harnessing smart technology to optimize water usage, boost crop yields, and cultivate a greener future.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8 py-4 text-lg transform hover:scale-105 transition-transform">
                Request a Free Quote
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" variant="outline" className="border-gray-400 text-white hover:bg-white hover:text-gray-900 font-semibold px-8 py-4 text-lg">
                Explore Our Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section (Existing Code) */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why DripTech Leads the Field
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our commitment to innovation, quality, and customer success sets us apart.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Droplets className="h-8 w-8 text-blue-500" />, title: "Water Efficiency", description: "Utilize up to 60% less water, delivering precise hydration to your crops." },
              { icon: <TrendingUp className="h-8 w-8 text-green-500" />, title: "Increased Yields", description: "Boost productivity with optimized nutrient and water delivery." },
              { icon: <Wrench className="h-8 w-8 text-purple-500" />, title: "Expert Installation", description: "Seamless setup and ongoing support from our certified technicians." },
              { icon: <Award className="h-8 w-8 text-orange-500" />, title: "Durable Quality", description: "Constructed with premium, weather-resistant materials for long-term reliability." }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-800 hover:shadow-lg">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== UPDATED Premier Products Section ===== */}
      <section className="bg-gray-50 py-24 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <Package className="mx-auto mb-4 h-12 w-12 text-green-600" />
            <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-5xl">
              Our Premier Products
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600 dark:text-gray-300">
              Discover our market-leading irrigation solutions, engineered for maximum efficiency and robust performance.
            </p>
          </div>

          {products && displayProducts.length > 0 ? (
            // Switched to a responsive 3-column grid for a better layout with more products.
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {displayProducts.map((product) => (
                <PremierProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400">Loading premier products...</p>
            </div>
          )}

          <div className="mt-16 text-center">
            <Link href="/products">
              <Button size="lg" variant="outline" className="border-gray-400 px-8 py-3 text-gray-800 hover:bg-gray-200 dark:text-white dark:hover:bg-gray-700">
                Shop All Solutions
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
      {/* ===== END of updated section ===== */}

      {/* Recent Projects Section (Existing Code) */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Success in the Field
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Witness the transformative impact of our irrigation solutions on farms like yours.
            </p>
          </div>
          {recentProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {recentProjects.map((project) => (
                <Card key={project.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={project.images?.[0] || 'https://via.placeholder.com/400x225'}
                      alt={project.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <CardHeader>
                    <Badge className="w-fit mb-2 bg-blue-100 text-blue-800">{project.projectType}</Badge>
                    <CardTitle className="text-xl group-hover:text-blue-600">{project.name}</CardTitle>
                    <CardDescription>{project.location}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {project.description}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Area: {project.areaSize}</span>
                      <Badge variant={project.status === 'Completed' ? 'default' : 'secondary'} className={project.status === 'Completed' ? 'bg-green-500' : ''}>{project.status}</Badge>
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
          <div className="text-center mt-12">
            <Link href="/projects">
              <Button size="lg" variant="outline" className="border-gray-400 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 px-8 py-3">
                Explore More Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Success Stories Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Trophy className="mx-auto mb-4 h-12 w-12 text-green-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Success Stories
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Real results from farmers who transformed their operations with our irrigation solutions.
            </p>
          </div>
          {successStories && successStories.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {successStories.slice(0, 3).map((story) => (
                <Card key={story.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={story.photoUrl || 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&h=225&fit=crop'}
                      alt={story.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                      <Badge className="bg-green-100 text-green-800">{story.category}</Badge>
                      <span>{story.location}</span>
                    </div>
                    <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-green-600">{story.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{story.description}</p>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <User className="h-4 w-4 mr-1" />
                      <span>{story.clientName}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No success stories yet. Coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Team Members Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Users className="mx-auto mb-4 h-12 w-12 text-green-600" />
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Meet Our Expert Team
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Dedicated professionals committed to bringing you the best irrigation solutions.
            </p>
          </div>
          {teamMembers && teamMembers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {teamMembers.slice(0, 3).map((member) => (
                <Card key={member.id} className="text-center group hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full">
                      <img
                        src={member.photoUrl || `https://ui-avatars.com/api/?name=${member.name}&background=10b981&color=fff&size=96`}
                        alt={member.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <CardTitle className="text-lg mb-2 group-hover:text-green-600">{member.name}</CardTitle>
                    <p className="text-green-600 font-semibold mb-2">{member.position}</p>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{member.bio}</p>
                    <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
                      <Mail className="h-4 w-4 mr-1" />
                      <span>{member.email}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">Meet our team coming soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Latest Blog Posts Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              From Our Knowledge Hub
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get the latest insights, tips, and trends in modern agriculture and irrigation.
            </p>
          </div>
          {latestBlogPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {latestBlogPosts.map((post) => (
                <Card key={post.id} className="overflow-hidden group hover:shadow-xl transition-all duration-300">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={post.featuredImage || 'https://via.placeholder.com/400x225'}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-3 text-sm text-muted-foreground">
                      <Badge className="bg-green-100 text-green-800">{post.category}</Badge>
                      <span>{new Date(post.createdAt!).toLocaleDateString()}</span>
                    </div>
                    <CardTitle className="text-lg mb-2 line-clamp-2 group-hover:text-green-600">{post.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="text-green-600 font-semibold hover:underline">
                      Read More <ArrowRight className="inline-block h-4 w-4" />
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No articles yet. Stay tuned!</p>
            </div>
          )}
          <div className="text-center mt-12">
            <Link href="/blog">
              <Button size="lg" variant="outline" className="border-gray-400 text-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 px-8 py-3">
                Visit Our Blog
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section (Existing Code) */}
      <section className="py-24 bg-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Cultivate Success?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Let's discuss how our tailored irrigation solutions can elevate your farm's productivity and sustainability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/quote">
              <Button size="lg" className="bg-white text-green-700 hover:bg-gray-200 font-semibold px-8 py-4 text-lg">
                Get a Free Consultation
                <Phone className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-700 font-semibold px-8 py-4 text-lg">
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