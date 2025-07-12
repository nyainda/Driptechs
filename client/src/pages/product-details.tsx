import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  ShoppingCart,
  Phone,
  CheckCircle,
  Settings,
  Target,
  ChevronDown,
  ChevronUp,
  MapPin,
  UserCheck,
  ShieldCheck,
  MessageCircle
} from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";
import type { Product } from "../../types/client-schema";

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const [showAllSpecs, setShowAllSpecs] = useState(false);
  const [showAllApplications, setShowAllApplications] = useState(false);

  const { data: product, isLoading, error } = useQuery<Product>({
    queryKey: [`/api/products/${id}`],
    enabled: !!id,
  });

  const formatCurrency = (price: string | number, currency: string = "KSH") => {
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    const currencyMap: { [key: string]: string } = {
      KSH: "KSH",
      USD: "$",
      EUR: "€",
      GBP: "£",
      KES: "KSH",
    };
    const symbol = currencyMap[currency.toUpperCase()] || currency;
    return `${symbol} ${numPrice.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-muted py-10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Skeleton className="h-96 w-full rounded-xl" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-6 w-1/2" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-10 w-1/3" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-muted py-16 text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The product you're looking for doesn't exist or was removed.
        </p>
        <Link href="/products">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const specifications = product.specifications as Record<string, any> || {};
  const specEntries = Object.entries(specifications);
  const maxSpecsToShow = 6;
  const visibleSpecs = showAllSpecs ? specEntries : specEntries.slice(0, maxSpecsToShow);

  const applications = product.applications || [];
  const maxAppsToShow = 4;
  const visibleApplications = showAllApplications ? applications : applications.slice(0, maxAppsToShow);

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <Link href="/products">
            <Button variant="ghost" className="px-0">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Products
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
          <div className="space-y-6">
            <div className="aspect-square rounded-xl overflow-hidden border shadow-lg">
              <img
                src={product.images?.[0] || "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {product.images && product.images.length > 1 && (
              <div className="flex overflow-x-auto gap-2 hide-scrollbar">
                {product.images.slice(1).map((image, index) => (
                  <div key={index} className="min-w-[80px] h-[80px] rounded overflow-hidden border flex-shrink-0">
                    <img src={image} alt={`Preview ${index + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8 lg:sticky lg:top-20">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="secondary" className="capitalize">
                  {product.category?.replace("_", " ")}
                </Badge>
                <Badge variant={product.inStock ? "default" : "destructive"}>
                  {product.inStock ? "In Stock" : "Out of Stock"}
                </Badge>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-1">{product.name}</h1>
              {product.model && <p className="text-muted-foreground">Model: {product.model}</p>}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground">
                {formatCurrency(product.price, product.currency)}
              </span>
              {product.stockQuantity && (
                <span className="text-sm text-muted-foreground">
                  ({product.stockQuantity} units available)
                </span>
              )}
            </div>

            <Separator />

            <div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Description</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">{product.description}</p>
            </div>

            {Array.isArray(product.features) && product.features.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Key Features</h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-base text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="text-primary h-6 w-6 mt-1" />
                <div>
                  <p className="font-medium text-lg">Quality Guaranteed</p>
                  <p className="text-sm text-muted-foreground">Premium materials and construction for long-lasting performance</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <UserCheck className="text-primary h-6 w-6 mt-1" />
                <div>
                  <p className="font-medium text-lg">Expert Support</p>
                  <p className="text-sm text-muted-foreground">Professional installation and ongoing technical support</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="text-primary h-6 w-6 mt-1" />
                <div>
                  <p className="font-medium text-lg">Local Service</p>
                  <p className="text-sm text-muted-foreground">Based in Kenya with nationwide delivery and service</p>
                </div>
              </div>
            </div>

            <div className="border rounded-2xl p-6 mt-10 bg-accent/40 shadow-sm">
              <h3 className="text-xl font-semibold text-foreground flex items-center gap-2 mb-3">
                <Phone className="h-5 w-5 text-primary" /> Contact Us for This Product
              </h3>
              <div className="text-muted-foreground text-base space-y-1">
                <p>📞 +254 111 409 454</p>
                <p>📞 +254 114 575 401</p>
                <p>📧 driptechs.info@gmail.com</p>
                <p>💬 <a href="https://wa.me/254111409454" target="_blank" rel="noopener noreferrer" className="text-primary underline">Chat on WhatsApp</a></p>
                <p>📍 Based in Kenya, Nationwide Delivery</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
              <Link href="/quote">
                <Button className="w-full sm:w-auto text-lg px-6 py-4" disabled={!product.inStock}>
                  <ShoppingCart className="mr-2 h-5 w-5" /> Request Quote
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="w-full sm:w-auto text-lg px-6 py-4">
                  <Phone className="mr-2 h-5 w-5" /> Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          {specEntries.length > 0 && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" /> Specifications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {visibleSpecs.map(([key, value]) => (
                    <div key={key} className="flex justify-between items-start border-b last:border-b-0 py-2">
                      <span className="font-medium text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim()}
                      </span>
                      <span className="text-right text-muted-foreground">{String(value)}</span>
                    </div>
                  ))}
                </div>
                {specEntries.length > maxSpecsToShow && (
                  <div className="pt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllSpecs(!showAllSpecs)}
                      className="w-full"
                    >
                      {showAllSpecs ? (
                        <>
                          <ChevronUp className="mr-2 h-4 w-4" /> Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="mr-2 h-4 w-4" /> Show {specEntries.length - maxSpecsToShow} More
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {applications.length > 0 && (
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" /> Applications
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {visibleApplications.map((application, index) => (
                    <li key={index} className="p-3 rounded-lg bg-accent text-sm text-foreground">
                      {application}
                    </li>
                  ))}
                </ul>
                {applications.length > maxAppsToShow && (
                  <div className="pt-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllApplications(!showAllApplications)}
                      className="w-full"
                    >
                      {showAllApplications ? (
                        <>
                          <ChevronUp className="mr-2 h-4 w-4" /> Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="mr-2 h-4 w-4" /> Show {applications.length - maxAppsToShow} More
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
