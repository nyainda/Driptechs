import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send,
  Building,
  Users,
  Headphones,
  MessageSquare
} from "lucide-react";

const contactSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactSchema>;

export default function Contact() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const createContactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      const response = await apiRequest("POST", "/api/contact", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent Successfully",
        description: "Thank you for contacting us. We'll get back to you within 24 hours.",
      });
      reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      await createContactMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Head Office",
      content: "Nairobi Industrial Area, Kenya",
      color: "text-blue-600"
    },
    {
      icon: Phone,
      title: "Phone",
      content: "+254 700 123 456",
      color: "text-green-600"
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@driptech.co.ke",
      color: "text-purple-600"
    },
    {
      icon: Clock,
      title: "Business Hours",
      content: "Mon-Fri: 8AM-5PM, Sat: 9AM-1PM",
      color: "text-orange-600"
    }
  ];

  const regionalOffices = [
    { city: "Nakuru", phone: "+254 705 987 654" },
    { city: "Eldoret", phone: "+254 708 456 789" },
    { city: "Mombasa", phone: "+254 702 321 654" },
    { city: "Kisumu", phone: "+254 701 234 567" }
  ];

  const departments = [
    {
      icon: MessageSquare,
      title: "General Inquiry",
      description: "General questions about our services",
      email: "info@driptech.co.ke"
    },
    {
      icon: Building,
      title: "Sales & Quotes",
      description: "Project quotes and sales inquiries",
      email: "sales@driptech.co.ke"
    },
    {
      icon: Headphones,
      title: "Technical Support",
      description: "Technical assistance and maintenance",
      email: "support@driptech.co.ke"
    },
    {
      icon: Users,
      title: "Partnerships",
      description: "Business partnerships and collaborations",
      email: "partnerships@driptech.co.ke"
    }
  ];

  return (
    <div className="min-h-screen bg-background py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 heading-primary">
            Get in Touch
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to transform your irrigation system? Contact our experts today 
            for professional consultation and support
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <Card className="admin-card">
            <CardHeader>
              <CardTitle className="text-2xl">Send us a Message</CardTitle>
              <p className="text-muted-foreground text-lg">
                Get in touch with our team for personalized assistance. We'll respond within 24 hours.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-sm font-medium">First Name *</Label>
                    <Input
                      id="firstName"
                      {...register("firstName", { required: "First name is required" })}
                      className="mt-1"
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-600 mt-1">{errors.firstName.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-sm font-medium">Last Name *</Label>
                    <Input
                      id="lastName"
                      {...register("lastName", { required: "Last name is required" })}
                      className="mt-1"
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-600 mt-1">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register("email", { 
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email"
                        }
                      })}
                      className="mt-1"
                      placeholder="your.email@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium">Phone Number</Label>
                    <Input
                      id="phone"
                      {...register("phone")}
                      className="mt-1"
                      placeholder="+254 700 000 000"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Optional - for faster response</p>
                  </div>
                </div>

                <div>
                  <Label htmlFor="subject" className="text-sm font-medium">Subject *</Label>
                  <Input
                    id="subject"
                    {...register("subject", { required: "Subject is required" })}
                    className="mt-1"
                    placeholder="What can we help you with?"
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-600 mt-1">{errors.subject.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium">Message *</Label>
                  <Textarea
                    id="message"
                    rows={6}
                    {...register("message", { 
                      required: "Message is required",
                      minLength: {
                        value: 10,
                        message: "Message must be at least 10 characters"
                      }
                    })}
                    className="mt-1"
                    placeholder="Please provide details about your irrigation needs, project scope, location, and any specific requirements..."
                  />
                  {errors.message && (
                    <p className="text-sm text-red-600 mt-1">{errors.message.message}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Minimum 10 characters. Include project details for better assistance.
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary"
                  size="lg"
                >
                  {isSubmitting ? (
                    <div className="loading-spinner mr-2" />
                  ) : (
                    <Send className="h-5 w-5 mr-2" />
                  )}
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            {/* Main Contact Info */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="text-2xl">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      info.color === "text-blue-600" ? "bg-blue-100 dark:bg-blue-900" :
                      info.color === "text-green-600" ? "bg-green-100 dark:bg-green-900" :
                      info.color === "text-purple-600" ? "bg-purple-100 dark:bg-purple-900" :
                      "bg-orange-100 dark:bg-orange-900"
                    }`}>
                      <info.icon className={`h-6 w-6 ${info.color}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{info.title}</h4>
                      <p className="text-muted-foreground">{info.content}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Regional Offices */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="text-xl">Regional Offices</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {regionalOffices.map((office, index) => (
                    <div key={index} className="space-y-1">
                      <h4 className="font-semibold">{office.city} Branch</h4>
                      <p className="text-sm text-muted-foreground">{office.phone}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Departments */}
            <Card className="admin-card">
              <CardHeader>
                <CardTitle className="text-xl">Department Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {departments.map((dept, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-green-600 rounded-full flex items-center justify-center">
                      <dept.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">{dept.title}</h4>
                      <p className="text-xs text-muted-foreground mb-1">{dept.description}</p>
                      <a 
                        href={`mailto:${dept.email}`}
                        className="text-xs text-blue-600 hover:text-blue-800"
                      >
                        {dept.email}
                      </a>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Map Section */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle className="text-2xl">Find Us</CardTitle>
            <p className="text-muted-foreground">
              Visit our head office in Nairobi Industrial Area
            </p>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Interactive map will be available soon
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Nairobi Industrial Area, Kenya
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}