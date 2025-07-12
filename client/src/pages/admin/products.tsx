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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getAuthToken, getUser, clearAuth } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import ProductForm from "@/components/admin/product-form";
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Search,
  Filter,
  ArrowLeft,
  DollarSign,
  Tag,
  TrendingUp,
  ShoppingCart,
  Archive,
  MoreVertical,
  Grid3X3,
  List,
  LayoutGrid
} from "lucide-react";
import { Link } from "wouter";
import type { Product } from "../../types/client-schema";

export default function AdminProducts() {
  const [, setLocation] = useLocation();
  const token = getAuthToken();
  const user = getUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Redirect if not authenticated
  if (!token || !user) {
    setLocation("/admin");
    return null;
  }

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/products");
      return response.json();
    },
    enabled: !!token,
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/products/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({
        title: "Product Deleted",
        description: "Product has been successfully removed.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      });
    },
  });

  const filteredProducts = products?.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.model.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (product: Product) => {
    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      deleteProductMutation.mutate(Number(product.id));
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
        <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex items-center h-20">
              <Button
                variant="ghost"
                onClick={() => {
                  setShowForm(false);
                  setEditingProduct(null);
                }}
                className="mr-6 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Products
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  {editingProduct ? "Edit Product" : "Add New Product"}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  {editingProduct ? "Update product information" : "Create a new product listing"}
                </p>
              </div>
            </div>
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-6 lg:px-8 py-12">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xl p-8">
            <ProductForm
              product={editingProduct}
              onSuccess={handleFormSuccess}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-b border-slate-200/60 dark:border-slate-700/60 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center">
              <Button
                variant="ghost"
                onClick={() => setLocation("/admin/dashboard")}
                className="mr-6 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                  Product Management
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Manage your product inventory and listings
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Enhanced Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200/60 dark:border-blue-800/60 hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Total Products</p>
                  <p className="text-4xl font-bold text-blue-900 dark:text-blue-100 mt-2">{products?.length || 0}</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">Active listings</p>
                </div>
                <div className="bg-blue-600 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Package className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200/60 dark:border-green-800/60 hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-700 dark:text-green-300 uppercase tracking-wide">In Stock</p>
                  <p className="text-4xl font-bold text-green-900 dark:text-green-100 mt-2">
                    {products?.filter(p => p.inStock).length || 0}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">Available now</p>
                </div>
                <div className="bg-green-600 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <ShoppingCart className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200/60 dark:border-purple-800/60 hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wide">Categories</p>
                  <p className="text-4xl font-bold text-purple-900 dark:text-purple-100 mt-2">
                    {new Set(products?.map(p => p.category)).size || 0}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Product types</p>
                </div>
                <div className="bg-purple-600 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <Tag className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border-orange-200/60 dark:border-orange-800/60 hover:shadow-xl transition-all duration-300 group">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-orange-700 dark:text-orange-300 uppercase tracking-wide">Avg. Price</p>
                  <p className="text-4xl font-bold text-orange-900 dark:text-orange-100 mt-2">
                    KSh {products?.length ? 
                      Math.round(products.reduce((sum, p) => sum + parseFloat(p.price), 0) / products.length).toLocaleString() : 
                      0}
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">Per product</p>
                </div>
                <div className="bg-orange-600 p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                  <DollarSign className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Search */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 mb-8 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-4 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search products by name, category, or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg bg-white/50 dark:bg-slate-800/50 border-slate-300/60 dark:border-slate-600/60 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
                />
              </div>
              <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className={`${viewMode === 'list' ? 'bg-white dark:bg-slate-700 shadow-md' : 'hover:bg-slate-200 dark:hover:bg-slate-700'} transition-all duration-300`}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className={`${viewMode === 'grid' ? 'bg-white dark:bg-slate-700 shadow-md' : 'hover:bg-slate-200 dark:hover:bg-slate-700'} transition-all duration-300`}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Products List */}
        <Card className="bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border-slate-200/60 dark:border-slate-700/60 shadow-xl">
          <CardHeader className="p-8 pb-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white">
                  Products ({filteredProducts.length})
                </CardTitle>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  {filteredProducts.length === products?.length 
                    ? "All products" 
                    : `Filtered from ${products?.length || 0} total products`}
                </p>
              </div>
              {filteredProducts.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800">
                    {filteredProducts.filter(p => p.inStock).length} in stock
                  </Badge>
                  <Badge variant="secondary" className="bg-slate-100 dark:bg-slate-800">
                    {filteredProducts.filter(p => !p.inStock).length} out of stock
                  </Badge>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            {isLoading ? (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
                {Array.from({ length: viewMode === 'grid' ? 6 : 5 }).map((_, i) => (
                  <div key={i} className={viewMode === 'grid' 
                    ? 'p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl space-y-4' 
                    : 'flex items-center space-x-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl'
                  }>
                    <Skeleton className={viewMode === 'grid' ? 'h-48 w-full rounded-xl' : 'h-20 w-20 rounded-xl'} />
                    <div className={viewMode === 'grid' ? 'space-y-3' : 'flex-1 space-y-3'}>
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                    {viewMode === 'list' && (
                      <div className="flex space-x-2">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <Skeleton className="h-10 w-10 rounded-lg" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20">
                <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 rounded-full p-8 w-32 h-32 mx-auto mb-8 flex items-center justify-center">
                  <Package className="h-16 w-16 text-slate-400" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                  {products?.length === 0 ? "No products yet" : "No products found"}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md mx-auto">
                  {products?.length === 0 
                    ? "Get started by creating your first product listing." 
                    : "Try adjusting your search terms or filters to find what you're looking for."}
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add First Product
                </Button>
              </div>
            ) : (
              <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-6'}>
                {filteredProducts.map((product, index) => (
                  viewMode === 'grid' ? (
                    // Grid View
                    <div 
                      key={product.id}
                      className="group bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 hover:shadow-xl hover:scale-105 transition-all duration-300 overflow-hidden"
                    >
                      <div className="relative">
                        {product.images && product.images.length > 0 ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-48 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                            <Package className="h-16 w-16 text-slate-400" />
                          </div>
                        )}
                        <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold text-slate-700 dark:text-slate-300">
                          #{index + 1}
                        </div>
                        <div className="absolute bottom-4 left-4">
                          <Badge 
                            className={`${product.inStock 
                              ? "bg-green-500 text-white" 
                              : "bg-red-500 text-white"
                            } font-semibold`}
                          >
                            <div className={`w-2 h-2 rounded-full mr-2 ${product.inStock ? 'bg-green-200' : 'bg-red-200'}`} />
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </Badge>
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="space-y-2 mb-4">
                          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                            <Tag className="h-4 w-4 mr-2" />
                            <span className="font-medium">Model:</span>
                            <span className="ml-1">{product.model}</span>
                          </div>
                          <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                            <Archive className="h-4 w-4 mr-2" />
                            <span className="font-medium">Category:</span>
                            <span className="ml-1">{product.category}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-slate-900 dark:text-white">
                            KSh {parseFloat(product.price).toLocaleString()}
                          </span>
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(product)}
                              className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDelete(product)}
                              className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300 dark:border-red-800"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // List View
                    <div 
                      key={product.id} 
                      className="group flex items-center justify-between p-6 bg-gradient-to-r from-white to-slate-50 dark:from-slate-800/50 dark:to-slate-700/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                    >
                      <div className="flex items-center space-x-6 flex-1">
                        <div className="relative">
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-20 w-20 object-cover rounded-xl shadow-md group-hover:shadow-lg transition-shadow duration-300"
                            />
                          ) : (
                            <div className="h-20 w-20 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600 rounded-xl flex items-center justify-center shadow-md">
                              <Package className="h-8 w-8 text-slate-400" />
                            </div>
                          )}
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {index + 1}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {product.name}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-slate-600 dark:text-slate-400 mb-3">
                            <span className="flex items-center">
                              <Tag className="h-4 w-4 mr-1" />
                              {product.model}
                            </span>
                            <span className="flex items-center">
                              <Archive className="h-4 w-4 mr-1" />
                              {product.category}
                            </span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <Badge 
                              className={`${product.inStock 
                                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800" 
                                : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800"
                              } font-semibold px-3 py-1`}
                            >
                              <div className={`w-2 h-2 rounded-full mr-2 ${product.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </Badge>
                            <span className="text-2xl font-bold text-slate-900 dark:text-white">
                              KSh {parseFloat(product.price).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(product)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300 dark:border-blue-800 transition-all duration-300 group/btn"
                        >
                          <Edit className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(product)}
                          className="bg-red-50 hover:bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300 dark:border-red-800 transition-all duration-300 group/btn"
                        >
                          <Trash2 className="h-4 w-4 group-hover/btn:scale-110 transition-transform" />
                        </Button>
                      </div>
                    </div>
                  )
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}