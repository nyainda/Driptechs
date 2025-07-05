
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Save, Upload, Image as ImageIcon } from "lucide-react";
import type { BlogPost } from "@shared/schema";

const blogSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  content: z.string().min(50, "Content must be at least 50 characters"),
  excerpt: z.string().min(20, "Excerpt must be at least 20 characters"),
  image_url: z.string().optional(),
  published: z.boolean().default(false),
});

type BlogFormData = z.infer<typeof blogSchema>;

interface BlogFormProps {
  post?: BlogPost | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function BlogForm({ post, onSuccess, onCancel }: BlogFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState(post?.image_url || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<BlogFormData>({
    resolver: zodResolver(blogSchema),
    defaultValues: {
      title: post?.title || "",
      slug: post?.slug || "",
      content: post?.content || "",
      excerpt: post?.excerpt || "",
      image_url: post?.image_url || "",
      published: post?.published || false,
    },
  });

  const watchedTitle = watch("title");
  const watchedPublished = watch("published");

  // Auto-generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const createPostMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const response = await apiRequest("POST", "/api/admin/blog", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({
        title: "Blog Post Created",
        description: "Blog post has been created successfully.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create blog post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: async (data: BlogFormData) => {
      const response = await apiRequest("PUT", `/api/admin/blog/${post!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/blog"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/blog"] });
      toast({
        title: "Blog Post Updated",
        description: "Blog post has been updated successfully.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update blog post. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: BlogFormData) => {
    if (post) {
      updatePostMutation.mutate(data);
    } else {
      createPostMutation.mutate(data);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Post Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="Enter blog post title"
              {...register("title")}
              onChange={(e) => {
                register("title").onChange(e);
                if (!post) {
                  const slug = generateSlug(e.target.value);
                  setValue("slug", slug);
                }
              }}
            />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="slug">URL Slug *</Label>
            <Input
              id="slug"
              placeholder="url-friendly-slug"
              {...register("slug")}
            />
            {errors.slug && (
              <p className="text-sm text-red-500">{errors.slug.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt">Excerpt *</Label>
            <Textarea
              id="excerpt"
              rows={3}
              placeholder="Short description of the blog post"
              {...register("excerpt")}
            />
            {errors.excerpt && (
              <p className="text-sm text-red-500">{errors.excerpt.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              rows={15}
              placeholder="Write your blog post content here..."
              {...register("content")}
            />
            {errors.content && (
              <p className="text-sm text-red-500">{errors.content.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Featured Image */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Featured Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              placeholder="Enter featured image URL"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setValue("image_url", e.target.value);
              }}
            />
          </div>

          {imageUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <div className="aspect-video max-w-md bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Featured image preview"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Publishing Options */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Publishing Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={watchedPublished}
              onCheckedChange={(checked) => setValue("published", checked)}
            />
            <Label>Published</Label>
            <span className="text-sm text-muted-foreground">
              {watchedPublished ? "This post will be visible to the public" : "This post will be saved as draft"}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={createPostMutation.isPending || updatePostMutation.isPending}
          className="flex-1 btn-primary"
        >
          {(createPostMutation.isPending || updatePostMutation.isPending) ? (
            <div className="loading-spinner mr-2" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {post ? "Update Post" : "Create Post"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
