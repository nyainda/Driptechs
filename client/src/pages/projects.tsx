import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { MapPin, Calendar, DollarSign, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";
import type { Project } from "@shared/schema";

export default function Projects() {
  const { data: projects, isLoading, error } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "in_progress":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "planning":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const formatCurrency = (amount: string, currency: string) => {
    return `${currency} ${parseFloat(amount).toLocaleString()}`;
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <p className="text-red-500">Failed to load projects. Please try again.</p>
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
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 heading-primary">
            Success Stories
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Transforming agriculture across Kenya with innovative irrigation solutions. 
            See how we've helped farmers increase yields and conserve water.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
          <Card className="text-center admin-card">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-sm text-muted-foreground">Projects Completed</div>
            </CardContent>
          </Card>
          <Card className="text-center admin-card">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-green-600 mb-2">40%</div>
              <div className="text-sm text-muted-foreground">Average Water Savings</div>
            </CardContent>
          </Card>
          <Card className="text-center admin-card">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">25%</div>
              <div className="text-sm text-muted-foreground">Yield Increase</div>
            </CardContent>
          </Card>
          <Card className="text-center admin-card">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-sm text-muted-foreground">Customer Satisfaction</div>
            </CardContent>
          </Card>
        </div>

        {/* Projects Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-6 space-y-4">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : !projects || projects.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <p className="text-muted-foreground mb-4">
                No completed projects available at the moment.
              </p>
              <Link href="/contact">
                <Button>
                  Start Your Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {projects.map((project) => (
                <Card key={project.id} className="overflow-hidden admin-card">
                  <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                    {project.image_url ? (
                      <img
                        src={project.image_url}
                        alt={project.name || project.title}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }}
                      />
                    ) : null}
                    <div className={`w-full h-full flex items-center justify-center ${project.image_url ? 'hidden' : ''}`}>
                      <div className="text-center text-muted-foreground">
                        <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                        <p className="text-sm">No image available</p>
                      </div>
                    </div>
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Badge className={getStatusColor(project.status)}>
                          {project.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <CardTitle className="mt-2 text-xl">{project.title || project.name}</CardTitle>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          {project.value ? `KSh ${Number(project.value).toLocaleString()}` : 'Contact for pricing'}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    <div className="space-y-3 mb-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <span>{project.category || 'General'}</span>
                      </div>
                      {project.completion_date && (
                        <div className="flex items-center space-x-2 text-sm">
                          <Calendar className="h-4 w-4 text-purple-600" />
                          <span>Completed: {new Date(project.completion_date).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2 mb-4">
                      <h4 className="text-sm font-semibold">Status:</h4>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-sm capitalize">{project.status}</span>
                      </div>
                    </div>

                    <Link href={`/contact?project=${project.id}`}>
                      <Button variant="outline" className="w-full">
                        Similar Project
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <Card className="max-w-2xl mx-auto quote-form">
                <CardContent className="p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">
                    Ready to Start Your Project?
                  </h3>
                  <p className="mb-6">
                    Join hundreds of successful farmers who have transformed their irrigation systems
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/quote">
                      <Button size="lg" className="bg-green-600 hover:bg-green-700">
                        Get Free Quote
                      </Button>
                    </Link>
                    <Link href="/contact">
                      <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                        Discuss Your Needs
                      </Button>
                    </Link>
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