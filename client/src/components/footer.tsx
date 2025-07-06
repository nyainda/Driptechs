import { Link } from "wouter";
import { Droplets, Facebook, Twitter, Linkedin, Instagram, MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                <Droplets className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-blue-400">DripTech</h3>
                <p className="text-xs text-gray-400">Irrigation Solutions</p>
              </div>
            </div>
            <p className="text-gray-400 mb-4">
              Leading provider of advanced irrigation solutions in Kenya. 
              Transforming agriculture through innovative technology and sustainable practices.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/products?category=drip_irrigation" className="hover:text-green-400 transition-colors">
                  Drip Irrigation
                </Link>
              </li>
              <li>
                <Link href="/products?category=sprinkler" className="hover:text-green-400 transition-colors">
                  Sprinkler Systems
                </Link>
              </li>
              <li>
                <Link href="/products?category=filtration" className="hover:text-green-400 transition-colors">
                  Filtration Systems
                </Link>
              </li>
              <li>
                <Link href="/products?category=control" className="hover:text-green-400 transition-colors">
                  Control Systems
                </Link>
              </li>
              <li>
                <Link href="/products?category=fertigation" className="hover:text-green-400 transition-colors">
                  Fertigation
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessories" className="hover:text-green-400 transition-colors">
                  Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <Link href="/services#design" className="hover:text-green-400 transition-colors">
                  System Design
                </Link>
              </li>
              <li>
                <Link href="/services#installation" className="hover:text-green-400 transition-colors">
                  Installation
                </Link>
              </li>
              <li>
                <Link href="/services#maintenance" className="hover:text-green-400 transition-colors">
                  Maintenance
                </Link>
              </li>
              <li>
                <Link href="/services#training" className="hover:text-green-400 transition-colors">
                  Training
                </Link>
              </li>
              <li>
                <Link href="/services#consulting" className="hover:text-green-400 transition-colors">
                  Consulting
                </Link>
              </li>
              <li>
                <Link href="/services#support" className="hover:text-green-400 transition-colors">
                  Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-gray-400">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-green-400" />
                <span>Nairobi Industrial Area, Kenya</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-green-400" />
                <span>+254 700 123 456</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-green-400" />
                <span>info@driptech.co.ke</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-green-400" />
                <span>Mon-Fri: 8AM-5PM</span>
              </div>
            </div>

            <div className="mt-6">
              <h5 className="font-semibold mb-3">Regional Offices</h5>
              <div className="space-y-2 text-sm text-gray-400">
                <div>
                  <strong>Nakuru:</strong> +254 705 987 654
                </div>
                <div>
                  <strong>Eldoret:</strong> +254 708 456 789
                </div>
                <div>
                  <strong>Mombasa:</strong> +254 702 321 654
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} DripTech Irrigation Solutions. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <span>|</span>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}