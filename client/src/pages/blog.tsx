import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Search, Calendar, User, ArrowRight, BookOpen, TrendingUp, Sparkles, Eye } from "lucide-react";
import type { BlogPost } from "../../types/client-schema";

export default function Blog() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: posts, isLoading, error } = useQuery<BlogPost[]>({
    queryKey: ["/api/blog"],
  });

  const categories = [
    { value: "all", label: "All Posts" },
    { value: "technology", label: "Technology" },
    { value: "case-studies", label: "Case Studies" },
    { value: "tips", label: "Tips & Guides" },
    { value: "industry-news", label: "Industry News" },
    { value: "sustainability", label: "Sustainability" },
    { value: "innovation", label: "Innovation" },
  ];

  const filteredPosts = posts?.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  }) || [];

  const featuredPosts = posts?.slice(0, 3) || [];

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8 text-red-500 dark:text-red-400" />
              </div>
              <p className="text-red-600 dark:text-red-400 font-medium">Failed to load blog posts. Please try again.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-background py-20">
      {/* Animated background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.03),transparent_50%)] dark:bg-[radial-gradient(circle_at_20%_50%,rgba(120,119,198,0.1),transparent_50%)] animate-pulse"></div>
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.05),transparent_50%)] dark:bg-[radial-gradient(circle_at_80%_20%,rgba(34,197,94,0.15),transparent_50%)] animate-pulse delay-1000"></div>
        <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(circle_at_40%_80%,rgba(59,130,246,0.04),transparent_50%)] dark:bg-[radial-gradient(circle_at_40%_80%,rgba(59,130,246,0.12),transparent_50%)] animate-pulse delay-2000"></div>
      </div>

      <div className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          {/* Hero Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-700 dark:to-emerald-700 rounded-2xl mb-6 shadow-xl">
              <Sparkles className="h-10 w-10 text-white animate-pulse" />
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-blue-800 to-emerald-800 dark:from-slate-200 dark:via-blue-300 dark:to-emerald-300 bg-clip-text text-transparent leading-tight">
              Irrigation Insights & Updates
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Stay informed with the latest in irrigation technology, best practices, 
              and success stories from the field
            </p>
            <div className="mt-8 flex items-center justify-center gap-8 text-sm text-slate-500 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                <span>Updated Weekly</span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                <span>Expert Insights</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                <span>Industry Leading</span>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <Card className="mb-12 shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl text-slate-900 dark:text-slate-100">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-emerald-500 dark:from-blue-600 dark:to-emerald-600 rounded-lg flex items-center justify-center">
                  <Search className="h-4 w-4 text-white" />
                </div>
                Find Your Perfect Read
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="search" className="text-sm font-medium text-slate-700 dark:text-slate-300">Search Articles</Label>
                  <div className="relative group">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-slate-500 group-focus-within:text-blue-500 dark:group-focus-within:text-blue-400 transition-colors" />
                    <Input
                      id="search"
                      placeholder="Search articles..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-12 h-12 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 rounded-xl transition-all duration-200 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-12 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100">
                      {categories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Featured Posts */}
          {!isLoading && featuredPosts.length > 0 && (
            <section className="mb-20">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900 dark:to-orange-900 px-4 py-2 rounded-full mb-4">
                  <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm font-medium text-amber-800 dark:text-amber-200">Featured Content</span>
                </div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                  Must-Read Articles
                </h2>
                <p className="text-slate-600 dark:text-slate-300 text-lg">
                  Our most popular and impactful articles
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {featuredPosts.map((post, index) => (
                  <Card key={post.id} className="overflow-hidden shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 group">
                    {post.featuredImage && (
                      <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-4 left-4">
                          <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 dark:from-amber-500 dark:to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">{index + 1}</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-gradient-to-r from-blue-500 to-emerald-500 dark:from-blue-600 dark:to-emerald-600 text-white border-0 shadow-lg">
                          {post.category}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Sparkles className="h-3 w-3 text-amber-500 dark:text-amber-400" />
                          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Featured</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-slate-900 dark:text-slate-100">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(post.createdAt!).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          <span>DripTech Team</span>
                        </div>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <Button className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-700 dark:to-emerald-700 hover:from-blue-700 hover:to-emerald-700 dark:hover:from-blue-800 dark:hover:to-emerald-800 text-white border-0 shadow-lg h-12 rounded-xl group/btn">
                          Read More
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* All Posts */}
          <section>
            <div className="flex items-center justify-between mb-10">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-200 dark:to-slate-300 bg-clip-text text-transparent">
                {selectedCategory === "all" ? "All Articles" : 
                 categories.find(c => c.value === selectedCategory)?.label}
              </h2>
              <div className="flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <div className="w-2 h-2 bg-green-500 dark:bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {filteredPosts.length} article{filteredPosts.length !== 1 ? 's' : ''} found
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                    <Skeleton className="h-48 w-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900" />
                    <div className="p-6 space-y-4">
                      <Skeleton className="h-6 w-3/4 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800" />
                      <Skeleton className="h-4 w-1/2 bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800" />
                      <Skeleton className="h-12 w-full bg-gradient-to-r from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 rounded-xl" />
                    </div>
                  </Card>
                ))}
              </div>
            ) : filteredPosts.length === 0 ? (
              <Card className="text-center py-20 shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                <CardContent>
                  <div className="w-20 h-20 bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <BookOpen className="h-10 w-10 text-slate-400 dark:text-slate-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">
                    {posts?.length === 0 ? "Coming Soon!" : "No Matches Found"}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 mb-6 text-lg">
                    {posts?.length === 0 
                      ? "We're preparing amazing irrigation insights for you." 
                      : "Try adjusting your search criteria to find more articles."}
                  </p>
                  {posts?.length === 0 ? (
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-400 dark:text-slate-500">
                      <div className="w-2 h-2 bg-blue-400 dark:bg-blue-500 rounded-full animate-pulse"></div>
                      <span>Check back soon for irrigation insights and updates!</span>
                    </div>
                  ) : (
                    <Button
                      onClick={() => {
                        setSearchTerm("");
                        setSelectedCategory("all");
                      }}
                      className="bg-gradient-to-r from-blue-600 to-emerald-600 dark:from-blue-700 dark:to-emerald-700 hover:from-blue-700 hover:to-emerald-700 dark:hover:from-blue-800 dark:hover:to-emerald-800 text-white border-0 shadow-lg h-12 px-8 rounded-xl"
                    >
                      Clear All Filters
                    </Button>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post) => (
                  <Card key={post.id} className="overflow-hidden shadow-xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group">
                    {post.featuredImage && (
                      <div className="aspect-video w-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <Badge className="bg-gradient-to-r from-slate-500 to-slate-600 dark:from-slate-600 dark:to-slate-700 text-white border-0 shadow-md">
                          {post.category}
                        </Badge>
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex gap-1">
                            {post.tags.slice(0, 2).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <CardTitle className="text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-slate-900 dark:text-slate-100">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 line-clamp-3 leading-relaxed">
                        {post.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-6">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(post.createdAt!).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          <span>DripTech Team</span>
                        </div>
                      </div>
                      <Link href={`/blog/${post.slug}`}>
                        <Button variant="outline" className="w-full h-12 rounded-xl border-2 border-slate-200 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/50 transition-all duration-300 group/btn text-slate-900 dark:text-slate-100">
                          Read Article
                          <ArrowRight className="ml-2 h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Newsletter Signup */}
          <section className="mt-24">
            <Card className="max-w-4xl mx-auto shadow-2xl border-0 bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 dark:from-blue-800 dark:via-blue-900 dark:to-emerald-800 overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent_70%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15),transparent_70%)]"></div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.05),transparent_70%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.1),transparent_70%)]"></div>
              <CardContent className="p-12 text-white text-center relative z-10">
                <div className="w-20 h-20 bg-white/20 dark:bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <TrendingUp className="h-10 w-10 text-white animate-pulse" />
                </div>
                <h3 className="text-3xl font-bold mb-4">
                  Stay Ahead of the Curve
                </h3>
                <p className="text-xl mb-8 text-blue-100 dark:text-blue-200 max-w-2xl mx-auto leading-relaxed">
                  Subscribe to our newsletter for the latest irrigation insights, 
                  technology updates, and success stories delivered to your inbox
                </p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-white/20 dark:bg-white/10 border-white/30 dark:border-white/20 text-white placeholder-white/70 dark:placeholder-white/60 h-12 rounded-xl backdrop-blur-sm focus:bg-white/30 dark:focus:bg-white/20 focus:border-white/50 dark:focus:border-white/40 transition-all"
                  />
                  <Button className="bg-white dark:bg-slate-200 text-blue-600 dark:text-blue-800 hover:bg-blue-50 dark:hover:bg-slate-300 h-12 px-8 rounded-xl shadow-lg font-semibold">
                    Subscribe
                  </Button>
                </div>
                <div className="flex items-center justify-center gap-6 text-sm text-blue-100 dark:text-blue-200">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 dark:bg-green-500 rounded-full animate-pulse"></div>
                    <span>Weekly Updates</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-400 dark:bg-yellow-500 rounded-full animate-pulse delay-500"></div>
                    <span>Expert Tips</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pink-400 dark:bg-pink-500 rounded-full animate-pulse delay-1000"></div>
                    <span>No Spam</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}