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
import { insertProductSchema } from "@shared/schema";
import type { Product } from "@shared/schema";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Upload, Image as ImageIcon } from "lucide-react";

const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  category: z.string().min(1, "Category is required"),
  model: z.string().min(1, "Model is required"),
  price: z.number().min(0, "Price must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  images: z.array(z.string()).optional(),
  specifications: z.record(z.any()).optional(),
  features: z.array(z.string()).optional(),
  applications: z.array(z.string()).optional(),
  inStock: z.boolean().optional(),
  stockQuantity: z.number().min(0).optional(),
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
  const [imageUrl, setImageUrl] = useState((product?.images && product.images.length > 0) ? product.images[0] : "");
  const [dragActive, setDragActive] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || "",
      category: product?.category || "",
      model: product?.model || "",
      price: product ? parseFloat(product.price) : 0,
      description: product?.description || "",
      images: product?.images || [],
      specifications: product?.specifications || {},
      features: product?.features || [],
      applications: product?.applications || [],
      inStock: product?.inStock !== undefined ? product.inStock : true,
      stockQuantity: product?.stockQuantity || 0,
    },
  });

  const watchedCategory = watch("category");

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
    // Transform specifications from string to object if needed
    const transformedData = {
      ...data,
      specifications: data.specifications || {},
      images: data.images || [],
      features: data.features || [],
      applications: data.applications || [],
    };
    
    if (product) {
      updateProductMutation.mutate(transformedData);
    } else {
      createProductMutation.mutate(transformedData);
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
        setValue("images", [demoUrl]);
        toast({
          title: "Image Added",
          description: "Demo image has been set. In production, this would upload your file.",
        });
      }
    }
  };

  const categories = [
    { value: "drip_irrigation", label: "Drip Irrigation" },
    { value: "sprinkler", label: "Sprinkler Systems" },
    { value: "filtration", label: "Water Treatment" },
    { value: "control", label: "Automation" },
    { value: "fertigation", label: "Fertigation" },
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
                placeholder="Enter product model"
                {...register("model")}
              />
              {errors.model && (
                <p className="text-sm text-red-500">{errors.model.message}</p>
              )}
            </div>

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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div className="space-y-2">
              <Label htmlFor="stockQuantity">Stock Quantity</Label>
              <Input
                id="stockQuantity"
                type="number"
                placeholder="Enter stock quantity"
                {...register("stockQuantity", { valueAsNumber: true })}
              />
              {errors.stockQuantity && (
                <p className="text-sm text-red-500">{errors.stockQuantity.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="inStock"
              {...register("inStock")}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <Label htmlFor="inStock" className="text-sm font-medium">
              In Stock
            </Label>
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
                setValue("images", e.target.value ? [e.target.value] : []);
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
          <div className="space-y-2">
            <Label htmlFor="specifications">Specifications (JSON format)</Label>
            <Textarea
              id="specifications"
              rows={4}
              placeholder='Enter technical specifications as JSON (e.g., {"flowRate": "2-4 L/h", "pressure": "0.5-4 bar"})'
              defaultValue={product?.specifications ? JSON.stringify(product.specifications, null, 2) : '{}'}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value);
                  setValue("specifications", parsed);
                } catch {
                  // Invalid JSON, keep the string value
                }
              }}
            />
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