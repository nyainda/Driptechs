
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, Droplets, Phone, Mail, MapPin, ChevronDown, Moon, Sun } from "lucide-react";
import { Link, useLocation } from "wouter";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

const navigation = [
  { name: "Home", href: "/" },
  { 
    name: "Products", 
    href: "/products",
    submenu: [
      { name: "Drip Irrigation", href: "/products?category=drip-irrigation" },
      { name: "Sprinkler Systems", href: "/products?category=sprinkler" },
      { name: "Pumps & Motors", href: "/products?category=pumps" },
      { name: "Controllers", href: "/products?category=controllers" },
    ]
  },
  { name: "Services", href: "/services" },
  { name: "Projects", href: "/projects" },
  { name: "Blog", href: "/blog" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Header() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const closeSheet = () => setIsOpen(false);

  return (
    <>
      {/* Top Bar */}
      <div className="bg-blue-600 dark:bg-blue-800 text-white py-2 hidden md:block">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+254 123 456 789</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@driptech.co.ke</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Nairobi, Kenya</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-lg border-b" 
          : "bg-white dark:bg-gray-900 border-b"
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-green-600 transition-transform group-hover:scale-105">
                <Droplets className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-600 dark:text-blue-400">DripTech</h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Smart Irrigation Solutions</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigation.map((item) => (
                item.submenu ? (
                  <DropdownMenu key={item.name}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className={`h-10 px-3 text-sm font-medium transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 ${
                          location.startsWith(item.href) 
                            ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                            : "text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        {item.name}
                        <ChevronDown className="ml-1 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      {item.submenu.map((subItem) => (
                        <DropdownMenuItem key={subItem.name} asChild>
                          <Link 
                            href={subItem.href}
                            className="flex w-full items-center px-3 py-2 text-sm hover:bg-blue-50 hover:text-blue-600 cursor-pointer"
                          >
                            {subItem.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant="ghost"
                      className={`h-10 px-3 text-sm font-medium transition-colors hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 ${
                        location === item.href 
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" 
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {item.name}
                    </Button>
                  </Link>
                )
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="h-9 w-9 px-0"
              >
                {theme === "light" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Link href="/quote">
                <Button size="sm" className="bg-green-600 hover:bg-green-700">
                  Get Quote
                </Button>
              </Link>
            </div>

            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-green-600">
                      <Droplets className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-lg font-bold text-blue-600">DripTech</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={closeSheet}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>

                <nav className="space-y-2">
                  {navigation.map((item) => (
                    <div key={item.name}>
                      <Link href={item.href} onClick={closeSheet}>
                        <Button
                          variant="ghost"
                          className={`w-full justify-start h-10 px-3 ${
                            location === item.href 
                              ? "bg-blue-50 text-blue-600" 
                              : "text-gray-700"
                          }`}
                        >
                          {item.name}
                        </Button>
                      </Link>
                      {item.submenu && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.submenu.map((subItem) => (
                            <Link key={subItem.name} href={subItem.href} onClick={closeSheet}>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start text-gray-600 hover:text-blue-600"
                              >
                                {subItem.name}
                              </Button>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </nav>

                <div className="mt-6 space-y-3">
                  <Button
                    variant="outline"
                    onClick={toggleTheme}
                    className="w-full justify-start"
                  >
                    {theme === "light" ? (
                      <>
                        <Moon className="h-4 w-4 mr-2" />
                        Dark Mode
                      </>
                    ) : (
                      <>
                        <Sun className="h-4 w-4 mr-2" />
                        Light Mode
                      </>
                    )}
                  </Button>
                  <Link href="/quote" onClick={closeSheet}>
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Get Quote
                    </Button>
                  </Link>
                </div>

                {/* Contact Info in Mobile */}
                <div className="mt-6 pt-6 border-t space-y-3 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4" />
                    <span>+254 123 456 789</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Mail className="h-4 w-4" />
                    <span>info@driptech.co.ke</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <span>Nairobi, Kenya</span>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
}
