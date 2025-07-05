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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { 
  Plus, 
  Minus, 
  Save, 
  X,
  Upload,
  Image as ImageIcon
} from "lucide-react";
import type { Product } from "@shared/schema";

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  category: z.string().min(1, "Category is required"),
  model: z.string().min(1, "Model is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.string().min(1, "Price is required"),
  currency: z.string().default("KSH"),
  images: z.array(z.string()).default([]),
  specifications: z.record(z.string()).default({}),
  features: z.array(z.string()).default([]),
  applications: z.array(z.string()).default([]),
  inStock: z.boolean().default(true),
  stockQuantity: z.number().min(0, "Stock quantity must be non-negative").default(0),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [newFeature, setNewFeature] = useState("");
  const [newApplication, setNewApplication] = useState("");
  const [newImage, setNewImage] = useState("");
  const [specKey, setSpecKey] = useState("");
  const [specValue, setSpecValue] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: product ? {
      name: product.name,
      category: product.category,
      model: product.model,
      description: product.description,
      price: product.price,
      currency: product.currency,
      images: product.images || [],
      specifications: (product.specifications as Record<string, string>) || {},
      features: product.features || [],
      applications: product.applications || [],
      inStock: product.inStock,
      stockQuantity: product.stockQuantity || 0,
    } : {
      currency: "KSH",
      inStock: true,
      stockQuantity: 0,
      images: [],
      specifications: {},
      features: [],
      applications: [],
    },
  });

  const watchedFields = watch();

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await apiRequest("POST", "/api/admin/products", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product Created",
        description: "Product has been created successfully.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      const response = await apiRequest("PUT", `/api/admin/products/${product!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product Updated",
        description: "Product has been updated successfully.",
      });
      onSuccess();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProductFormData) => {
    if (product) {
      updateProductMutation.mutate(data);
    } else {
      createProductMutation.mutate(data);
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      const currentFeatures = getValues("features");
      setValue("features", [...currentFeatures, newFeature.trim()]);
      setNewFeature("");
    }
  };

  const removeFeature = (index: number) => {
    const currentFeatures = getValues("features");
    setValue("features", currentFeatures.filter((_, i) => i !== index));
  };

  const addApplication = () => {
    if (newApplication.trim()) {
      const currentApplications = getValues("applications");
      setValue("applications", [...currentApplications, newApplication.trim()]);
      setNewApplication("");
    }
  };

  const removeApplication = (index: number) => {
    const currentApplications = getValues("applications");
    setValue("applications", currentApplications.filter((_, i) => i !== index));
  };

  const addImage = () => {
    if (newImage.trim()) {
      const currentImages = getValues("images");
      setValue("images", [...currentImages, newImage.trim()]);
      setNewImage("");
    }
  };

  const removeImage = (index: number) => {
    const currentImages = getValues("images");
    setValue("images", currentImages.filter((_, i) => i !== index));
  };

  const addSpecification = () => {
    if (specKey.trim() && specValue.trim()) {
      const currentSpecs = getValues("specifications");
      setValue("specifications", { ...currentSpecs, [specKey.trim()]: specValue.trim() });
      setSpecKey("");
      setSpecValue("");
    }
  };

  const removeSpecification = (key: string) => {
    const currentSpecs = getValues("specifications");
    const newSpecs = { ...currentSpecs };
    delete newSpecs[key];
    setValue("specifications", newSpecs);
  };

  const categories = [
    { value: "drip_irrigation", label: "Drip Irrigation" },
    { value: "sprinkler", label: "Sprinkler Systems" },
    { value: "filtration", label: "Filtration Systems" },
    { value: "control", label: "Control Systems" },
    { value: "fertigation", label: "Fertigation Systems" },
    { value: "accessories", label: "Accessories" },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Basic Information */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="Enter product name"
                {...register("name")}
              />
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                placeholder="Enter model number"
                {...register("model")}
              />
              {errors.model && (
                <p className="text-sm text-red-500">{errors.model.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select onValueChange={(value) => setValue("category", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category && (
                <p className="text-sm text-red-500">{errors.category.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price (KSh) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="Enter price"
                {...register("price")}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="Enter product description"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-red-500">{errors.description.message}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stock Information */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Stock Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={watchedFields.inStock}
              onCheckedChange={(checked) => setValue("inStock", checked)}
            />
            <Label>In Stock</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stockQuantity">Stock Quantity</Label>
            <Input
              id="stockQuantity"
              type="number"
              min="0"
              placeholder="Enter stock quantity"
              {...register("stockQuantity", { valueAsNumber: true })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Product Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter image URL"
              value={newImage}
              onChange={(e) => setNewImage(e.target.value)}
            />
            <Button type="button" onClick={addImage} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchedFields.images?.map((image, index) => (
              <div key={index} className="relative group">
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                  <img
                    src={image}
                    alt={`Product image ${index + 1}`}
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
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Technical Specifications */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Technical Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Specification name"
              value={specKey}
              onChange={(e) => setSpecKey(e.target.value)}
            />
            <Input
              placeholder="Specification value"
              value={specValue}
              onChange={(e) => setSpecValue(e.target.value)}
            />
            <Button type="button" onClick={addSpecification} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            {Object.entries(watchedFields.specifications || {}).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div>
                  <span className="font-medium">{key}:</span> {value}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeSpecification(key)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Key Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter feature"
              value={newFeature}
              onChange={(e) => setNewFeature(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
            />
            <Button type="button" onClick={addFeature} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {watchedFields.features?.map((feature, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                {feature}
                <button
                  type="button"
                  onClick={() => removeFeature(index)}
                  className="text-red-600 hover:text-red-700 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Applications */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter application"
              value={newApplication}
              onChange={(e) => setNewApplication(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addApplication())}
            />
            <Button type="button" onClick={addApplication} variant="outline">
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2">
            {watchedFields.applications?.map((application, index) => (
              <Badge key={index} variant="outline" className="flex items-center gap-1">
                {application}
                <button
                  type="button"
                  onClick={() => removeApplication(index)}
                  className="text-red-600 hover:text-red-700 ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Form Actions */}
      <div className="flex gap-4">
        <Button
          type="submit"
          disabled={createProductMutation.isPending || updateProductMutation.isPending}
          className="flex-1 btn-primary"
        >
          {(createProductMutation.isPending || updateProductMutation.isPending) ? (
            <div className="loading-spinner mr-2" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          {product ? "Update Product" : "Create Product"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
