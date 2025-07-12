import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertProductSchema } from "../../types/client-schema";
import type { Product } from "../../types/client-schema";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Upload, Image as ImageIcon, Plus, X } from "lucide-react";

// Use the shared schema but extend it for form validation
const productFormSchema = insertProductSchema.extend({
  price: z.number().min(0, "Price must be positive"),
  images: z.array(z.string()).optional(),
  image_url: z.string().optional(), // Keep this for form input
  features: z.array(z.string()).optional(),
  applications: z.array(z.string()).optional(),
  specifications: z.union([z.string(), z.object({}).passthrough()]).optional(),
});

type ProductFormData = z.infer<typeof productFormSchema>;

interface ProductFormProps {
  product?: Product | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSuccess, onCancel }: ProductFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [imageUrl, setImageUrl] = useState(product?.images?.[0] || "");
  const [dragActive, setDragActive] = useState(false);
  const [features, setFeatures] = useState<string[]>(
    product?.features || [""]
  );
  const [applications, setApplications] = useState<string[]>(
    product?.applications || [""]
  );
  const [specifications, setSpecifications] = useState<Array<{key: string, value: string}>>(
    product?.specifications && typeof product.specifications === 'object' && !Array.isArray(product.specifications)
      ? Object.entries(product.specifications).map(([key, value]) => ({ key, value: String(value) }))
      : [{ key: "", value: "" }]
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name || "",
      category: product?.category || "",
      model: product?.model || "",
      price: product ? parseFloat(product.price) : 0,
      description: product?.description || "",
      image_url: product?.images?.[0] || "",
      specifications: product?.specifications || {},
      inStock: product?.inStock ?? true,
      features: product?.features || [""],
      applications: product?.applications || [""],
    },
  });

  const watchedCategory = watch("category");
  const watchedInStock = watch("inStock");

  const createProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      // Transform the data to match your API expectations
      const transformedData = {
        name: data.name,
        category: data.category,
        model: data.model,
        price: data.price.toString(), // Convert to string if needed
        description: data.description,
        specifications: specifications.reduce((acc, spec) => {
          if (spec.key.trim() && spec.value.trim()) {
            acc[spec.key.trim()] = spec.value.trim();
          }
          return acc;
        }, {} as Record<string, string>),
        images: data.image_url ? [data.image_url] : [], // Convert to array
        inStock: data.inStock,
        features: features.filter(feature => feature.trim() !== ""), // Filter out empty features
        applications: applications.filter(app => app.trim() !== ""), // Filter out empty applications
      };
      
      const response = await apiRequest("POST", "/api/admin/products", transformedData);
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
    onError: (error) => {
      console.error("Create product error:", error);
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: async (data: ProductFormData) => {
      // Transform the data to match your API expectations
      const transformedData = {
        name: data.name,
        category: data.category,
        model: data.model,
        price: data.price.toString(), // Convert to string if needed
        description: data.description,
        specifications: specifications.reduce((acc, spec) => {
          if (spec.key.trim() && spec.value.trim()) {
            acc[spec.key.trim()] = spec.value.trim();
          }
          return acc;
        }, {} as Record<string, string>),
        images: data.image_url ? [data.image_url] : [], // Convert to array
        inStock: data.inStock,
        features: features.filter(feature => feature.trim() !== ""), // Filter out empty features
        applications: applications.filter(app => app.trim() !== ""), // Filter out empty applications
      };
      
      const response = await apiRequest("PUT", `/api/admin/products/${product!.id}`, transformedData);
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
    onError: (error) => {
      console.error("Update product error:", error);
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

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        // In a real app, you'd upload this to a cloud service
        // For demo purposes, we'll use a placeholder
        const demoUrl = `https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop`;
        setImageUrl(demoUrl);
        setValue("image_url", demoUrl);
        toast({
          title: "Image Added",
          description: "Demo image has been set. In production, this would upload your file.",
        });
      }
    }
  };

  // Features Management
  const addFeature = () => {
    setFeatures([...features, ""]);
  };

  const removeFeature = (index: number) => {
    const newFeatures = features.filter((_, i) => i !== index);
    setFeatures(newFeatures);
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...features];
    newFeatures[index] = value;
    setFeatures(newFeatures);
  };

  // Applications Management
  const addApplication = () => {
    setApplications([...applications, ""]);
  };

  const removeApplication = (index: number) => {
    const newApplications = applications.filter((_, i) => i !== index);
    setApplications(newApplications);
  };

  // Specifications Management
  const addSpecification = () => {
    setSpecifications([...specifications, { key: "", value: "" }]);
  };

  const removeSpecification = (index: number) => {
    const newSpecs = specifications.filter((_, i) => i !== index);
    setSpecifications(newSpecs);
  };

  const updateSpecification = (index: number, field: 'key' | 'value', value: string) => {
    const newSpecs = [...specifications];
    newSpecs[index][field] = value;
    setSpecifications(newSpecs);
  };

  const categories = [
    { value: "Drip Irrigation", label: "Drip Irrigation" },
    { value: "Sprinkler Systems", label: "Sprinkler Systems" },
    { value: "Water Treatment", label: "Water Treatment" },
    { value: "Automation", label: "Automation" },
    { value: "Accessories", label: "Accessories" },
  ];

  function updateApplication(index: number, value: string): void {
    const newApplications = [...applications];
    newApplications[index] = value;
    setApplications(newApplications);
  }
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
                placeholder="Enter product model"
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
              <Select 
                value={watchedCategory} 
                onValueChange={(value) => setValue("category", value)}
              >
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
                {...register("price", { valueAsNumber: true })}
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

          {/* Stock Status */}
          <div className="flex items-center space-x-2">
            <Switch
              id="inStock"
              checked={watchedInStock ?? false}
              onCheckedChange={(checked) => setValue("inStock", checked)}
            />
            <Label htmlFor="inStock" className="text-sm font-medium">
              In Stock
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {features.map((feature, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Feature ${index + 1}`}
                  value={feature}
                  onChange={(e) => updateFeature(index, e.target.value)}
                  className="flex-1"
                />
                {features.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeFeature(index)}
                    className="px-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addFeature}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Feature
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Add key features and benefits that make this product stand out.
          </p>
        </CardContent>
      </Card>

      {/* Applications */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {applications.map((application, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  placeholder={`Application ${index + 1}`}
                  value={application}
                  onChange={(e) => updateApplication(index, e.target.value)}
                  className="flex-1"
                />
                {applications.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeApplication(index)}
                    className="px-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addApplication}
              className="mt-2"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Application
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Specify the use cases and applications where this product is most effective.
          </p>
        </CardContent>
      </Card>

      {/* Product Image */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Product Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image_url">Image URL</Label>
            <Input
              id="image_url"
              placeholder="Enter image URL or drag and drop image below"
              value={imageUrl}
              onChange={(e) => {
                setImageUrl(e.target.value);
                setValue("image_url", e.target.value);
              }}
            />
          </div>

          {/* Drag and Drop Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? "border-blue-500 bg-blue-50 dark:bg-blue-950" 
                : "border-gray-300 dark:border-gray-600"
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-lg font-medium">Drag and drop an image here</p>
            <p className="text-sm text-muted-foreground">or use the URL field above</p>
          </div>

          {/* Image Preview */}
          {imageUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <div className="aspect-video max-w-md bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                <img
                  src={imageUrl}
                  alt="Product preview"
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

      {/* Technical Specifications */}
      <Card className="admin-card">
        <CardHeader>
          <CardTitle>Technical Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            {specifications.map((spec, index) => (
              <div key={index} className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-800">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-medium text-sm">Specification {index + 1}</h4>
                  {specifications.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSpecification(index)}
                      className="text-red-500 hover:text-red-700 h-6 w-6 p-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      What are you specifying? (e.g., Flow Rate, Material, Size)
                    </Label>
                    <Input
                      placeholder="e.g., Flow Rate"
                      value={spec.key}
                      onChange={(e) => updateSpecification(index, 'key', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs text-muted-foreground mb-1 block">
                      What is the value? (e.g., 2-4 L/h, Plastic, 16mm)
                    </Label>
                    <Input
                      placeholder="e.g., 2-4 L/h"
                      value={spec.value}
                      onChange={(e) => updateSpecification(index, 'value', e.target.value)}
                      className="text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addSpecification}
              className="w-full mt-3"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Another Specification
            </Button>
          </div>
          
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300 font-medium mb-2">
              💡 Examples for Irrigation Products:
            </p>
            <div className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
              <div><strong>Flow Rate:</strong> 2-4 L/h</div>
              <div><strong>Pressure Range:</strong> 0.5-4 bar</div>
              <div><strong>Material:</strong> UV-resistant plastic</div>
              <div><strong>Connection Size:</strong> 16mm</div>
              <div><strong>Operating Temperature:</strong> 5-40°C</div>
              <div><strong>Coverage Area:</strong> 1-2 square meters</div>
            </div>
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