import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { getAuthToken, getUser } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Trophy, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Search,
  Star,
  Calendar
} from "lucide-react";
import { Link } from "wouter";

const successStorySchema = z.object({
  title: z.string().min(1, "Title is required"),
  client: z.string().min(1, "Client name is required"),
  description: z.string().min(1, "Description is required"),
  projectType: z.string().min(1, "Project type is required"),
  location: z.string().min(1, "Location is required"),
  areaSize: z.string().min(1, "Area size is required"),
  waterSavings: z.string().optional(),
  yieldIncrease: z.string().optional(),
  image: z.string().min(1, "Image URL is required"),
  completedDate: z.string().min(1, "Completion date is required").refine((date) => {
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return selectedDate <= today;
  }, "Completion date cannot be in the future"),
  featured: z.boolean().optional(),
  active: z.boolean().optional(),
});

type SuccessStory = {
  id: string;
  title: string;
  client: string;
  description: string;
  projectType: string;
  location: string;
  areaSize: string;
  waterSavings?: string;
  yieldIncrease?: string;
  image: string;
  completedDate: string;
  featured: boolean;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export default function AdminSuccessStories() {
  const [, setLocation] = useLocation();
  const token = getAuthToken();
  const user = getUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingStory, setEditingStory] = useState<SuccessStory | null>(null);

  // Redirect if not authenticated
  if (!token || !user) {
    setLocation("/admin");
    return null;
  }

  const { data: stories, isLoading } = useQuery<SuccessStory[]>({
    queryKey: ["/api/admin/success-stories"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/success-stories");
      if (!response.ok) {
        throw new Error("Failed to fetch success stories");
      }
      return response.json();
    },
    enabled: !!token,
  });

  const form = useForm({
    resolver: zodResolver(successStorySchema),
    defaultValues: {
      title: "",
      client: "",
      description: "",
      projectType: "",
      location: "",
      areaSize: "",
      waterSavings: "",
      yieldIncrease: "",
      image: "",
      completedDate: "",
      featured: false,
      active: true,
    },
  });

  useEffect(() => {
    if (editingStory) {
      form.reset({
        title: editingStory.title,
        client: editingStory.client,
        description: editingStory.description,
        projectType: editingStory.projectType,
        location: editingStory.location,
        areaSize: editingStory.areaSize,
        waterSavings: editingStory.waterSavings || "",
        yieldIncrease: editingStory.yieldIncrease || "",
        image: editingStory.image,
        completedDate: editingStory.completedDate,
        featured: editingStory.featured,
        active: editingStory.active,
      });
    } else {
      form.reset({
        title: "",
        client: "",
        description: "",
        projectType: "",
        location: "",
        areaSize: "",
        waterSavings: "",
        yieldIncrease: "",
        image: "",
        completedDate: "",
        featured: false,
        active: true,
      });
    }
  }, [editingStory, form]);

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/admin/success-stories", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/success-stories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/success-stories"] });
      setShowForm(false);
      setEditingStory(null);
      form.reset();
      toast({
        title: "Success Story Created",
        description: "Success story has been successfully added.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create success story. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      const response = await apiRequest("PUT", `/api/admin/success-stories/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/success-stories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/success-stories"] });
      setShowForm(false);
      setEditingStory(null);
      form.reset();
      toast({
        title: "Success Story Updated",
        description: "Success story has been successfully updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update success story. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/success-stories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/success-stories"] });
      queryClient.invalidateQueries({ queryKey: ["/api/success-stories"] });
      toast({
        title: "Success Story Deleted",
        description: "Success story has been successfully removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete success story. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredStories = stories?.filter((story) =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.location.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEdit = (story: SuccessStory) => {
    setEditingStory(story);
    setShowForm(true);
  };

  const handleDelete = (story: SuccessStory) => {
    if (window.confirm(`Are you sure you want to delete "${story.title}"?`)) {
      deleteMutation.mutate(story.id);
    }
  };

  const onSubmit = (data: any) => {
    const cleanData = {
      ...data,
      waterSavings: data.waterSavings || null,
      yieldIncrease: data.yieldIncrease || null,
    };

    if (editingStory) {
      updateMutation.mutate({ id: editingStory.id, data: cleanData });
    } else {
      createMutation.mutate(cleanData);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => setLocation("/admin/dashboard")}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Success Stories Management
              </h1>
            </div>
            <Button
              onClick={() => {
                setEditingStory(null);
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Story
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Stories</p>
                  <p className="text-3xl font-bold">{stories?.length || 0}</p>
                </div>
                <Trophy className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Featured Stories</p>
                  <p className="text-3xl font-bold">
                    {stories?.filter(s => s.featured).length || 0}
                  </p>
                </div>
                <Star className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Stories</p>
                  <p className="text-3xl font-bold">
                    {stories?.filter(s => s.active).length || 0}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <Card className="admin-card mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search success stories by title, client, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Stories List */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle>Success Stories ({filteredStories.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4">
                    <Skeleton className="h-20 w-32 rounded" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                      <Skeleton className="h-3 w-2/3" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : filteredStories.length === 0 ? (
              <div className="text-center py-12">
                <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {stories?.length === 0 ? "No success stories added yet." : "No stories found matching your search."}
                </p>
                <Button
                  onClick={() => {
                    setEditingStory(null);
                    setShowForm(true);
                  }}
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Story
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredStories.map((story) => (
                  <div key={story.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-4 flex-1">
                      <img
                        src={story.image}
                        alt={story.title}
                        className="h-20 w-32 object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = "https://via.placeholder.com/128x80?text=No+Image";
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{story.title}</h3>
                        <p className="text-sm text-blue-600 font-medium">{story.client}</p>
                        <p className="text-sm text-muted-foreground">
                          {story.projectType} • {story.location} • {story.areaSize}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge className={story.active ? 
                            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                          }>
                            {story.active ? "Active" : "Inactive"}
                          </Badge>
                          {story.featured && (
                            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                              Featured
                            </Badge>
                          )}
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(story.completedDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(story)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(story)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingStory ? "Edit Success Story" : "Add New Success Story"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  {...form.register("title")}
                  placeholder="Success story title"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="client">Client *</Label>
                <Input
                  id="client"
                  {...form.register("client")}
                  placeholder="Client name"
                />
                {form.formState.errors.client && (
                  <p className="text-sm text-red-600">{form.formState.errors.client.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                {...form.register("description")}
                placeholder="Detailed description of the project and its success"
                rows={4}
              />
              {form.formState.errors.description && (
                <p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="projectType">Project Type *</Label>
                <Input
                  id="projectType"
                  {...form.register("projectType")}
                  placeholder="e.g., Drip Irrigation, Greenhouse"
                />
                {form.formState.errors.projectType && (
                  <p className="text-sm text-red-600">{form.formState.errors.projectType.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  {...form.register("location")}
                  placeholder="Project location"
                />
                {form.formState.errors.location && (
                  <p className="text-sm text-red-600">{form.formState.errors.location.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="areaSize">Area Size *</Label>
                <Input
                  id="areaSize"
                  {...form.register("areaSize")}
                  placeholder="e.g., 5 acres"
                />
                {form.formState.errors.areaSize && (
                  <p className="text-sm text-red-600">{form.formState.errors.areaSize.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="waterSavings">Water Savings</Label>
                <Input
                  id="waterSavings"
                  {...form.register("waterSavings")}
                  placeholder="e.g., 40%"
                />
              </div>
              <div>
                <Label htmlFor="yieldIncrease">Yield Increase</Label>
                <Input
                  id="yieldIncrease"
                  {...form.register("yieldIncrease")}
                  placeholder="e.g., 60%"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="image">Image URL *</Label>
                <Input
                  id="image"
                  {...form.register("image")}
                  placeholder="https://example.com/image.jpg"
                />
                {form.formState.errors.image && (
                  <p className="text-sm text-red-600">{form.formState.errors.image.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="completedDate">Completion Date *</Label>
                <Input
                  id="completedDate"
                  type="date"
                  {...form.register("completedDate")}
                />
                {form.formState.errors.completedDate && (
                  <p className="text-sm text-red-600">{form.formState.errors.completedDate.message}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  {...form.register("featured")}
                />
                <Label htmlFor="featured">Featured Story</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  {...form.register("active")}
                />
                <Label htmlFor="active">Active</Label>
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {createMutation.isPending || updateMutation.isPending ? "Saving..." : 
                 editingStory ? "Update Story" : "Add Story"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}