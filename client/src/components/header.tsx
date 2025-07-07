import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import { Droplets, Sun, Moon, Menu, X, Phone, Mail, MessageCircle } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const { theme, toggleTheme } = useTheme();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/blog", label: "Blog" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex h-16 sm:h-20 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700">
              <Droplets className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-blue-600">DripTech</h1>
              <p className="text-xs text-muted-foreground">Irrigation Solutions</p>
            </div>
          </Link>

          {/* Desktop Navigation and Contact Info */}
          <div className="flex items-center space-x-4 sm:space-x-6 lg:space-x-8">
            <nav className="hidden md:flex items-center space-x-4 lg:space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-xs sm:text-sm font-medium transition-colors hover:text-blue-600 ${
                    isActive(item.href)
                      ? "text-blue-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Contact Info - Phone, Email, and WhatsApp on Desktop */}
            <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-4 items-center text-xs sm:text-sm text-muted-foreground mr-2 lg:mr-4">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="truncate">+254 111 409 454</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                <span className="truncate">driptechs.info@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                <a 
                  href="https://wa.me/254111409454" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="truncate hover:text-blue-600 transition-colors"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="h-8 w-8 sm:h-9 sm:w-9"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
            </Button>

            {/* Get Quote Button */}
            <Link href="/quote">
              <Button className="hidden md:inline-flex bg-blue-600 hover:bg-blue-700 text-xs sm:text-sm px-3 sm:px-4">
                Get Quote
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[360px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center space-x-2">
                    <Droplets className="h-5 w-5 text-blue-600" />
                    <span>DripTech</span>
                  </SheetTitle>
                </SheetHeader>
                <nav className="mt-6 space-y-4">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={`block text-sm font-medium transition-colors hover:text-blue-600 ${
                        isActive(item.href)
                          ? "text-blue-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="pt-4 border-t">
                    <Link href="/quote" onClick={() => setIsOpen(false)}>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm">
                        Get Quote
                      </Button>
                    </Link>
                  </div>
                  <div className="pt-4 space-y-4 text-sm text-muted-foreground">
                    <div className="grid grid-cols-1 gap-3">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="truncate">+254 111 409 454</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="truncate">+254 114 575 401</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="truncate">driptechs.info@gmail.com</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <a 
                          href="https://wa.me/254111409454" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="truncate hover:text-blue-600 transition-colors"
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}