import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { TeamMember } from "@shared/schema";
import { 
  Award, 
  Leaf, 
  Users, 
  Globe, 
  Target, 
  Eye, 
  Heart,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  Linkedin,
  MessageCircle
} from "lucide-react";

export default function About() {
  const values = [
    {
      icon: Target,
      title: "Excellence",
      description: "We strive for excellence in every project, delivering solutions that exceed expectations and industry standards."
    },
    {
      icon: Leaf,
      title: "Sustainability",
      description: "Environmental responsibility is at the core of our business, promoting water conservation and sustainable agriculture."
    },
    {
      icon: Heart,
      title: "Integrity",
      description: "We build trust through transparency, honesty, and ethical business practices in all our relationships."
    },
    {
      icon: Users,
      title: "Partnership",
      description: "We believe in long-term partnerships, working closely with our clients to achieve shared success."
    }
  ];

  const { data: team = [], isLoading: teamLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/team"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/team");
      return response.json();
    },
  });

  const certifications = [
    {
      title: "ISO 9001:2015",
      description: "Quality Management System",
      icon: Award
    },
    {
      title: "ISO 14001:2015",
      description: "Environmental Management",
      icon: Leaf
    },
    {
      title: "KEBS Certification",
      description: "Kenya Bureau of Standards",
      icon: CheckCircle
    },
    {
      title: "Water Sector Trust Fund",
      description: "Approved Contractor",
      icon: Globe
    }
  ];

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 heading-primary">
            About DripTech
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Leading Kenya's agricultural transformation through innovative irrigation solutions 
            and sustainable water management technologies
          </p>
        </div>

        {/* Mission, Vision, Values */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          <Card className="text-center admin-card">
            <CardHeader>
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Our Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To revolutionize agriculture in Kenya by providing innovative, efficient, and 
                sustainable irrigation solutions that empower farmers to maximize their yields 
                while conserving precious water resources.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center admin-card">
            <CardHeader>
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Our Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                To be East Africa's leading irrigation technology company, recognized for 
                our innovation, quality, and commitment to sustainable agricultural practices 
                that contribute to food security and economic growth.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center admin-card">
            <CardHeader>
              <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Our Values</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Excellence, sustainability, integrity, and partnership guide everything we do. 
                We believe in building lasting relationships and delivering solutions that 
                create value for our clients and society.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Company Story */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6 heading-secondary">
                Our Story
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2024, DripTech began as a forward-thinking irrigation consultancy with a 
                  vision to transform Kenyan agriculture through smart water management. 
                  Our founders, experienced agricultural engineers, recognized the critical 
                  need for efficient irrigation solutions in Kenya's diverse farming landscape.
                </p>
                <p>
                  Since our inception, we have quickly grown from a small team to a dedicated 
                  group of professionals, delivering innovative irrigation solutions across Kenya. 
                  Our success is built on a foundation of technical expertise, innovative solutions, 
                  and unwavering commitment to our clients' success.
                </p>
                <p>
                  Today, DripTech stands as Kenya's premier irrigation solutions provider, 
                  trusted by farmers, agribusinesses, and development organizations to deliver 
                  world-class irrigation systems that drive agricultural productivity and sustainability.
                </p>
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
                      <h3 className="text-xl font-bold">2024</h3>
                      <p className="text-muted-foreground">Company Founded</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Started with a vision to revolutionize irrigation in Kenya
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 heading-secondary">
              Our Core Values
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These values guide our decisions, shape our culture, and define how we interact 
              with our clients, partners, and communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center admin-card">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {value.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Leadership Team */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 heading-secondary">
              Our Leadership Team
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Meet the experienced professionals who lead DripTech's mission to transform 
              agriculture through innovative irrigation solutions
            </p>
          </div>

          {teamLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="text-center admin-card">
                  <CardHeader>
                    <div className="w-24 h-24 mx-auto mb-4 bg-gray-200 rounded-full animate-pulse" />
                    <div className="h-4 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-3 bg-gray-200 rounded animate-pulse mb-2" />
                    <div className="h-3 bg-gray-200 rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : team.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No team members yet</p>
              <p className="text-muted-foreground">
                Team members will appear here once they are added.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team
                .filter(member => member.active)
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((member, index) => (
                <Card key={member.id} className="text-center admin-card">
                  <CardHeader>
                    <div className="w-24 h-24 mx-auto mb-4 overflow-hidden rounded-full">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=96&background=2563eb&color=fff`;
                        }}
                      />
                    </div>
                    <CardTitle className="text-lg">{member.name}</CardTitle>
                    <p className="text-sm text-blue-600 font-medium">{member.position}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {member.bio}
                    </p>
                    <div className="flex justify-center space-x-3">
                      {member.email && (
                        <a
                          href={`mailto:${member.email}`}
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Mail className="h-4 w-4" />
                        </a>
                      )}
                      {member.linkedin && (
                        <a
                          href={member.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-700 transition-colors"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* Certifications */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4 heading-secondary">
              Certifications & Standards
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our commitment to quality and excellence is reflected in our industry 
              certifications and adherence to international standards
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {certifications.map((cert, index) => (
              <Card key={index} className="text-center admin-card">
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <cert.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-bold mb-2">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                  <Badge className="mt-3 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    Certified
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="text-center">
          <Card className="max-w-3xl mx-auto quote-form">
            <CardContent className="p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">
                Ready to Partner with Us?
              </h3>
              <p className="mb-6">
                Join hundreds of satisfied clients who trust DripTech for their irrigation needs
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/quote">
                  <Button size="lg" className="bg-green-600 hover:bg-green-700">
                    Get Started Today
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-blue-600">
                    <Phone className="mr-2 h-5 w-5" />
                    Contact Us
                  </Button>
                </Link>
              </div>
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 justify-items-center text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">+254 111 409 454</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">+254 114 575 401</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">driptechs.info@gmail.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4 flex-shrink-0" />
                  <a 
                    href="https://wa.me/254111409454" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="truncate hover:text-blue-300 transition-colors"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}