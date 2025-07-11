# DripTech Irrigation Website

## Overview

DripTech is a comprehensive irrigation solutions website built with modern web technologies. The application serves as a platform for showcasing premium irrigation products, managing customer quotes, and providing detailed project information. It features a React frontend with TypeScript, a Node.js/Express backend, and PostgreSQL database integration through Drizzle ORM.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Zod validation
- **Theme System**: Custom theme provider with light/dark mode support

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT-based authentication with bcrypt password hashing
- **API Design**: RESTful API endpoints under `/api` namespace

### Database Schema
- **Users**: Role-based access control (user, admin, super_admin)
- **Products**: Comprehensive product catalog with categories, specifications, and inventory
- **Quotes**: Customer quote management with status tracking
- **Projects**: Project portfolio with detailed information
- **Blog Posts**: Content management for blog articles
- **Contacts**: Customer inquiry management

## Key Components

### Public Pages
- **Home**: Hero section with featured products and projects
- **Products**: Filterable product catalog with search functionality
- **Services**: Service offerings and process descriptions
- **Projects**: Portfolio showcase with project details
- **About**: Company information and team profiles
- **Contact**: Contact form and company information
- **Blog**: Article listing and content management
- **Quote**: Quote request form with package options

### Admin Dashboard
- **Login**: Secure authentication for admin access
- **Dashboard**: Overview of system metrics and recent activity
- **Products**: CRUD operations for product management
- **Quotes**: Quote management and PDF generation
- **Users**: User management and role assignment

### UI Components
- **shadcn/ui**: Comprehensive component library with consistent design
- **Product Cards**: Reusable product display components
- **Quote Forms**: Multi-step quote generation forms
- **Theme Toggle**: Light/dark mode switching
- **Responsive Design**: Mobile-first approach with breakpoint optimization

## Data Flow

### Authentication Flow
1. User submits credentials via login form
2. Server validates credentials and generates JWT token
3. Token stored in localStorage for subsequent requests
4. Protected routes verify token validity through middleware

### Product Management
1. Admin creates/updates products through admin interface
2. Product data stored in PostgreSQL with Drizzle ORM
3. Public product pages fetch data through API endpoints
4. Product filtering and search implemented client-side

### Quote Generation
1. Customer submits quote request through public form
2. Quote data stored with "pending" status
3. Admin reviews and updates quotes through admin dashboard
4. PDF generation available for completed quotes

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **@hookform/resolvers**: Form validation integration
- **bcrypt**: Password hashing for security
- **jsonwebtoken**: JWT token generation and verification

### UI Dependencies
- **@radix-ui**: Accessible primitive components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **lucide-react**: Icon library

### Development Dependencies
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for Node.js
- **esbuild**: Fast JavaScript bundler

## Deployment Strategy

### Build Process
1. Frontend: Vite builds React application to `dist/public`
2. Backend: esbuild compiles TypeScript server to `dist/index.js`
3. Database: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string (required)
- **JWT_SECRET**: Secret key for JWT token signing
- **NODE_ENV**: Environment mode (development/production)

### Production Deployment
- Server serves static files from `dist/public` directory
- Express API handles dynamic content and authentication
- PostgreSQL database managed through Drizzle schema migrations

## Changelog

```
Changelog:
- July 05, 2025. Initial setup
- July 06, 2025. Enhanced admin login with improved error handling
  - Updated admin credentials to admin@driptech.co.ke / admin123
  - Improved error messages with specific details for login failures
  - Fixed product detail page rendering issues
  - Enhanced PostgreSQL database integration
- July 08, 2025. Complete migration and admin fixes
  - Successfully migrated from Replit Agent to standard Replit environment
  - Fixed admin success story date validation issues
  - Fixed team member email field validation
  - Implemented SendGrid email functionality for quote delivery
  - Added proper admin user account (admin@driptech.co.ke / admin123)
  - Prepared project for easy Vercel deployment with configuration
  - Enhanced responsive navbar design
  - Created comprehensive deployment documentation
- July 08, 2025. Analytics and Admin Enhancements (Final Update)
  - Implemented real visitor analytics tracking (replaced mock data)
  - Added PostgreSQL-based analytics storage with page view tracking
  - Created quick success story creation widget for admin dashboard
  - Enhanced blog functionality with better content management
  - Fixed Vercel deployment configuration (runtime version issues)
  - Added persistent admin credentials across all deployment platforms
  - Implemented automatic page view tracking throughout the application
  - Enhanced admin dashboard with quick action buttons and content creation tools
- July 10, 2025. Replit Agent Migration Complete
  - Successfully migrated from Replit Agent to standard Replit environment
  - Fixed PostgreSQL database connection and schema setup
  - Installed all required dependencies (tsx, Node.js packages)
  - Removed all Vercel-related files and configurations (build scripts, deployment configs, API folders)
  - Fixed admin login functionality for Replit environment
  - Simplified project structure for better Replit compatibility
  - Fixed missing database columns (image, active, timestamp) for team members and success stories
  - Created missing UI components (toaster, toast) for complete React application
  - Resolved all API endpoints returning proper responses
  - Enhanced quote management system with comprehensive editing capabilities
  - Implemented full pricing controls with automatic VAT calculations (16%)
  - Added invoice generation and customer email sending functionality
  - Created enhanced quote editor with item-level pricing and product integration
  - Optimized project for Replit-only deployment (removed Vercel dependencies)
  - Application now runs cleanly on Replit with PostgreSQL database
- July 10, 2025. Vercel Deployment Setup (Second Attempt)
  - Recreated Vercel deployment configuration after user request
  - Fixed missing package.json error by creating api/package.json with all dependencies
  - Copied server and shared directories to api/ for Vercel serverless function access
  - Created proper TypeScript configuration for API directory
  - Updated import paths to use local copies in api/ directory
  - Fixed vercel.json build configuration to use proper static build setup
  - Created comprehensive deployment guide with troubleshooting steps
  - Application ready for Vercel deployment with proper serverless function structure
- July 11, 2025. Replit Agent Migration and Vercel SPA Routing Fix
  - Successfully migrated project from Replit Agent to standard Replit environment
  - Fixed tsx dependency issue - application now runs cleanly on Replit
  - Database connection working properly with PostgreSQL
  - Server running successfully on port 5000
  - Fixed Vercel /admin 404 error by updating vercel.json configuration
  - Replaced routes with rewrites for proper SPA routing on Vercel
  - All client-side routes (including /admin) now properly redirect to index.html
  - Added complete dark/light mode toggle functionality in header
  - Enhanced dark mode styling with proper color schemes for all UI elements
  - Fixed Vercel serverless function initialization with proper async handling
  - Created database tables using Drizzle migration (db:push)
  - Fixed all Vercel API import issues by removing .js extensions from TypeScript imports
  - Updated tsconfig.json with proper module resolution for Vercel deployment
  - Fixed Vercel runtime specification error by removing invalid format and adding Node.js 20.x in package.json
  - All API endpoints tested and working (login, pageview tracking, admin functions)
  - Created comprehensive Vercel deployment guide with troubleshooting steps
  - Migration complete with both Replit and Vercel deployment working perfectly
- July 11, 2025. TypeScript Compilation Errors Fixed for Vercel Deployment
  - Resolved all TypeScript compilation errors preventing Vercel deployment
  - Fixed Drizzle ORM schema validation conflicts between schema.ts and schema-validation.ts
  - Removed problematic schema field references causing type mismatches
  - Fixed database insert operations to match actual schema structure
  - Simplified gamification stats operations to prevent type conflicts
  - All API endpoints remain functional while fixing compilation issues
  - TypeScript compilation now passes successfully with zero errors
  - Vercel deployment ready with clean build process
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```