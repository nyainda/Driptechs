import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { SuccessStory } from "../../types/schema";

const successStorySchema = z.object({
  title: z.string().min(1, "Title is required"),
  clientName: z.string().min(1, "Client name is required"),
  description: z.string().min(1, "Description is required"),
  category: z.string().min(1, "Category is required"),
  location: z.string().min(1, "Location is required"),
  areaSize: z.string().min(1, "Area size is required"),
  waterSavings: z.string().optional(),
  yieldIncrease: z.string().optional(),
  photoUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  completedDate: z.string().min(1, "Completed date is required"),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
});

type SuccessStoryFormData = z.infer<typeof successStorySchema>;

interface SuccessStoryFormProps {
  story?: SuccessStory | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function SuccessStoryForm({ story, onSuccess, onCancel }: SuccessStoryFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SuccessStoryFormData>({
    resolver: zodResolver(successStorySchema),
    defaultValues: {
      title: story?.title || "",
      clientName: story?.clientName || "",
      description: story?.description || "",
      category: story?.category || "Agriculture",
      location: story?.location || "",
      areaSize: story?.areaSize || "",
      waterSavings: story?.waterSavings || "",
      yieldIncrease: story?.yieldIncrease || "",
      photoUrl: story?.photoUrl || "",
      completedDate: story?.completedDate || "",
      featured: story?.featured || false,
      active: story?.active !== false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: SuccessStoryFormData) => {
      return await apiRequest("POST", "/api/admin/success-stories", data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Success story created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/success-stories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/success-stories"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create success story",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: SuccessStoryFormData) => {
      return await apiRequest("PUT", `/api/admin/success-stories/${story?.id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Success story updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/success-stories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/success-stories"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update success story",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SuccessStoryFormData) => {
    if (story) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            {...form.register("title")}
            placeholder="Enter success story title"
          />
          {form.formState.errors.title && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.title.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="clientName">Client Name</Label>
          <Input
            id="clientName"
            {...form.register("clientName")}
            placeholder="Enter client name"
          />
          {form.formState.errors.clientName && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.clientName.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="category">Category</Label>
          <Input
            id="category"
            {...form.register("category")}
            placeholder="Enter category (e.g., Agriculture, Horticulture)"
          />
          {form.formState.errors.category && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.category.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...form.register("location")}
            placeholder="Enter project location"
          />
          {form.formState.errors.location && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.location.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="areaSize">Area Size</Label>
          <Input
            id="areaSize"
            {...form.register("areaSize")}
            placeholder="Enter area size (e.g., 10 hectares)"
          />
          {form.formState.errors.areaSize && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.areaSize.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="completedDate">Completed Date</Label>
          <Input
            id="completedDate"
            {...form.register("completedDate")}
            placeholder="Enter completion date"
          />
          {form.formState.errors.completedDate && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.completedDate.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="waterSavings">Water Savings (Optional)</Label>
          <Input
            id="waterSavings"
            {...form.register("waterSavings")}
            placeholder="Enter water savings (e.g., 40%)"
          />
        </div>

        <div>
          <Label htmlFor="yieldIncrease">Yield Increase (Optional)</Label>
          <Input
            id="yieldIncrease"
            {...form.register("yieldIncrease")}
            placeholder="Enter yield increase (e.g., 30%)"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="photoUrl">Photo URL</Label>
        <Input
          id="photoUrl"
          {...form.register("photoUrl")}
          placeholder="Enter photo URL (e.g., https://example.com/photo.jpg)"
        />
        {form.formState.errors.photoUrl && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.photoUrl.message}</p>
        )}
        <p className="text-sm text-gray-500 mt-1">
          Enter a direct URL to the photo. You can use services like Unsplash, Pixabay, or upload to your own server.
        </p>
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...form.register("description")}
          placeholder="Enter detailed description of the success story"
          rows={4}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.description.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="featured"
            checked={form.watch("featured")}
            onCheckedChange={(checked) => form.setValue("featured", checked as boolean)}
          />
          <Label htmlFor="featured">Featured Story</Label>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="active"
            checked={form.watch("active")}
            onCheckedChange={(checked) => form.setValue("active", checked as boolean)}
          />
          <Label htmlFor="active">Active</Label>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
          {isLoading ? "Saving..." : story ? "Update Story" : "Create Story"}
        </Button>
      </div>
    </div>
  );
}