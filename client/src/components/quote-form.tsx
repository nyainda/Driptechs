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
import { Send, Upload } from "lucide-react";

const quoteSchema = z.object({
  customerName: z.string().min(2, "Name must be at least 2 characters"),
  customerEmail: z.string().email("Invalid email address"),
  customerPhone: z.string().min(10, "Phone number must be at least 10 characters"),
  projectType: z.string().min(1, "Project type is required"),
  areaSize: z.string().min(1, "Area size is required"),
  cropType: z.string().optional(),
  location: z.string().min(1, "Location is required"),
  waterSource: z.string().min(1, "Water source is required"),
  distanceToFarm: z.string().min(1, "Distance to farm is required"),
  numberOfBeds: z.number().min(1, "Number of beds is required for drip irrigation").optional(),
  soilType: z.string().optional(),
  budgetRange: z.string().optional(),
  timeline: z.string().optional(),
  requirements: z.string().optional(),
});

type QuoteFormData = z.infer<typeof quoteSchema>;

interface QuoteFormProps {
  productId?: string;
  onSuccess?: () => void;
}

export default function QuoteForm({ productId, onSuccess }: QuoteFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<QuoteFormData>({
    resolver: zodResolver(quoteSchema),
  });

  const createQuoteMutation = useMutation({
    mutationFn: async (data: QuoteFormData) => {
      const response = await apiRequest("POST", "/api/quotes", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Quote Sent Successfully!",
        description: "Your detailed quote has been sent to your email immediately. Check your inbox and spam folder.",
      });
      reset();
      onSuccess?.();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit quote request. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: QuoteFormData) => {
    setIsSubmitting(true);
    try {
      await createQuoteMutation.mutateAsync(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectType = watch("projectType");

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Get Your Custom Quote
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Professional irrigation system design and pricing tailored to your specific needs
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="projectType">Project Type *</Label>
              <Select
                onValueChange={(value) => setValue("projectType", value)}
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select project type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greenhouse">Greenhouse</SelectItem>
                  <SelectItem value="open_field">Open Field</SelectItem>
                  <SelectItem value="orchard">Orchard</SelectItem>
                  <SelectItem value="landscaping">Landscaping</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="residential">Residential</SelectItem>
                  <SelectItem value="system_design">System Design</SelectItem>
                  <SelectItem value="installation">Installation</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="training">Training</SelectItem>
                  <SelectItem value="consulting">Consulting</SelectItem>
                  <SelectItem value="support">Support</SelectItem>
                </SelectContent>
              </Select>
              {errors.projectType && (
                <p className="text-sm text-red-500">{errors.projectType.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="areaSize">Area Size *</Label>
              <Input
                id="areaSize"
                placeholder="e.g., 10 acres, 5 hectares"
                {...register("areaSize")}
              />
              {errors.areaSize && (
                <p className="text-sm text-red-500">{errors.areaSize.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="cropType">Crop Type</Label>
              <Input
                id="cropType"
                placeholder="e.g., Tomatoes, Maize, Flowers"
                {...register("cropType")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="County/Region"
                {...register("location")}
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="waterSource">Water Source *</Label>
              <Select
                onValueChange={(value) => setValue("waterSource", value)}
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select water source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="borehole">Borehole</SelectItem>
                  <SelectItem value="well">Well</SelectItem>
                  <SelectItem value="river">River</SelectItem>
                  <SelectItem value="dam">Dam</SelectItem>
                  <SelectItem value="municipal">Municipal Water</SelectItem>
                  <SelectItem value="rainwater">Rainwater Harvesting</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {errors.waterSource && (
                <p className="text-sm text-red-500">{errors.waterSource.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="distanceToFarm">Distance to Farm *</Label>
              <Input
                id="distanceToFarm"
                placeholder="e.g., 500 meters, 2 km"
                {...register("distanceToFarm")}
              />
              {errors.distanceToFarm && (
                <p className="text-sm text-red-500">{errors.distanceToFarm.message}</p>
              )}
            </div>
          </div>

          {projectType === "greenhouse" || projectType === "open_field" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="numberOfBeds">Number of Beds (for Drip Irrigation)</Label>
                <Input
                  id="numberOfBeds"
                  type="number"
                  min="1"
                  placeholder="e.g., 20"
                  {...register("numberOfBeds", { valueAsNumber: true })}
                />
                {errors.numberOfBeds && (
                  <p className="text-sm text-red-500">{errors.numberOfBeds.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="soilType">Soil Type</Label>
                <Select
                  onValueChange={(value) => setValue("soilType", value)}
                  defaultValue=""
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select soil type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="clay">Clay</SelectItem>
                    <SelectItem value="loam">Loam</SelectItem>
                    <SelectItem value="sand">Sandy</SelectItem>
                    <SelectItem value="silt">Silt</SelectItem>
                    <SelectItem value="mixed">Mixed</SelectItem>
                    <SelectItem value="unknown">Not Sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="budgetRange">Budget Range (Optional)</Label>
              <Select
                onValueChange={(value) => setValue("budgetRange", value)}
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under_100k">Under KSh 100,000</SelectItem>
                  <SelectItem value="100k_500k">KSh 100,000 - 500,000</SelectItem>
                  <SelectItem value="500k_1m">KSh 500,000 - 1,000,000</SelectItem>
                  <SelectItem value="1m_5m">KSh 1,000,000 - 5,000,000</SelectItem>
                  <SelectItem value="over_5m">Over KSh 5,000,000</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timeline">Project Timeline</Label>
              <Select
                onValueChange={(value) => setValue("timeline", value)}
                defaultValue=""
              >
                <SelectTrigger>
                  <SelectValue placeholder="When do you need this?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">As soon as possible</SelectItem>
                  <SelectItem value="1_month">Within 1 month</SelectItem>
                  <SelectItem value="3_months">Within 3 months</SelectItem>
                  <SelectItem value="6_months">Within 6 months</SelectItem>
                  <SelectItem value="flexible">Timeline is flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="customerName">Full Name *</Label>
              <Input
                id="customerName"
                placeholder="Your full name"
                {...register("customerName")}
              />
              {errors.customerName && (
                <p className="text-sm text-red-500">{errors.customerName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerPhone">Phone Number *</Label>
              <Input
                id="customerPhone"
                type="tel"
                placeholder="+254 700 123 456"
                {...register("customerPhone")}
              />
              {errors.customerPhone && (
                <p className="text-sm text-red-500">{errors.customerPhone.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="customerEmail">Email Address *</Label>
            <Input
              id="customerEmail"
              type="email"
              placeholder="your@email.com"
              {...register("customerEmail")}
            />
            {errors.customerEmail && (
              <p className="text-sm text-red-500">{errors.customerEmail.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="requirements">Additional Requirements</Label>
            <Textarea
              id="requirements"
              rows={4}
              placeholder="Tell us about your specific needs, water source, terrain, budget range, etc."
              {...register("requirements")}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <div className="loading-spinner mr-2" />
              ) : (
                <Send className="h-4 w-4 mr-2" />
              )}
              {isSubmitting ? "Submitting..." : "Get Quote"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => {
                // TODO: Implement file upload for site plans
                toast({
                  title: "Coming Soon",
                  description: "File upload feature will be available soon.",
                });
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Upload Site Plans
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}