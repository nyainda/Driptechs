import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Filter, Grid3X3, List, Droplets, Zap, Settings, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Star, Heart, TrendingUp, Award, Phone, Mail } from "lucide-react";
import ProductCard from "@/components/product-card";
import type { Product } from "@shared/schema.ts";

export default function Products() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  const { data: products, isLoading, error } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const categories = [
    { value: "all", label: "All Products", icon: "🌟" },
    { value: "drip_irrigation", label: "Drip Irrigation", icon: "💧" },
    { value: "sprinkler", label: "Sprinkler Systems", icon: "🌧️" },
    { value: "filtration", label: "Filtration Systems", icon: "🔧" },
    { value: "control", label: "Control Systems", icon: "⚡" },
    { value: "fertigation", label: "Fertigation Systems", icon: "🌱" },
    { value: "accessories", label: "Accessories", icon: "🛠️" },
  ];

  const priceRanges = [
    { value: "all", label: "All Prices" },
    { value: "0-10000", label: "Under KSh 10,000" },
    { value: "10000-25000", label: "KSh 10,000 - 25,000" },
    { value: "25000-50000", label: "KSh 25,000 - 50,000" },
    { value: "50000+", label: "Over KSh 50,000" },
  ];

  const itemsPerPageOptions = [
    { value: "6", label: "6 per page" },
    { value: "12", label: "12 per page" },
    { value: "24", label: "24 per page" },
    { value: "48", label: "48 per page" },
  ];

  const filteredProducts = products?.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;
    
    const price = parseFloat(product.price);
    let matchesPrice = true;
    
    if (priceRange !== "all") {
      if (priceRange === "0-10000") {
        matchesPrice = price < 10000;
      } else if (priceRange === "10000-25000") {
        matchesPrice = price >= 10000 && price <= 25000;
      } else if (priceRange === "25000-50000") {
        matchesPrice = price >= 25000 && price <= 50000;
      } else if (priceRange === "50000+") {
        matchesPrice = price > 50000;
      }
    }
    
    return matchesSearch && matchesCategory && matchesPrice;
  }) || [];

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Reset to first page when filters change
  const handleFilterChange = (filterFn: () => void) => {
    filterFn();
    setCurrentPage(1);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-red-100 dark:from-slate-900 dark:via-red-900/10 dark:to-slate-900 py-20">
        <div className="container mx-auto px-4">
          <Card className="max-w-lg mx-auto border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl shadow-2xl">
            <CardContent className="p-10 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Zap className="h-8 w-8 text-white animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Connection Error</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">Failed to load products. Please try again.</p>
              <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white shadow-lg">
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
      <div className="min-h-screen bg-background py-20">
      {/* Enhanced Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 dark:from-blue-900 dark:via-indigo-900 dark:to-purple-900"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
        
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-purple-300/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-10 left-1/3 w-16 h-16 bg-blue-300/20 rounded-full blur-xl animate-pulse delay-500"></div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <Card className="mb-12 shadow-2xl border-0 bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/20 dark:via-purple-500/20 dark:to-pink-500/20 border-b border-white/20">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-gray-800 dark:text-white">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Filter className="h-6 w-6 text-white" />
              </div>
              Smart Product Filters
              <Badge className="ml-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-lg">
                AI Powered
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              <div className="space-y-4">
                <Label htmlFor="search" className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Search Products
                </Label>
                <div className="relative group">
                  <Input
                    id="search"
                    placeholder="Find your perfect solution..."
                    value={searchTerm}
                    onChange={(e) => handleFilterChange(() => setSearchTerm(e.target.value))}
                    className="pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 dark:bg-slate-700 dark:text-white rounded-xl shadow-lg transition-all duration-300 group-hover:shadow-xl"
                  />
                  <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                </div>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <Grid3X3 className="h-4 w-4" />
                  Category
                </Label>
                <Select value={selectedCategory} onValueChange={(value) => handleFilterChange(() => setSelectedCategory(value))}>
                  <SelectTrigger className="border-2 border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 dark:bg-slate-700 dark:text-white rounded-xl shadow-lg h-12 transition-all duration-300 hover:shadow-xl">
                    <SelectValue placeholder="Choose category" />
                  </SelectTrigger>
                  <SelectContent className="border-0 shadow-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl">
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value} className="py-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{category.icon}</span>
                          {category.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Price Range
                </Label>
                <Select value={priceRange} onValueChange={(value) => handleFilterChange(() => setPriceRange(value))}>
                  <SelectTrigger className="border-2 border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 dark:bg-slate-700 dark:text-white rounded-xl shadow-lg h-12 transition-all duration-300 hover:shadow-xl">
                    <SelectValue placeholder="Select budget" />
                  </SelectTrigger>
                  <SelectContent className="border-0 shadow-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl">
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value} className="py-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <List className="h-4 w-4" />
                  Items per page
                </Label>
                <Select value={itemsPerPage.toString()} onValueChange={(value) => {
                  setItemsPerPage(parseInt(value));
                  setCurrentPage(1);
                }}>
                  <SelectTrigger className="border-2 border-gray-200 dark:border-gray-600 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 dark:bg-slate-700 dark:text-white rounded-xl shadow-lg h-12 transition-all duration-300 hover:shadow-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="border-0 shadow-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-xl">
                    {itemsPerPageOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value} className="py-3 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">View Mode</Label>
                <div className="flex gap-3">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="lg"
                    onClick={() => setViewMode("grid")}
                    className={`flex-1 rounded-xl transition-all duration-300 ${
                      viewMode === "grid" 
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg" 
                        : "border-2 border-gray-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300"
                    }`}
                  >
                    <Grid3X3 className="h-5 w-5" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="lg"
                    onClick={() => setViewMode("list")}
                    className={`flex-1 rounded-xl transition-all duration-300 ${
                      viewMode === "list" 
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg" 
                        : "border-2 border-gray-200 dark:border-gray-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-300"
                    }`}
                  >
                    <List className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="px-8 py-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl border-2 border-white/20 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">{filteredProducts.length}</span>
                </div>
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
                </span>
              </div>
            </div>
            {selectedCategory !== "all" && (
              <Badge className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-0 shadow-lg px-4 py-2 text-sm font-medium">
                {categories.find(c => c.value === selectedCategory)?.icon} {categories.find(c => c.value === selectedCategory)?.label}
              </Badge>
            )}
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center gap-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-2 shadow-xl border-2 border-white/20">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(1)}
                disabled={currentPage === 1}
                className="border-0 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl disabled:opacity-50"
              >
                <ChevronsLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-0 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg">
                {currentPage} of {totalPages}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="border-0 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl disabled:opacity-50"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToPage(totalPages)}
                disabled={currentPage === totalPages}
                className="border-0 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl disabled:opacity-50"
              >
                <ChevronsRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: itemsPerPage }).map((_, i) => (
              <Card key={i} className="overflow-hidden shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl group hover:shadow-3xl transition-all duration-500">
                <div className="relative">
                  <Skeleton className="h-64 w-full bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 dark:from-indigo-800 dark:via-purple-800 dark:to-pink-800 animate-pulse" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
                <div className="p-8 space-y-4">
                  <Skeleton className="h-6 w-3/4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg" />
                  <Skeleton className="h-4 w-1/2 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-lg" />
                  <Skeleton className="h-12 w-full bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 rounded-xl" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <Card className="text-center py-20 shadow-2xl border-0 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl">
            <CardContent>
              <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
                <Search className="h-12 w-12 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                No Products Found
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-md mx-auto">
                We couldn't find any products matching your search criteria. Try adjusting your filters for better results.
              </p>
              <Button
                size="lg"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                  setPriceRange("all");
                  setCurrentPage(1);
                }}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-xl"
              >
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className={`grid gap-8 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            
            {totalPages > 1 && (
              <div className="flex justify-center items-center mt-16">
                <div className="flex items-center gap-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-2xl p-4 shadow-2xl border-2 border-white/20">
                  <Button
                    variant="outline"
                    onClick={() => goToPage(1)}
                    disabled={currentPage === 1}
                    className="border-0 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl disabled:opacity-50 px-4 py-2"
                  >
                    <ChevronsLeft className="h-4 w-4 mr-2" />
                    First
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="border-0 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl disabled:opacity-50 px-4 py-2"
                  >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>
                  
                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else {
                        if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => goToPage(pageNum)}
                          className={`rounded-xl transition-all duration-300 ${
                            currentPage === pageNum 
                              ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg" 
                              : "border-0 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
                          }`}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="border-0 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl disabled:opacity-50 px-4 py-2"
                  >
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => goToPage(totalPages)}
                    disabled={currentPage === totalPages}
                    className="border-0 bg-transparent hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-xl disabled:opacity-50 px-4 py-2"
                  >
                    Last
                    <ChevronsRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Contact Section */}
        <Card className="mt-12 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-blue-900 dark:text-blue-100 text-2xl font-bold">
              Need Help Choosing a Product?
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Get in Touch</h4>
                <p className="text-blue-700 dark:text-blue-200 mb-4">
                  Our irrigation specialists are ready to help you find the perfect solution for your needs.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <a
                      href="tel:+254111409454"
                      className="text-blue-700 dark:text-blue-200 hover:underline"
                      aria-label="Call us at +254 111 409 454"
                    >
                      +254 111 409 454
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    <a
                      href="tel:+254114575401"
                      className="text-blue-700 dark:text-blue-200 hover:underline"
                      aria-label="Call us at +254 114 575 401"
                    >
                      +254 114 575 401
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-blue-600" />
                    <a
                      href="mailto:driptechs.info@gmail.com"
                      className="text-blue-700 dark:text-blue-200 hover:underline"
                      aria-label="Email us at driptechs.info@gmail.com"
                    >
                      driptechs.info@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="h-4 w-4 text-blue-600" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <title>WhatsApp</title>
                      <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.198-.347.223-.644.075-.297-.148-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.074-.149-.669-.719-.911-.99-.241-.272-.472-.247-.669-.198-.197.049-1.514.372-1.758.644-.247.273-.445.974-.494 1.035-.049.099-.396.793-.644 1.235-.247.443-.495.867-.842 1.037-.347.174-1.235.446-2.079.595-.842.149-1.51.099-2.079-.025-.569-.124-1.733-.471-2.228-.842-.494-.372-.842-1.584-.842-2.566 0-.983.297-1.832.842-2.405.544-.573 1.584-1.035 2.376-1.184.793-.149 1.98-.099 2.871.099.892.198 1.683.668 2.178 1.086.494.417.842 1.086.842 1.832 0 .744-.099 1.212-.297 1.631zm4.988-6.566c-.644-.793-1.584-1.285-2.673-1.285-2.178 0-3.96 1.782-3.96 3.96 0 .595.133 1.164.372 1.683l-.595 2.178 2.228-.595c.495.297 1.064.446 1.683.446 2.178 0 3.96-1.782 3.96-3.96 0-.892-.297-1.733-.842-2.427zm-9.108 8.645l-.347.198c-.297.174-.644.297-1.01.347-.495.074-1.01.025-1.51-.099-.396-.099-.793-.297-1.138-.545-.94-.669-1.584-1.683-1.832-2.871-.099-.495-.149-1.01-.149-1.51 0-1.683.842-3.168 2.128-4.059.793-.545 1.782-.842 2.772-.842.793 0 1.535.198 2.178.595.644.396 1.138 1.01 1.386 1.782.247.772.247 1.584 0 2.356-.247.772-.793 1.386-1.584 1.782-.396.198-.842.297-1.287.297zm6.013-2.673c-.247.099-.495.149-.793.099-.297-.049-.545-.198-.793-.347l-1.584.446.446-1.584c-.099-.247-.247-.495-.347-.793-.396-.892-.297-1.931.297-2.772.595-.842 1.584-1.386 2.673-1.386 1.089 0 2.079.544 2.673 1.386.595.842.693 1.881.297 2.772-.099.297-.247.595-.347.892-.099.297-.247.545-.347.793z"/>
                    </svg>
                    <a
                      href="https://wa.me/+254111409454"
                      className="text-blue-700 dark:text-blue-200 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="Chat with us on WhatsApp"
                    >
                      Chat on WhatsApp
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Quick Actions</h4>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-200 dark:hover:bg-blue-800">
                    Request a Quote
                  </Button>
                  <Button variant="outline" className="w-full justify-start border-blue-300 text-blue-700 hover:bg-blue-100 dark:border-blue-600 dark:text-blue-200 dark:hover:bg-blue-800">
                    Schedule Consultation
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}