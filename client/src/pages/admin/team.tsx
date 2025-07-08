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
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  ArrowLeft,
  Search,
  Mail,
  Linkedin
} from "lucide-react";

// Define TeamMember type to match backend schema
export type TeamMember = {
  id: string;
  name: string;
  position: string;
  bio: string;
  image: string;
  email: string | null;
  linkedin: string | null;
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

// Zod schema aligned with backend pgTable schema
const teamMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  position: z.string().min(1, "Position is required"),
  bio: z.string().min(1, "Bio is required"),
  image: z.string().min(1, "Image URL is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  linkedin: z.string().optional().refine(
    (val) => !val || /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9\-_]+\/?$/.test(val),
    { message: "Invalid LinkedIn URL. Must be like https://www.linkedin.com/in/username" }
  ),
  order: z.number().int().min(0).default(0),
  active: z.boolean().default(true),
});

export default function AdminTeam() {
  const [, setLocation] = useLocation();
  const token = getAuthToken();
  const user = getUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Redirect if not authenticated
  if (!token || !user) {
    setLocation("/admin");
    return null;
  }

  const { data: teamMembers = [], isLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/admin/team"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/admin/team");
      if (!response.ok) {
        throw new Error("Failed to fetch team members");
      }
      return response.json();
    },
    enabled: !!token,
  });

  const form = useForm<z.infer<typeof teamMemberSchema>>({
    resolver: zodResolver(teamMemberSchema),
    defaultValues: {
      name: "",
      position: "",
      bio: "",
      image: "",
      email: undefined,
      linkedin: undefined,
      order: 0,
      active: true,
    },
  });

  useEffect(() => {
    if (editingMember) {
      form.reset({
        name: editingMember.name || "",
        position: editingMember.position || "",
        bio: editingMember.bio || "",
        image: editingMember.image || "",
        email: editingMember.email || undefined,
        linkedin: editingMember.linkedin || undefined,
        order: editingMember.order ?? 0,
        active: editingMember.active ?? true,
      });
    } else {
      form.reset({
        name: "",
        position: "",
        bio: "",
        image: "",
        email: undefined,
        linkedin: undefined,
        order: 0,
        active: true,
      });
    }
  }, [editingMember, form]);

  const createMutation = useMutation({
    mutationFn: async (data: z.infer<typeof teamMemberSchema>) => {
      console.log("Submitting data:", data); // Debug log
      const response = await apiRequest("POST", "/api/admin/team", data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create team member");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      setShowForm(false);
      setEditingMember(null);
      form.reset();
      toast({
        title: "Team Member Created",
        description: "Team member has been successfully added.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create team member. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: z.infer<typeof teamMemberSchema> }) => {
      console.log("Updating data:", data); // Debug log
      const response = await apiRequest("PUT", `/api/admin/team/${id}`, data);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update team member");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      setShowForm(false);
      setEditingMember(null);
      form.reset();
      toast({
        title: "Team Member Updated",
        description: "Team member has been successfully updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update team member. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/admin/team/${id}`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete team member");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team"] });
      queryClient.invalidateQueries({ queryKey: ["/api/team"] });
      toast({
        title: "Team Member Deleted",
        description: "Team member has been successfully removed.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete team member. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setShowForm(true);
  };

  const handleDelete = (member: TeamMember) => {
    if (window.confirm(`Are you sure you want to delete "${member.name}"?`)) {
      deleteMutation.mutate(member.id);
    }
  };

  const onSubmit = (data: z.infer<typeof teamMemberSchema>) => {
    const cleanData = {
      name: data.name,
      position: data.position,
      bio: data.bio,
      image: data.image,
      email: data.email || undefined,
      linkedin: data.linkedin || undefined,
      order: data.order ?? 0,
      active: data.active ?? true,
    };

    if (editingMember) {
      updateMutation.mutate({ id: editingMember.id, data: cleanData });
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
                Team Management
              </h1>
            </div>
            <Button
              onClick={() => {
                setEditingMember(null);
                setShowForm(true);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Member
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
                  <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                  <p className="text-3xl font-bold">{teamMembers.length}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Active Members</p>
                  <p className="text-3xl font-bold">
                    {teamMembers.filter(m => m.active).length}
                  </p>
                </div>
                <Badge className="bg-green-100 text-green-800">Active</Badge>
              </div>
            </CardContent>
          </Card>
          <Card className="admin-card">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Departments</p>
                  <p className="text-3xl font-bold">
                    {new Set(teamMembers.map(m => m.position.split(' ').pop())).size}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
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
                placeholder="Search team members by name or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Team Members List */}
        <Card className="admin-card">
          <CardHeader>
            <CardTitle>Team Members ({filteredMembers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center space-x-4 p-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-1/3" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-20" />
                  </div>
                ))}
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {teamMembers.length === 0 ? "No team members added yet." : "No members found matching your search."}
                </p>
                <Button
                  onClick={() => {
                    setEditingMember(null);
                    setShowForm(true);
                  }}
                  className="mt-4"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Member
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-4 flex-1">
                      <img
                        src={member.image}
                        alt={member.name}
                        className="h-16 w-16 object-cover rounded-full"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(member.name)}&size=64&background=2563eb&color=fff`;
                        }}
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-blue-600 font-medium">{member.position}</p>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {member.bio}
                        </p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge className={member.active ? 
                            "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" :
                            "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                          }>
                            {member.active ? "Active" : "Inactive"}
                          </Badge>
                          {member.email && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Mail className="h-3 w-3 mr-1" />
                              {member.email}
                            </div>
                          )}
                          {member.linkedin && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Linkedin className="h-3 w-3 mr-1" />
                              LinkedIn
                            </div>
                          )}
                          <span className="text-xs text-muted-foreground">
                            Order: {member.order}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(member)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(member)}
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
      <Dialog open={showForm} onOpenChange={(open) => {
        setShowForm(open);
        if (!open) {
          setEditingMember(null);
          form.reset();
        }
      }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingMember ? "Edit Team Member" : "Add New Team Member"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  {...form.register("name")}
                  placeholder="Full name"
                />
                {form.formState.errors.name?.message && (
                  <p className="text-sm text-red-600">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="position">Position *</Label>
                <Input
                  id="position"
                  {...form.register("position")}
                  placeholder="Job title"
                />
                {form.formState.errors.position?.message && (
                  <p className="text-sm text-red-600">{form.formState.errors.position.message}</p>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="bio">Bio *</Label>
              <Textarea
                id="bio"
                {...form.register("bio")}
                placeholder="Brief description of background and expertise"
                rows={3}
              />
              {form.formState.errors.bio?.message && (
                <p className="text-sm text-red-600">{form.formState.errors.bio.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="image">Profile Image URL *</Label>
              <Input
                id="image"
                {...form.register("image")}
                placeholder="https://example.com/image.jpg"
              />
              {form.formState.errors.image?.message && (
                <p className="text-sm text-red-600">{form.formState.errors.image.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="email@company.com"
                />
                {form.formState.errors.email?.message && (
                  <p className="text-sm text-red-600">{form.formState.errors.email.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  {...form.register("linkedin")}
                  placeholder="https://www.linkedin.com/in/username"
                />
                {form.formState.errors.linkedin?.message && (
                  <p className="text-sm text-red-600">{form.formState.errors.linkedin.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="order">Display Order</Label>
                <Input
                  id="order"
                  type="number"
                  {...form.register("order", { valueAsNumber: true })}
                  placeholder="0"
                />
                {form.formState.errors.order?.message && (
                  <p className="text-sm text-red-600">{form.formState.errors.order.message}</p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  {...form.register("active")}
                  defaultChecked={true}
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
                 editingMember ? "Update Member" : "Add Member"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}