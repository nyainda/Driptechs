import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Trophy, Plus, X } from "lucide-react";

const quickSuccessStorySchema = z.object({
  title: z.string().min(1, "Title is required"),
  client: z.string().min(1, "Client name is required"),
  projectType: z.string().min(1, "Project type is required"),
  location: z.string().min(1, "Location is required"),
  areaSize: z.string().min(1, "Area size is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  featured: z.boolean().default(false),
  completedDate: z.string().min(1, "Completion date is required"),
  waterSavings: z.string().optional(),
  yieldIncrease: z.string().optional(),
});

type QuickSuccessStoryData = z.infer<typeof quickSuccessStorySchema>;

interface QuickSuccessStoryProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function QuickSuccessStory({ onSuccess, onCancel }: QuickSuccessStoryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<QuickSuccessStoryData>({
    resolver: zodResolver(quickSuccessStorySchema),
    defaultValues: {
      featured: false,
      completedDate: new Date().toISOString().split('T')[0],
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: QuickSuccessStoryData) => {
      const storyData = {
        ...data,
        image: "/api/placeholder/400/300", // Default placeholder image
        active: true
      };
      
      const response = await apiRequest("POST", "/api/admin/success-stories", storyData);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success Story Created",
        description: "The success story has been created successfully.",
      });
      reset();
      setIsOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/success-stories"] });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create success story",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: QuickSuccessStoryData) => {
    createMutation.mutate(data);
  };

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
      >
        <Plus className="mr-2 h-4 w-4" />
        Quick Create Success Story
      </Button>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-t-lg">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Trophy className="mr-2 h-5 w-5" />
            Quick Create Success Story
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsOpen(false);
              onCancel?.();
            }}
            className="text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Project Title</Label>
              <Input
                id="title"
                {...register("title")}
                placeholder="Smart Irrigation Installation"
              />
              {errors.title && (
                <p className="text-sm text-red-500">{errors.title.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="client">Client Name</Label>
              <Input
                id="client"
                {...register("client")}
                placeholder="Green Valley Farms"
              />
              {errors.client && (
                <p className="text-sm text-red-500">{errors.client.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="projectType">Project Type</Label>
              <Input
                id="projectType"
                {...register("projectType")}
                placeholder="Drip Irrigation System"
              />
              {errors.projectType && (
                <p className="text-sm text-red-500">{errors.projectType.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                {...register("location")}
                placeholder="Nairobi, Kenya"
              />
              {errors.location && (
                <p className="text-sm text-red-500">{errors.location.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="areaSize">Area Size</Label>
              <Input
                id="areaSize"
                {...register("areaSize")}
                placeholder="5 hectares"
              />
              {errors.areaSize && (
                <p className="text-sm text-red-500">{errors.areaSize.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="completedDate">Completion Date</Label>
              <Input
                id="completedDate"
                type="date"
                {...register("completedDate")}
              />
              {errors.completedDate && (
                <p className="text-sm text-red-500">{errors.completedDate.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="waterSavings">Water Savings (Optional)</Label>
              <Input
                id="waterSavings"
                {...register("waterSavings")}
                placeholder="40%"
              />
            </div>

            <div>
              <Label htmlFor="yieldIncrease">Yield Increase (Optional)</Label>
              <Input
                id="yieldIncrease"
                {...register("yieldIncrease")}
                placeholder="25%"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Project Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Describe the project implementation and results..."
              className="min-h-[100px]"
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="featured"
              checked={watch("featured")}
              onCheckedChange={(checked) => setValue("featured", !!checked)}
            />
            <Label htmlFor="featured">Feature this story</Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              disabled={createMutation.isPending}
              className="flex-1"
            >
              {createMutation.isPending ? "Creating..." : "Create Story"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                onCancel?.();
              }}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}