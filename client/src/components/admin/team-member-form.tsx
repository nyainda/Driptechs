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
import type { TeamMember } from "@shared/schema.ts";

const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  position: z.string().min(1, "Position is required"),
  bio: z.string().min(1, "Bio is required"),
  photoUrl: z.string().url("Please enter a valid URL").optional().or(z.literal("")),
  email: z.string().email("Please enter a valid email").optional().or(z.literal("")),
  linkedin: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal("")),
  order: z.number().min(0, "Order must be a positive number").default(0),
  active: z.boolean().default(true),
});

type TeamMemberFormData = z.infer<typeof teamMemberSchema>;

interface TeamMemberFormProps {
  member?: TeamMember | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function TeamMemberForm({ member, onSuccess, onCancel }: TeamMemberFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<TeamMemberFormData>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: member?.name || "",
      position: member?.position || "",
      bio: member?.bio || "",
      photoUrl: member?.photoUrl || "",
      email: member?.email || "",
      linkedin: member?.linkedin || "",
      order: member?.order || 0,
      active: member?.active !== false,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: TeamMemberFormData) => {
      return await apiRequest("POST", "/api/admin/team", data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Team member created successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to create team member",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: TeamMemberFormData) => {
      return await apiRequest("PUT", `/api/admin/team/${member?.id}`, data);
    },
    onSuccess: () => {
      toast({ title: "Success", description: "Team member updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      onSuccess();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to update team member",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TeamMemberFormData) => {
    if (member) {
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
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="Enter full name"
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            {...form.register("position")}
            placeholder="Enter position/title"
          />
          {form.formState.errors.position && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.position.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            {...form.register("email")}
            placeholder="Enter email address"
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="linkedin">LinkedIn Profile</Label>
          <Input
            id="linkedin"
            {...form.register("linkedin")}
            placeholder="Enter LinkedIn URL"
          />
          {form.formState.errors.linkedin && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.linkedin.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="order">Display Order</Label>
          <Input
            id="order"
            type="number"
            {...form.register("order", { valueAsNumber: true })}
            placeholder="Enter display order (0 = first)"
          />
          {form.formState.errors.order && (
            <p className="text-sm text-red-500 mt-1">{form.formState.errors.order.message}</p>
          )}
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
        <Label htmlFor="bio">Biography</Label>
        <Textarea
          id="bio"
          {...form.register("bio")}
          placeholder="Enter team member biography"
          rows={4}
        />
        {form.formState.errors.bio && (
          <p className="text-sm text-red-500 mt-1">{form.formState.errors.bio.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
          {isLoading ? "Saving..." : member ? "Update Member" : "Create Member"}
        </Button>
      </div>
    </div>
  );
}