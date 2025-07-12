import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Edit2, Heart, ShoppingCart, Star, Package, Check } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getAuthHeaders } from "@/lib/auth";
import { Link } from "wouter";
import type { Product } from "@shared/schema.ts";
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useLocation } from "wouter";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: string, currency: string) => {
    return `${currency} ${parseFloat(price).toLocaleString()}`;
  };

  const getCategoryBadgeColor = (category: string) => {
    switch (category) {
      case "drip_irrigation":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "sprinkler":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "filtration":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "control":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200";
      case "fertigation":
        return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case "drip_irrigation":
        return "Drip Irrigation";
      case "sprinkler":
        return "Sprinkler";
      case "filtration":
        return "Filtration";
      case "control":
        return "Control";
      case "fertigation":
        return "Fertigation";
      case "accessories":
        return "Accessories";
      default:
        return category;
    }
  };
  const [isFavorite, setIsFavorite] = useState(false);
  const [, setLocation] = useLocation();

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="pb-4">
        <div className="relative aspect-video overflow-hidden rounded-lg mb-4">
          <img
            src={(product.images && product.images.length > 0) ? product.images[0] : `https://images.unsplash.com/photo-1586953983027-d7508a64f4bb?w=400&h=300&fit=crop`}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = `https://images.unsplash.com/photo-1586953983027-d7508a64f4bb?w=400&h=300&fit=crop`;
            }}
          />
        </div>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Badge className={getCategoryBadgeColor(product.category)}>
              {getCategoryLabel(product.category)}
            </Badge>
            <CardTitle className="mt-2 text-lg font-semibold">{product.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{product.model}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-blue-600">
              ${product.price || "TBD"}
            </span>
            <Badge variant="secondary" className="text-xs">
              {product.category || "General"}
            </Badge>
          </div>
            {product.inStock ? (
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                In Stock
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
          {product.description}
        </p>

        {product.features && product.features.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-semibold">Key Features:</h4>
            <ul className="space-y-1">
              {product.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="flex items-center space-x-2 text-sm">
                  <Check className="h-3 w-3 text-green-600" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {product.specifications && typeof product.specifications === 'object' && (
          <div className="mt-4 space-y-1">
            <h4 className="text-sm font-semibold">Specifications:</h4>
            <div className="grid grid-cols-1 gap-1 text-xs text-muted-foreground">
              {Object.entries(product.specifications as Record<string, string | number>).slice(0, 2).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                  <span>{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex w-full gap-2">
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setLocation(`/products/${product.id}`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            View Details
          </Button>
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => setLocation("/quote")}
          >
            Get Quote
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}