import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { MapPin, Calendar, DollarSign, TrendingUp, CheckCircle, ArrowRight, Droplets, Leaf, Award, Users } from "lucide-react";
import type { Project } from "@shared/schema";

export default function Projects() {
  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:border-emerald-800";
      case "in_progress":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
      case "planning":
        return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800";
    }
  };

  const formatCurrency = (amount: string, currency: string) => {
    return `${currency} ${parseFloat(amount).toLocaleString()}`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto shadow-xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-red-500 rounded-full"></div>
              </div>
              <p className="text-red-600 dark:text-red-400 font-medium">Failed to load projects. Please try again.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
   <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Award className="w-4 h-4" />
            Proven Results
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-green-600 to-blue-800 bg-clip-text text-transparent leading-tight">
            Success Stories
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Transforming agriculture across Kenya with innovative irrigation solutions. 
            See how we've helped farmers increase yields and conserve water.
          </p>
        </div>

        {/* Enhanced Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-20">
          <Card className="group relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-transparent"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>
              <div className="text-4xl font-bold mb-2">500+</div>
              <div className="text-blue-100 font-medium">Projects Completed</div>
            </CardContent>
          </Card>
          
          <Card className="group relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-transparent"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Droplets className="w-6 h-6" />
                </div>
              </div>
              <div className="text-4xl font-bold mb-2">40%</div>
              <div className="text-green-100 font-medium">Average Water Savings</div>
            </CardContent>
          </Card>
          
          <Card className="group relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-transparent"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <div className="text-4xl font-bold mb-2">25%</div>
              <div className="text-purple-100 font-medium">Yield Increase</div>
            </CardContent>
          </Card>
          
          <Card className="group relative overflow-hidden border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 to-transparent"></div>
            <CardContent className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Users className="w-6 h-6" />
                </div>
              </div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-orange-100 font-medium">Customer Satisfaction</div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden border-0 shadow-lg bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm">
                <Skeleton className="h-64 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : !projects || projects.length === 0 ? (
          <Card className="text-center py-20 border-0 shadow-xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardContent>
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900/30 dark:to-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-12 h-12 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                Ready to Showcase Amazing Projects
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                No completed projects available at the moment. Be the first to start an innovative irrigation project!
              </p>
              <Link href="/contact">
                <Button size="lg" className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                  <Leaf className="w-5 h-5 mr-2" />
                  Start Your Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
              {projects.map((project) => (
                <Card key={project.id} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
                  <CardContent className="p-0">
                    {project.images && project.images.length > 0 && (
                      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">
                        <img
                          src={project.images[0]}
                          alt={project.name}
                          className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="absolute top-4 right-4">
                          <Badge className={`${getStatusColor(project.status)} shadow-lg font-medium border`}>
                            {project.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                            {project.status === 'in_progress' && <TrendingUp className="w-3 h-3 mr-1" />}
                            {project.status === 'planning' && <Calendar className="w-3 h-3 mr-1" />}
                            {project.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                          {project.name}
                        </h3>
                      </div>
                      
                      {/* Additional Project Info */}
                      {project.projectType && (
                        <div className="mb-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {project.projectType}
                          </span>
                        </div>
                      )}
                      
                      {project.areaSize && (
                        <div className="flex items-center text-gray-600 dark:text-gray-400 mb-3">
                          <div className="w-4 h-4 mr-2 text-green-500">
                            <svg viewBox="0 0 24 24" fill="currentColor">
                              <path d="M3 3h18v18H3V3zm2 2v14h14V5H5z"/>
                            </svg>
                          </div>
                          <span className="text-sm">{project.areaSize}</span>
                        </div>
                      )}
                      <div className="space-y-3">
                        {project.location && (
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                            <span className="text-sm">{project.location}</span>
                          </div>
                        )}
                        
                        {project.endDate && (
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <Calendar className="w-4 h-4 mr-2 text-green-500" />
                            <span className="text-sm">{new Date(project.endDate).toLocaleDateString()}</span>
                          </div>
                        )}
                        
                        {project.value && project.currency && (
                          <div className="flex items-center text-gray-600 dark:text-gray-400">
                            <DollarSign className="w-4 h-4 mr-2 text-purple-500" />
                            <span className="text-sm font-medium">{formatCurrency(project.value, project.currency)}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Benefits/Tags */}
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300">
                            <Droplets className="w-3 h-3 mr-1" />
                            Water Efficient
                          </Badge>
                          <Badge variant="outline" className="text-xs bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300">
                            <Leaf className="w-3 h-3 mr-1" />
                            Eco-Friendly
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Enhanced Call to Action */}
            <div className="text-center">
              <Card className="max-w-4xl mx-auto border-0 shadow-2xl bg-gradient-to-r from-blue-600 via-green-600 to-blue-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-green-600/20 to-blue-700/20"></div>
                <div className="absolute top-0 left-0 w-full h-full opacity-30">
                  <div className="w-full h-full bg-white/5 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
                </div>
                <CardContent className="p-12 text-center relative z-10">
                  <div className="max-w-2xl mx-auto">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium mb-6">
                      <Award className="w-4 h-4" />
                      Join Our Success Stories
                    </div>
                    <h3 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
                      Ready to Transform Your Farm?
                    </h3>
                    <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                      Join hundreds of successful farmers who have revolutionized their irrigation systems with our cutting-edge solutions
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Link href="/quote">
                        <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                          <TrendingUp className="w-5 h-5 mr-2" />
                          Get Free Quote
                        </Button>
                      </Link>
                      <Link href="/contact">
                        <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                          <ArrowRight className="w-5 h-5 mr-2" />
                          Discuss Your Needs
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}